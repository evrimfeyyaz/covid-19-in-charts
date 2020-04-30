import parse from 'csv-parse';
import _ from 'lodash';
import { dateToMDYString, MDYStringToDate } from '../utilities/dateUtilities';
import { getCurrentVersion } from '../utilities/versionUtilities';

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

export function isValuesOnDateProperty(str: any): str is ValuesOnDateProperty {
  const valuesOnDateProperties = [
    'date', 'confirmed', 'newConfirmed', 'deaths',
    'newDeaths', 'mortalityRate', 'recovered',
    'newRecovered', 'recoveryRate',
  ];

  return (valuesOnDateProperties.indexOf(str) !== -1);
}

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
  latitude: string,
  longitude: string,
  values: InternalValuesOnDate[],
}

interface InternalDataByLocation {
  [location: string]: InternalLocationData
}

export default class Covid19DataStore {
  private static BASE_URL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/';
  private static CONFIRMED_URL = `${Covid19DataStore.BASE_URL}time_series_covid19_confirmed_global.csv`;
  private static DEATHS_URL = `${Covid19DataStore.BASE_URL}time_series_covid19_deaths_global.csv`;
  private static RECOVERED_URL = `${Covid19DataStore.BASE_URL}time_series_covid19_recovered_global.csv`;
  private static COUNTRY_OR_REGION_COLUMN_TITLE = 'Country/Region';
  private static PROVINCE_OR_STATE_COLUMN_TITLE = 'Province/State';
  private static LOCAL_DATA_VALIDITY_MS = 60 * 60 * 1000; // 1 hour
  private static LOCAL_STORAGE_DATA_EXPIRATION_TIME_KEY = 'covid19DataStoreExpiresAt';
  private static LOCAL_STORAGE_LAST_UPDATED_KEY = 'covid19DataStoreLastUpdatedAt';
  private static LOCAL_STORAGE_DATA_KEY = 'covid19DataStoreData';
  private static LOCAL_STORAGE_VERSION_KEY = 'covid19DataStoreVersion';

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
        return 'new confirmed cases';
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

  async loadData(): Promise<void> {
    const localStorageLoadResult = this.loadDataFromLocalStorage();

    if (!localStorageLoadResult) {
      this._lastUpdated = await Covid19DataStore.getDateOfLastCommitIncludingRepoDirectory();
      const parsedConfirmedData = await this.getParsedDataFromURL(Covid19DataStore.CONFIRMED_URL);
      const parsedDeathsData = await this.getParsedDataFromURL(Covid19DataStore.DEATHS_URL);
      const parsedRecoveredData = await this.getParsedDataFromURL(Covid19DataStore.RECOVERED_URL);
      this.dataByLocation = await this.formatParsedData(parsedConfirmedData, parsedDeathsData, parsedRecoveredData);

      this.saveDataToLocalStorage();
    }

    this._locations = Object.keys(this.dataByLocation as InternalDataByLocation).sort((location1, location2) => location1.localeCompare(location2));

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

  private loadDataFromLocalStorage(): boolean {
    const localDataExpirationTimeStr = localStorage.getItem(Covid19DataStore.LOCAL_STORAGE_DATA_EXPIRATION_TIME_KEY);
    const version = localStorage.getItem(Covid19DataStore.LOCAL_STORAGE_VERSION_KEY);
    const currentVersion = getCurrentVersion();

    if (localDataExpirationTimeStr == null) {
      return false;
    }

    const localDataExpirationTime = parseInt(localDataExpirationTimeStr);

    if (Date.now() > localDataExpirationTime || version !== currentVersion) {
      return false;
    }

    const lastUpdatedTimeStr = localStorage.getItem(Covid19DataStore.LOCAL_STORAGE_LAST_UPDATED_KEY);
    const dataByLocationJson = localStorage.getItem(Covid19DataStore.LOCAL_STORAGE_DATA_KEY);

    if (lastUpdatedTimeStr != null && dataByLocationJson != null) {
      const lastUpdatedTime = parseInt(lastUpdatedTimeStr);
      const dataByLocation = JSON.parse(dataByLocationJson);

      this._lastUpdated = new Date(lastUpdatedTime);
      this.dataByLocation = dataByLocation;

      return true;
    }

    return false;
  }

  private saveDataToLocalStorage() {
    if (this._lastUpdated == null || this.dataByLocation == null) {
      throw new Error('Attempted to save corrupt data to local storage.');
    }

    const localDataExpirationTimeStr = (Date.now() + Covid19DataStore.LOCAL_DATA_VALIDITY_MS).toString();
    const lastUpdatedTimeStr = this._lastUpdated?.getTime().toString();
    const dataByLocationJson = JSON.stringify(this.dataByLocation);

    localStorage.setItem(Covid19DataStore.LOCAL_STORAGE_DATA_EXPIRATION_TIME_KEY, localDataExpirationTimeStr);
    localStorage.setItem(Covid19DataStore.LOCAL_STORAGE_LAST_UPDATED_KEY, lastUpdatedTimeStr);
    localStorage.setItem(Covid19DataStore.LOCAL_STORAGE_DATA_KEY, dataByLocationJson);
    localStorage.setItem(Covid19DataStore.LOCAL_STORAGE_VERSION_KEY, getCurrentVersion());
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

  private formatParsedData(parsedConfirmedData: ParsedCsv, parsedDeathsData: ParsedCsv, parsedRecoveredData: ParsedCsv): Promise<InternalDataByLocation> {
    return new Promise((resolve, reject) => {
      let formattedData;

      try {
        formattedData = this.formatDataByLocation(parsedConfirmedData, parsedDeathsData, parsedRecoveredData);
        formattedData = this.addCountryTotalsToFormattedData(formattedData);
        formattedData = this.addCanadaRecoveredDataToFormattedData(formattedData, parsedRecoveredData);
      } catch (err) {
        reject(err);
      }

      resolve(formattedData);
    });
  }

  private formatDataByLocation(parsedConfirmedData: ParsedCsv, parsedDeathsData: ParsedCsv, parsedRecoveredData: ParsedCsv): InternalDataByLocation {
    let formattedData: InternalDataByLocation = {};

    for (let i = 0; i < parsedConfirmedData.length; i++) {
      const confirmedData = parsedConfirmedData[i];
      const countryOrRegion = confirmedData[Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE] as string;
      const provinceOrState = confirmedData[Covid19DataStore.PROVINCE_OR_STATE_COLUMN_TITLE] as string;
      const latitude = confirmedData['Lat'] as string;
      const longitude = confirmedData['Long'] as string;

      // Remove Canada (Recovered) and Canada (Diamond Princess)
      // from the parsed data, they seem like mistakenly included values.
      if (
        countryOrRegion === 'Canada' &&
        (provinceOrState === 'Recovered' || provinceOrState === 'Diamond Princess')
      ) {
        continue;
      }

      const deathsData = parsedDeathsData
        .find(deaths =>
          deaths[Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE] === countryOrRegion &&
          deaths[Covid19DataStore.PROVINCE_OR_STATE_COLUMN_TITLE] === provinceOrState,
        );
      const recoveredData = parsedRecoveredData
        .find(recovered =>
          recovered[Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE] === countryOrRegion
          && recovered[Covid19DataStore.PROVINCE_OR_STATE_COLUMN_TITLE] === provinceOrState,
        );

      let location = countryOrRegion;
      if (provinceOrState.trim().length > 0) {
        location = `${location} (${provinceOrState})`;
      }

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
          latitude,
          longitude,
          values,
        },
      };
    }

    return formattedData;
  }

  private addCountryTotalsToFormattedData(formattedData: InternalDataByLocation): InternalDataByLocation {
    // All latitudes and longitudes below are taken from Google.
    const australiaTotalData: LocationData = {
      location: `Australia`,
      values: [],
      latitude: '-25.2744',
      longitude: '133.7751',
    };
    const canadaTotalData: LocationData = {
      location: `Canada`,
      values: [],
      latitude: '56.1304',
      longitude: '-106.3468',
    };
    const chinaTotalData: LocationData = {
      location: `China`,
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
