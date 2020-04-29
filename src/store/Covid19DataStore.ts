import parse from 'csv-parse';
import _ from 'lodash';
import { dateToMDYString, MDYStringToDate } from '../utilities/dateUtilities';
import packageJson from '../../package.json';

interface ParsedCsvRow {
  readonly [key: string]: string | number
}

type ParsedCsv = readonly ParsedCsvRow[];

export interface ValuesOnDate {
  date: string,
  confirmed: number,
  newConfirmed: number,
  deaths: number | null,
  newDeaths: number | null,
  mortalityRate: number | null,
  recovered: number | null,
  newRecovered: number | null,
  recoveryRate: number | null
}

export type DateValuesProperties =
  'date'
  | 'confirmed'
  | 'newConfirmed'
  | 'deaths'
  | 'newDeaths'
  | 'mortalityRate'
  | 'recovered'
  | 'newRecovered'
  | 'recoveryRate'

export interface Location {
  countryOrRegion: string,
  provinceOrState?: string,
}

export interface LocationData extends Location {
  latitude: string,
  longitude: string,
  values: ValuesOnDate[],
}

type InternalDateValues = Pick<ValuesOnDate, 'date' | 'confirmed' | 'recovered' | 'deaths'> &
  Partial<Omit<ValuesOnDate, 'date' | 'confirmed' | 'recovered' | 'deaths'>>

type InternalLocationData = Omit<LocationData, 'values'> & {
  values: InternalDateValues[],
  provinceOrStateData?: {
    [provinceOrState: string]: InternalLocationData
  }
}

interface InternalDataByCountryOrRegion {
  [countryOrRegion: string]: InternalLocationData
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

  private static async getDateOfLastCommitIncludingRepoDirectory(): Promise<Date> {
    const commitDataUrl = 'https://api.github.com/repos/CSSEGISandData/COVID-19/commits?path=csse_covid_19_data%2Fcsse_covid_19_time_series&page=1&per_page=1';

    const response = await fetch(commitDataUrl);

    if (!response.ok) {
      throw this.fetchFailedError(response.status, response.statusText);
    }

    const json = await response.json();

    return new Date(json[0]['commit']['author']['date']);
  }

  static stripDataBeforePropertyExceedsN(locationData: Readonly<LocationData>, property: string, n: number): LocationData {
    const dataClone = _.cloneDeep(locationData);

    if (property !== 'confirmed' && property !== 'deaths') {
      throw new Error('Property should either be "confirmed" or "deaths"');
    }

    return {
      ...dataClone,
      values: dataClone.values.filter(value => (value[property] ?? 0) > n),
    };
  }

  static humanizePropertyName(propertyName: DateValuesProperties): string {
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
      default:
        throw new Error(`"${propertyName}" is not a valid property name.`);
    }
  }

  private static isDateColumn(columnName: string): boolean {
    return !!columnName.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/);
  }

  private static invalidCountryOrRegionError(countryOrRegion: string) {
    return new Error(`Invalid country or region: "${countryOrRegion}".`);
  }

  private static invalidProvinceOrStateError(provinceOrState: string) {
    return new Error(`Invalid province or state: "${provinceOrState}".`);
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

  private dataByCountryOrRegion: InternalDataByCountryOrRegion | undefined;
  private dataSetLength: number = 0;
  private _countriesAndRegions: string[] | undefined;
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
      this.dataByCountryOrRegion = await this.formatParsedData(parsedConfirmedData, parsedDeathsData, parsedRecoveredData);

      this.saveDataToLocalStorage();
    }

    this._countriesAndRegions = Object.keys(this.dataByCountryOrRegion as InternalDataByCountryOrRegion)
      .sort((location1, location2) => location1.localeCompare(location2));

    if (this._countriesAndRegions.length === 0) {
      throw Covid19DataStore.fetchedDataAnomalyError();
    }

    const firstLocationData = this.dataByCountryOrRegion?.[this._countriesAndRegions[0]].values;
    if (firstLocationData == null || firstLocationData.length === 0) {
      throw Covid19DataStore.fetchedDataAnomalyError();
    }

    this.dataSetLength = firstLocationData.length as number;
    this._firstDate = MDYStringToDate(firstLocationData[0].date as string);
    this._lastDate = MDYStringToDate(firstLocationData[this.dataSetLength - 1].date as string);
  }

  get countriesAndRegions(): string[] {
    if (this._countriesAndRegions == null) {
      throw Covid19DataStore.notLoadedError();
    }

    return _.cloneDeep(this._countriesAndRegions);
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

  getProvincesOrStates(countryOrRegion: string) {
    if (this.dataByCountryOrRegion == null) {
      throw Covid19DataStore.notLoadedError();
    }

    if (this.countriesAndRegions.indexOf(countryOrRegion) === -1) {
      throw Covid19DataStore.invalidCountryOrRegionError(countryOrRegion);
    }

    const countryOrRegionData = this.dataByCountryOrRegion[countryOrRegion];

    return Object.keys(countryOrRegionData.provinceOrStateData ?? {});
  }

  getDataByLocation({ countryOrRegion, provinceOrState }: Location): LocationData {
    if (this.dataByCountryOrRegion == null) {
      throw Covid19DataStore.notLoadedError();
    }

    if (this.countriesAndRegions.indexOf(countryOrRegion) === -1) {
      throw Covid19DataStore.invalidCountryOrRegionError(countryOrRegion);
    }

    if (provinceOrState != null && this.getProvincesOrStates(countryOrRegion).indexOf(provinceOrState) === -1) {
      throw Covid19DataStore.invalidProvinceOrStateError(provinceOrState);
    }

    let internalLocationData = this.dataByCountryOrRegion[countryOrRegion];
    if (provinceOrState != null) {
      internalLocationData = internalLocationData.provinceOrStateData?.[provinceOrState] as InternalLocationData;
    }

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
        ..._.cloneDeep(valuesOnDate),
        newConfirmed,
        newRecovered,
        newDeaths,
        recoveryRate,
        mortalityRate,
      };
    });

    return {
      ..._.cloneDeep(_.omit(internalLocationData, 'values', 'provinceOrStateDate')),
      values: locationDataValues,
    };
  }

  getDataByLocations(locations: Location[]): LocationData[] {
    return locations.map(location => this.getDataByLocation(location));
  }

  getDataByLocationAndDate(location: Location, date: Date): ValuesOnDate {
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
    const currentVersion = packageJson.version;

    if (localDataExpirationTimeStr != null) {
      const localDataExpirationTime = parseInt(localDataExpirationTimeStr);

      if (Date.now() > localDataExpirationTime || version !== currentVersion) {
        return false;
      }
    }

    const lastUpdatedTimeStr = localStorage.getItem(Covid19DataStore.LOCAL_STORAGE_LAST_UPDATED_KEY);
    const dataByCountryOrRegionJson = localStorage.getItem(Covid19DataStore.LOCAL_STORAGE_DATA_KEY);

    if (lastUpdatedTimeStr != null && dataByCountryOrRegionJson != null) {
      const lastUpdatedTime = parseInt(lastUpdatedTimeStr);
      const dataByCountryOrRegion = JSON.parse(dataByCountryOrRegionJson);

      this._lastUpdated = new Date(lastUpdatedTime);
      this.dataByCountryOrRegion = dataByCountryOrRegion;

      return true;
    }

    return false;
  }

  private saveDataToLocalStorage() {
    if (this._lastUpdated == null || this.dataByCountryOrRegion == null) {
      throw new Error('Attempted to save corrupt data to local storage.');
    }

    const localDataExpirationTimeStr = (Date.now() + Covid19DataStore.LOCAL_DATA_VALIDITY_MS).toString();
    const lastUpdatedTimeStr = this._lastUpdated.getTime().toString();
    const dataByCountryOrRegionJson = JSON.stringify(this.dataByCountryOrRegion);

    localStorage.setItem(Covid19DataStore.LOCAL_STORAGE_DATA_EXPIRATION_TIME_KEY, localDataExpirationTimeStr);
    localStorage.setItem(Covid19DataStore.LOCAL_STORAGE_LAST_UPDATED_KEY, lastUpdatedTimeStr);
    localStorage.setItem(Covid19DataStore.LOCAL_STORAGE_DATA_KEY, dataByCountryOrRegionJson);
    localStorage.setItem(Covid19DataStore.LOCAL_STORAGE_VERSION_KEY, packageJson.version);
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

  private formatParsedData(parsedConfirmedData: ParsedCsv, parsedDeathsData: ParsedCsv, parsedRecoveredData: ParsedCsv): Promise<InternalDataByCountryOrRegion> {
    return new Promise((resolve, reject) => {
      let internalData;

      try {
        internalData = this.formatDataByCountryOrRegion(parsedConfirmedData, parsedDeathsData, parsedRecoveredData);
        internalData = this.addCountryTotalsToInternalData(internalData);
        internalData = this.addCanadaRecoveredDataToInternalData(internalData, parsedRecoveredData);
      } catch (err) {
        reject(err);
      }

      resolve(internalData);
    });
  }

  private formatDataByCountryOrRegion(parsedConfirmedData: ParsedCsv, parsedDeathsData: ParsedCsv, parsedRecoveredData: ParsedCsv): InternalDataByCountryOrRegion {
    let internalData: InternalDataByCountryOrRegion = {};

    for (let i = 0; i < parsedConfirmedData.length; i++) {
      const confirmedData = parsedConfirmedData[i];
      const countryOrRegion = confirmedData[Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE] as string;
      const provinceOrState = confirmedData[Covid19DataStore.PROVINCE_OR_STATE_COLUMN_TITLE] as string;
      const latitude = confirmedData['Lat'] as string;
      const longitude = confirmedData['Long'] as string;
      const isProvinceOrState = provinceOrState.trim().length > 0;

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

      const values = Object.keys(confirmedData).reduce<InternalDateValues[]>((result, columnName) => {
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

      const locationData: InternalLocationData = {
        countryOrRegion,
        provinceOrState,
        latitude,
        longitude,
        values,
      };

      if (isProvinceOrState) {
        internalData = {
          ...internalData,
          [countryOrRegion]: {
            ...internalData[countryOrRegion],
            provinceOrStateData: {
              [provinceOrState]: locationData,
            },
          },
        };
      } else {
        internalData = {
          ...internalData,
          [countryOrRegion]: {
            ...locationData,
            provinceOrStateData: internalData[countryOrRegion].provinceOrStateData,
          },
        };
      }
    }

    return internalData;
  }

  private addCountryTotalsToInternalData(internalData: InternalDataByCountryOrRegion): InternalDataByCountryOrRegion {
    // All latitudes and longitudes below are taken from Google.
    const australiaData = {
      ...internalData['Australia'],
      latitude: '-25.2744',
      longitude: '133.7751',
    };

    const canadaData = {
      ...internalData['China'],
      latitude: '56.1304',
      longitude: '-106.3468',
    };

    const chinaData = {
      ...internalData['China'],
      latitude: '35.8617',
      longitude: '104.1954',
    };

    if (
      australiaData.provinceOrStateData == null ||
      canadaData.provinceOrStateData == null ||
      chinaData.provinceOrStateData == null
    ) {
      throw Covid19DataStore.fetchedDataAnomalyError();
    }

    australiaData.values = Object.values(australiaData.provinceOrStateData)
      .reduce<InternalDateValues[]>(reduceCountryTotals, []);

    canadaData.values = Object.values(canadaData.provinceOrStateData)
      .reduce<InternalDateValues[]>(reduceCountryTotals, []);

    chinaData.values = Object.values(chinaData.provinceOrStateData)
      .reduce<InternalDateValues[]>(reduceCountryTotals, []);

    return {
      ...internalData,
      'Australia': australiaData,
      'Canada': canadaData,
      'China': chinaData,
    };

    function reduceCountryTotals(
      countryValues: InternalDateValues[],
      stateData: InternalLocationData,
      index: number,
    ) {
      const stateValues = stateData.values;

      if (index === 0) {
        return stateValues;
      }

      return countryValues.map((dateValues, index) => {
        const date = dateValues.date;
        const confirmed = dateValues.confirmed + stateValues[index].confirmed;

        let deaths = dateValues.deaths;
        const stateDeaths = stateValues[index].deaths;
        if (stateDeaths != null) {
          deaths = (deaths ?? 0) + stateDeaths;
        }

        let recovered = dateValues.recovered;
        const locationRecovered = stateValues[index].recovered;
        if (locationRecovered != null) {
          recovered = (recovered ?? 0) + locationRecovered;
        }

        return { date, confirmed, deaths, recovered };
      });
    }
  }

  private addCanadaRecoveredDataToInternalData(internalData: InternalDataByCountryOrRegion, parsedRecoveredData: ParsedCsv) {
    const internalCanadaValues = internalData['Canada'].values;
    const parsedCanadaRecoveredValues = parsedRecoveredData
      .find(data => data[Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE] === 'Canada');

    for (let i = 0; i < internalCanadaValues.length; i++) {
      const { date } = internalCanadaValues[i];
      internalCanadaValues[i].recovered = parseInt(parsedCanadaRecoveredValues?.[date] as string);
    }

    return {
      ...internalData,
      'Canada': {
        ...internalData['Canada'],
        values: internalCanadaValues,
      },
    };
  }
}
