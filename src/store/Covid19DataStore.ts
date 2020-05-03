import parse from 'csv-parse';
import _ from 'lodash';
import { dateToMDYString, MDYStringToDate } from '../utilities/dateUtilities';
import { getCurrentVersion } from '../utilities/versionUtilities';
import { get, set } from 'idb-keyval';

interface ParsedCsvRow {
  readonly [key: string]: string | number
}

type ParsedCsv = readonly ParsedCsvRow[];

export interface ValuesOnDate extends InternalValuesOnDate {
  newConfirmed: number,
  newDeaths: number | null,
  mortalityRate: number | null,
  newRecovered: number | null,
  recoveryRate: number | null
}

export type ValuesOnDateProperty =
  'date'
  | 'confirmed'
  | 'newConfirmed'
  | 'deaths'
  | 'newDeaths'
  | 'mortalityRate'
  | 'recovered'
  | 'newRecovered'
  | 'recoveryRate'

export interface LocationData extends InternalLocationData {
  values: ValuesOnDate[],
}

interface InternalValuesOnDate {
  date: string,
  confirmed: number,
  deaths: number | null,
  recovered: number | null,
}

interface InternalLocationData {
  location: string,
  countryOrRegion: string,
  provinceOrState?: string,
  county?: string,
  latitude: string,
  longitude: string,
  values: InternalValuesOnDate[],
}

interface InternalDataByLocation {
  [location: string]: InternalLocationData
}

export default class Covid19DataStore {
  static valuesOnDateProperties: ValuesOnDateProperty[] = [
    'confirmed', 'deaths', 'recovered', 'date',
    'newConfirmed', 'newDeaths', 'newRecovered',
    'mortalityRate', 'recoveryRate',
  ];

  private static BASE_URL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/';
  private static CONFIRMED_URL = `${Covid19DataStore.BASE_URL}time_series_covid19_confirmed_global.csv`;
  private static DEATHS_URL = `${Covid19DataStore.BASE_URL}time_series_covid19_deaths_global.csv`;
  private static RECOVERED_URL = `${Covid19DataStore.BASE_URL}time_series_covid19_recovered_global.csv`;
  private static US_CONFIRMED_URL = `${Covid19DataStore.BASE_URL}time_series_covid19_confirmed_US.csv`;
  private static US_DEATHS_URL = `${Covid19DataStore.BASE_URL}time_series_covid19_deaths_US.csv`;
  private static COUNTRY_OR_REGION_COLUMN_TITLE = 'Country/Region';
  private static PROVINCE_OR_STATE_COLUMN_TITLE = 'Province/State';
  private static COUNTY_COLUMN_TITLE = 'County';
  private static STORED_DATA_VALIDITY_MS = 60 * 60 * 1000; // 1 hour
  private static STORED_DATA_EXPIRATION_TIME_KEY = 'Covid19DataStoreExpiresAt';
  private static STORED_DATA_LAST_UPDATED_KEY = 'Covid19DataStoreLastUpdateAt';
  private static STORED_DATA_KEY = 'Covid19DataStoreData';
  private static STORED_DATA_VERSION_KEY = 'Covid19DataStoreVersion';

  static isValuesOnDateProperty(str: any): str is ValuesOnDateProperty {
    return (Covid19DataStore.valuesOnDateProperties.indexOf(str) !== -1);
  }

  static stripDataBeforePropertyExceedsN(locationData: Readonly<LocationData>, property: ValuesOnDateProperty, n: number): LocationData {
    const dataClone = _.cloneDeep(locationData);

    return {
      ...dataClone,
      values: dataClone.values.filter(value => (value[property] ?? 0) > n),
    };
  }

  static humanizePropertyName(propertyName: ValuesOnDateProperty): string {
    switch (propertyName) {
      case 'confirmed':
        return 'confirmed cases';
      case 'date':
        return 'date';
      case 'deaths':
        return 'deaths';
      case 'mortalityRate':
        return 'mortality rate';
      case 'newConfirmed':
        return 'new cases';
      case 'newDeaths':
        return 'new deaths';
      case 'newRecovered':
        return 'new recoveries';
      case 'recovered':
        return 'recoveries';
      case 'recoveryRate':
        return 'rate of recoveries';
    }
  }

  private static getFullLocationName(countryOrRegion: string, provinceOrState?: string, county?: string) {
    let location = countryOrRegion;
    let subLocation = provinceOrState;

    if (
      subLocation != null &&
      county != null &&
      subLocation.trim().length > 0 &&
      county.trim().length > 0
    ) {
      subLocation = `${county}, ${subLocation}`;
    }


    if (
      subLocation != null &&
      subLocation.trim().length > 0
    ) {
      location = `${location} (${subLocation})`;
    }

    return location;
  }

  private static async getDateOfLastCommitIncludingRepoDirectory(): Promise<Date> {
    const commitDataUrl = 'https://api.github.com/repos/CSSEGISandData/COVID-19/commits?path=csse_covid_19_data%2Fcsse_covid_19_time_series&page=1&per_page=1';

    const response = await fetch(commitDataUrl);

    if (!response.ok) {
      throw this.fetchFailedError(response.status, response.statusText);
    }

    const json = await response.json();

    return new Date(json[0]['commit']['author']['date']);
  }

  private static isDateColumn(columnName: string): boolean {
    return !!columnName.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/);
  }

  private static isUSStateOrCountyData(countryOrRegion: string, provinceOrState: string) {
    return countryOrRegion === 'US' && provinceOrState !== '';
  }

  private static invalidLocationError(location: string) {
    return new Error(`Invalid location: "${location}".`);
  }

  private static notLoadedError() {
    return new Error('Store is not populated. Make sure to first call the `loadData` method.');
  }

  private static fetchedDataAnomalyError() {
    return new Error('The data fetched from the server seems to be empty or in wrong format.');
  }

  private static fetchFailedError(status: number, statusText: string) {
    return new Error(`There was an error fetching the data. Response status: ${status} - ${statusText}`);
  }

  private dataByLocation: InternalDataByLocation | undefined;
  private dataSetLength: number = 0;
  private _locations: string[] | undefined;
  private _lastUpdated: Date | undefined;
  private _firstDate: Date | undefined;
  private _lastDate: Date | undefined;

  constructor(onLoadingStatusChange?: (isLoading: boolean, loadingMessage: string) => void) {
    this.onLoadingStatusChange = onLoadingStatusChange;
  }

  onLoadingStatusChange?: (isLoading: boolean, loadingMessage: string) => void;

  async loadData(): Promise<void> {
    this.onLoadingStatusChange?.(true, 'loading from storage');
    const storedData = await this.loadStoredData();

    if (!storedData) {
      this.onLoadingStatusChange?.(true, 'getting last updated');
      this._lastUpdated = await Covid19DataStore.getDateOfLastCommitIncludingRepoDirectory();
      this.onLoadingStatusChange?.(true, 'parsing confirmed data');
      const parsedConfirmedData = await this.getParsedDataFromURL(Covid19DataStore.CONFIRMED_URL);
      this.onLoadingStatusChange?.(true, 'parsing deaths data');
      const parsedDeathsData = await this.getParsedDataFromURL(Covid19DataStore.DEATHS_URL);
      this.onLoadingStatusChange?.(true, 'parsing recovered data');
      const parsedRecoveredData = await this.getParsedDataFromURL(Covid19DataStore.RECOVERED_URL);
      this.onLoadingStatusChange?.(true, 'parsing us confirmed data');
      const parsedUSConfirmedData = await this.getParsedDataFromURL(Covid19DataStore.US_CONFIRMED_URL);
      this.onLoadingStatusChange?.(true, 'parsing us deaths data');
      const parsedUSDeathsData = await this.getParsedDataFromURL(Covid19DataStore.US_DEATHS_URL);
      this.onLoadingStatusChange?.(true, 'formatting parsed data');
      this.dataByLocation = await this.formatParsedData(
        parsedConfirmedData,
        parsedDeathsData,
        parsedRecoveredData,
        parsedUSConfirmedData,
        parsedUSDeathsData,
      );

      this.onLoadingStatusChange?.(true, 'saving to storage');
      await this.persistData();
    }

    this.onLoadingStatusChange?.(true, 'preparing locations list');
    this._locations = Object.keys(this.dataByLocation as InternalDataByLocation)
      .sort((location1, location2) => location1.localeCompare(location2));

    if (this._locations.length === 0) {
      throw Covid19DataStore.fetchedDataAnomalyError();
    }

    const firstLocationData = this.dataByLocation?.[this._locations[0]].values;
    if (firstLocationData == null || firstLocationData.length === 0) {
      throw Covid19DataStore.fetchedDataAnomalyError();
    }

    this.dataSetLength = firstLocationData.length as number;
    this._firstDate = MDYStringToDate(firstLocationData[0].date as string);
    this._lastDate = MDYStringToDate(firstLocationData[this.dataSetLength - 1].date as string);
    this.onLoadingStatusChange?.(false, 'loaded');
  }

  get locations(): string[] {
    if (this._locations == null) {
      throw Covid19DataStore.notLoadedError();
    }

    return _.cloneDeep(this._locations);
  }

  get lastUpdated(): Date {
    if (this._lastUpdated == null) {
      throw Covid19DataStore.notLoadedError();
    }

    return new Date(this._lastUpdated.getTime());
  }

  get firstDate(): Date {
    if (this._firstDate == null) {
      throw Covid19DataStore.notLoadedError();
    }

    return new Date(this._firstDate.getTime());
  }

  get lastDate(): Date {
    if (this._lastDate == null) {
      throw Covid19DataStore.notLoadedError();
    }

    return new Date(this._lastDate.getTime());
  }

  getDataByLocation(location: string): LocationData {
    if (this.dataByLocation == null) {
      throw Covid19DataStore.notLoadedError();
    }

    if (this.locations.indexOf(location) === -1) {
      throw Covid19DataStore.invalidLocationError(location);
    }

    const internalLocationData = this.dataByLocation[location];
    const locationDataValues = internalLocationData.values.map((valuesOnDate, index) => {
      let newConfirmed = 0;
      let newRecovered = null;
      let newDeaths = null;
      let recoveryRate: number | null = 0;
      let mortalityRate: number | null = 0;

      if (index > 0) {
        const { confirmed, recovered, deaths } = valuesOnDate;
        const yesterdaysData = internalLocationData.values[index - 1];

        if (recovered != null && yesterdaysData.recovered != null) {
          newRecovered = recovered - yesterdaysData.recovered;
        }

        if (deaths != null && yesterdaysData.deaths != null) {
          newDeaths = deaths - yesterdaysData.deaths;
        }

        if (confirmed != null && yesterdaysData.confirmed != null) {
          newConfirmed = confirmed - yesterdaysData.confirmed;
        }

        if (confirmed != null && confirmed > 0) {
          recoveryRate = recovered != null ? recovered / confirmed : null;
          mortalityRate = deaths != null ? deaths / confirmed : null;
        }
      }

      return {
        ...valuesOnDate,
        newConfirmed,
        newRecovered,
        newDeaths,
        recoveryRate,
        mortalityRate,
      };
    });

    return {
      ..._.cloneDeep(_.omit(internalLocationData, 'values')),
      values: locationDataValues,
    };
  }

  getDataByLocations(locations: string[]): LocationData[] {
    return locations.map(location => this.getDataByLocation(location));
  }

  getDataByLocationAndDate(location: string, date: Date): ValuesOnDate {
    const locationData = this.getDataByLocation(location);
    const dateStr = dateToMDYString(date);

    const data = locationData.values.find(dateValues => dateValues.date === dateStr);

    if (data == null) {
      throw new Error(`Cannot find any data for ${date.toDateString()}`);
    }

    return data;
  }

  private async loadStoredData(): Promise<boolean> {
    const storedDataExpiresAt = await get<Date | undefined>(Covid19DataStore.STORED_DATA_EXPIRATION_TIME_KEY);
    const storedDataVersion = await get<string | undefined>(Covid19DataStore.STORED_DATA_VERSION_KEY);
    const appVersion = getCurrentVersion();

    if (storedDataExpiresAt == null || storedDataVersion == null) {
      return false;
    }

    if (Date.now() > storedDataExpiresAt.getTime() || storedDataVersion !== appVersion) {
      return false;
    }

    const storedDataLastUpdatedAt = await get<Date | undefined>(Covid19DataStore.STORED_DATA_LAST_UPDATED_KEY);
    const storedData = await get<InternalDataByLocation | undefined>(Covid19DataStore.STORED_DATA_KEY);

    if (storedDataLastUpdatedAt == null || storedData == null) {
      return false;
    }

    this._lastUpdated = storedDataLastUpdatedAt;
    this.dataByLocation = storedData;

    return true;
  }

  private async persistData() {
    if (this._lastUpdated == null || this.dataByLocation == null) {
      throw new Error('Attempted to store corrupt data.');
    }

    const storedDataExpiresAt = new Date(Date.now() + Covid19DataStore.STORED_DATA_VALIDITY_MS);

    await set(Covid19DataStore.STORED_DATA_EXPIRATION_TIME_KEY, storedDataExpiresAt);
    await set(Covid19DataStore.STORED_DATA_LAST_UPDATED_KEY, this._lastUpdated);
    await set(Covid19DataStore.STORED_DATA_KEY, this.dataByLocation);
    await set(Covid19DataStore.STORED_DATA_VERSION_KEY, getCurrentVersion());
  }

  private async getParsedDataFromURL(url: string): Promise<ParsedCsv> {
    const rawResponse = await fetch(url);

    if (!rawResponse.ok) {
      throw Covid19DataStore.fetchFailedError(rawResponse.status, rawResponse.statusText);
    }

    const rawData = await rawResponse.text();

    return await this.parseCsv(rawData);
  }

  private parseCsv(text: string): Promise<ParsedCsv> {
    return new Promise((resolve, reject) => {
      parse(
        text,
        {
          columns: true,
          cast: (value, context) => {
            if (context.header) {
              // US state data has different column headers,
              // we fix them here.
              if (value === 'Province_State') {
                return Covid19DataStore.PROVINCE_OR_STATE_COLUMN_TITLE;
              } else if (value === 'Country_Region') {
                return Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE;
              } else if (value === 'Long_') {
                return 'Long';
              } else if (value === 'Admin2') {
                return Covid19DataStore.COUNTY_COLUMN_TITLE;
              }

              return value;
            }

            if (typeof context.column !== 'string') {
              throw new Error('Context column name should be of type `string`.');
            }

            if (Covid19DataStore.isDateColumn(context.column)) {
              return parseInt(value);
            }

            return value;
          },
        },
        (err, output) => {
          if (err) {
            reject(err);
          }

          resolve(output);
        },
      );
    });
  }

  private formatParsedData(
    parsedConfirmedData: ParsedCsv,
    parsedDeathsData: ParsedCsv,
    parsedRecoveredData: ParsedCsv,
    parsedUSConfirmedData: ParsedCsv,
    parsedUSDeathsData: ParsedCsv,
  ): Promise<InternalDataByLocation> {
    return new Promise((resolve, reject) => {
      let formattedData;

      try {
        formattedData = this.formatDataByLocation(
          parsedConfirmedData,
          parsedDeathsData,
          parsedRecoveredData,
          parsedUSConfirmedData,
          parsedUSDeathsData,
        );
        formattedData = this.addCountryTotalsToFormattedData(formattedData);
        formattedData = this.addCanadaRecoveredDataToFormattedData(formattedData, parsedRecoveredData);
      } catch (err) {
        reject(err);
      }

      resolve(formattedData);
    });
  }

  private formatDataByLocation(
    parsedConfirmedData: ParsedCsv,
    parsedDeathsData: ParsedCsv,
    parsedRecoveredData: ParsedCsv,
    parsedUSConfirmedData: ParsedCsv,
    parsedUSDeathsData: ParsedCsv,
  ): InternalDataByLocation {
    let formattedData: InternalDataByLocation = {};

    const combinedParsedConfirmedData = [...parsedConfirmedData, ...parsedUSConfirmedData];
    const combinedParsedDeathsData = [...parsedDeathsData, ...parsedUSDeathsData];

    combinedParsedConfirmedData.forEach(row => {
      const confirmedData = row;
      const countryOrRegion = confirmedData[Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE] as string;
      const provinceOrState = confirmedData[Covid19DataStore.PROVINCE_OR_STATE_COLUMN_TITLE] as string;
      const county = confirmedData[Covid19DataStore.COUNTY_COLUMN_TITLE] as (string | undefined);
      const latitude = confirmedData['Lat'] as string;
      const longitude = confirmedData['Long'] as string;

      // Remove Canada (Recovered) and Canada (Diamond Princess)
      // from the parsed data, they seem like mistakenly included values.
      if (
        countryOrRegion === 'Canada' &&
        (provinceOrState === 'Recovered' || provinceOrState === 'Diamond Princess')
      ) {
        return;
      }

      const deathsData = combinedParsedDeathsData
        .find(deaths =>
          deaths[Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE] === countryOrRegion &&
          deaths[Covid19DataStore.PROVINCE_OR_STATE_COLUMN_TITLE] === provinceOrState &&
          deaths[Covid19DataStore.COUNTY_COLUMN_TITLE] === county,
        );

      let recoveredData: (ParsedCsvRow | undefined) = undefined;
      if (!Covid19DataStore.isUSStateOrCountyData(countryOrRegion, provinceOrState)) {
        recoveredData = parsedRecoveredData
          .find(recovered =>
            recovered[Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE] === countryOrRegion &&
            recovered[Covid19DataStore.PROVINCE_OR_STATE_COLUMN_TITLE] === provinceOrState,
          );
      }

      const location = Covid19DataStore.getFullLocationName(countryOrRegion, provinceOrState, county);

      const values = Object.keys(confirmedData).reduce<InternalValuesOnDate[]>((result, columnName) => {
        if (Covid19DataStore.isDateColumn(columnName)) {
          const dateStr = columnName;
          const confirmed = confirmedData[dateStr] as number;

          let deaths = null;
          if (deathsData != null) {
            deaths = deathsData[dateStr] as number;
          }

          let recovered = null;
          if (recoveredData != null) {
            recovered = recoveredData[dateStr] as number;
          }

          result = [...result, { date: dateStr, confirmed, deaths, recovered }];
        }

        return result;
      }, []);

      formattedData = {
        ...formattedData,
        [location]: {
          location,
          countryOrRegion,
          provinceOrState: provinceOrState.trim().length > 0 ? provinceOrState : undefined,
          county,
          latitude,
          longitude,
          values,
        },
      };
    });

    return formattedData;
  }

  private addCountryTotalsToFormattedData(formattedData: InternalDataByLocation): InternalDataByLocation {
    // All latitudes and longitudes below are taken from Google.
    const australiaTotalData: LocationData = {
      location: 'Australia',
      countryOrRegion: 'Australia',
      values: [],
      latitude: '-25.2744',
      longitude: '133.7751',
    };
    const canadaTotalData: LocationData = {
      location: 'Canada',
      countryOrRegion: 'Canada',
      values: [],
      latitude: '56.1304',
      longitude: '-106.3468',
    };
    const chinaTotalData: LocationData = {
      location: 'China',
      countryOrRegion: 'China',
      values: [],
      latitude: '35.8617',
      longitude: '104.1954',
    };

    Object.keys(formattedData).forEach((location) => {
      const locationData = formattedData[location];

      let countryTotalData: InternalLocationData;
      if (location.includes('China')) {
        countryTotalData = chinaTotalData;
      } else if (location.includes('Australia')) {
        countryTotalData = australiaTotalData;
      } else if (location.includes('Canada')) {
        countryTotalData = canadaTotalData;
      } else {
        return;
      }

      if (countryTotalData.values.length === 0) {
        countryTotalData.values = locationData.values;
      } else {
        countryTotalData.values.forEach((value, index) => {
          countryTotalData.values[index].confirmed += locationData.values[index].confirmed;

          const totalDeaths = countryTotalData.values[index].deaths;
          const locationDeaths = locationData.values[index].deaths;
          if (locationDeaths != null) {
            countryTotalData.values[index].deaths = (totalDeaths ?? 0) + locationDeaths;
          }

          const totalRecovered = countryTotalData.values[index].recovered;
          const locationRecovered = locationData.values[index].recovered;
          if (locationRecovered != null) {
            countryTotalData.values[index].recovered = (totalRecovered ?? 0) + locationRecovered;
          }
        });
      }
    });

    return {
      ...formattedData,
      [australiaTotalData.location]: australiaTotalData,
      [canadaTotalData.location]: canadaTotalData,
      [chinaTotalData.location]: chinaTotalData,
    };
  }

  private addCanadaRecoveredDataToFormattedData(formattedData: InternalDataByLocation, parsedRecoveredData: ParsedCsv) {
    const formattedCanadaValues = formattedData['Canada'].values;
    const parsedCanadaRecoveredValues = parsedRecoveredData
      .find(data => data[Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE] === 'Canada');

    for (let i = 0; i < formattedCanadaValues.length; i++) {
      const date = formattedCanadaValues[i].date;
      formattedCanadaValues[i].recovered = parseInt(parsedCanadaRecoveredValues?.[date] as string);
    }

    return {
      ...formattedData,
      'Canada': {
        ...formattedData['Canada'],
        values: formattedCanadaValues,
      },
    };
  }
}
