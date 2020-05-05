import parse from 'csv-parse';
import _ from 'lodash';
import { dateToMDYString, MDYStringToDate } from '../utilities/dateUtilities';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

interface Covid19DataStoreDbSchema extends DBSchema {
  settings: {
    key: string,
    value: any
  },
  data: {
    key: string,
    value: InternalLocationData,
    indexes: {
      byCountryOrRegion: string,
      byProvinceOrState: string
    }
  }
}

interface ParsedCsvRow {
  readonly [key: string]: string | number
}

interface ParsedCsv {
  [location: string]: ParsedCsvRow
}

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

type LocationDataValues = ValuesOnDate[]

export interface LocationData extends InternalLocationData {
  values: LocationDataValues
}

interface InternalValuesOnDate {
  date: string,
  confirmed: number,
  deaths: number | null,
  recovered: number | null,
}

type InternalLocationDataValues = InternalValuesOnDate[];

interface InternalLocationData {
  location: string,
  countryOrRegion: string,
  provinceOrState?: string,
  county?: string,
  latitude: string,
  longitude: string,
  values: InternalLocationDataValues
}

interface InternalDataByLocation {
  [location: string]: InternalLocationData
}

export default class Covid19DataStore {
  private db: IDBPDatabase<Covid19DataStoreDbSchema> | undefined;
  private data: InternalDataByLocation | undefined;
  private dataSetLength: number = 0;
  private _locations: string[] | undefined;
  private _lastUpdated: Date | undefined;
  private _firstDate: Date | undefined;
  private _lastDate: Date | undefined;

  constructor(onLoadingStatusChange?: (isLoading: boolean, loadingMessage: string) => void) {
    this.onLoadingStatusChange = onLoadingStatusChange;
  }

  onLoadingStatusChange?: (isLoading: boolean, loadingMessage: string) => void;

  async setDb() {
    this.db = await openDB<Covid19DataStoreDbSchema>(Covid19DataStore.DB_NAME, 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        db.createObjectStore('data', { keyPath: 'location' });
        db.createObjectStore('settings');

        let dataStore = transaction.objectStore('data');
        dataStore.createIndex('byCountryOrRegion', 'countryOrRegion');
        dataStore.createIndex('byProvinceOrState', 'provinceOrState');
      },
    });
  }

  async loadData() {
    await this.setDb();

    if (this.db == null) {
      throw Covid19DataStore.dbNotOpenError();
    }

    const hasFreshPersistedData = await Covid19DataStore.hasFreshPersistedData(this.db);

    if (!hasFreshPersistedData) {
      const parsedConfirmedData = await this.getParsedDataFromURL(Covid19DataStore.CONFIRMED_URL);
      const parsedDeathsData = await this.getParsedDataFromURL(Covid19DataStore.DEATHS_URL);
      const parsedRecoveredData = await this.getParsedDataFromURL(Covid19DataStore.RECOVERED_URL);
      // const parsedUSConfirmedData = await this.getParsedDataFromURL(Covid19DataStore.US_CONFIRMED_URL);
      // const parsedUSDeathsData = await this.getParsedDataFromURL(Covid19DataStore.US_DEATHS_URL);

      await this.formatAndPersistParsedData(
        parsedConfirmedData,
        parsedDeathsData,
        parsedRecoveredData,
        this.db,
      );

      await Covid19DataStore.persistSettings(this.db);
    }

    await this.loadPersistedData(this.db);
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
    if (this.data == null) {
      throw Covid19DataStore.notLoadedError();
    }

    if (this.locations.indexOf(location) === -1) {
      throw Covid19DataStore.invalidLocationError(location);
    }

    const internalLocationData = this.data[location];
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

  private async getParsedDataFromURL(url: string): Promise<ParsedCsv> {
    const rawResponse = await fetch(url);

    if (!rawResponse.ok) {
      throw Covid19DataStore.fetchFailedError(rawResponse.status, rawResponse.statusText);
    }

    const rawData = await rawResponse.text();

    return await this.parseCsv(rawData);
  }

  private async parseCsv(csv: string): Promise<ParsedCsv> {
    return new Promise<ParsedCsv>((resolve, reject) => {
      const parser = parse(csv, {
        columns: true,
        trim: true,
        cast: (value, context) => {
          if (context.header) {
            // US state data has different column headers,
            // we fix them here.
            if (value === 'Province_State') {
              return Covid19DataStore.PROVINCE_OR_STATE_COLUMN_TITLE;
            } else if (value === 'Country_Region') {
              return Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE;
            } else if (value === 'Long_') {
              return Covid19DataStore.LONGITUDE_COLUMN_TITLE;
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

          if (
            context.column === Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE &&
            value === ''
          ) {
            return undefined;
          }

          return value;
        },
      });

      const parsedCsv: ParsedCsv = {};
      parser.on('readable', () => {
        while (true) {
          const record = parser.read();

          if (record == null) {
            break;
          }

          const countryOrRegion = record[Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE] as string;
          const provinceOrState = record?.[Covid19DataStore.PROVINCE_OR_STATE_COLUMN_TITLE] as (string | undefined);
          const county = record?.[Covid19DataStore.COUNTY_COLUMN_TITLE] as (string | undefined);

          const location = Covid19DataStore.getFullLocationName(countryOrRegion, provinceOrState, county);

          parsedCsv[location] = record;
        }
      });

      parser.on('error', error => {
        reject(error);
      });

      parser.on('end', () => resolve(parsedCsv));
    });
  }

  private async formatAndPersistParsedData(
    parsedConfirmedData: ParsedCsv,
    parsedDeathsData: ParsedCsv,
    parsedRecoveredData: ParsedCsv,
    db: IDBPDatabase<Covid19DataStoreDbSchema>,
  ) {
    for (const location in parsedConfirmedData) {
      if (!parsedConfirmedData.hasOwnProperty(location)) {
        continue;
      }

      const confirmedData = parsedConfirmedData[location];
      const countryOrRegion = confirmedData[Covid19DataStore.COUNTRY_OR_REGION_COLUMN_TITLE] as string;
      const provinceOrState = confirmedData[Covid19DataStore.PROVINCE_OR_STATE_COLUMN_TITLE] as (string | undefined);
      const county = confirmedData[Covid19DataStore.COUNTY_COLUMN_TITLE] as (string | undefined);
      const latitude = confirmedData[Covid19DataStore.LATITUDE_COLUMN_TITLE] as string;
      const longitude = confirmedData[Covid19DataStore.LONGITUDE_COLUMN_TITLE] as string;

      // Remove Canada (Recovered) and Canada (Diamond Princess)
      // from the parsed data, they seem like mistakenly included values.
      if (
        countryOrRegion === 'Canada' &&
        (provinceOrState === 'Recovered' || provinceOrState === 'Diamond Princess')
      ) {
        continue;
      }

      const deathsData = parsedDeathsData?.[location];
      const recoveredData = parsedRecoveredData?.[location];

      const values: InternalLocationDataValues = [];
      Object.keys(confirmedData).forEach((columnName) => {
        if (Covid19DataStore.isDateColumn(columnName)) {
          const confirmed = confirmedData[columnName] as number;

          let deaths = null;
          if (deathsData != null) {
            deaths = deathsData[columnName] as number;
          }

          let recovered = null;
          if (recoveredData != null) {
            recovered = recoveredData[columnName] as number;
          }

          values.push({
            date: columnName,
            confirmed,
            deaths,
            recovered,
          });
        }
      });

      const locationData: InternalLocationData = {
        location,
        countryOrRegion,
        provinceOrState,
        county,
        latitude,
        longitude,
        values,
      };

      await db.put('data', locationData);
    }

    await this.addAustraliaTotalDataToPersistedData(db);
    await this.addCanadaTotalDataToPersistedData(parsedRecoveredData, db);
    await this.addChinaTotalDataToPersistedData(db);
  }

  private async addAustraliaTotalDataToPersistedData(db: IDBPDatabase<Covid19DataStoreDbSchema>) {
    const australiaStateData = await db.getAllFromIndex('data', 'byCountryOrRegion', 'Australia');
    const australiaTotalValues = this.sumMultipleLocationValues(australiaStateData);

    const australiaTotalData: InternalLocationData = {
      location: 'Australia',
      countryOrRegion: 'Australia',
      values: australiaTotalValues,
      latitude: '-25.2744',
      longitude: '133.7751',
    };

    await db.put('data', australiaTotalData);
  }

  private async addCanadaTotalDataToPersistedData(
    parsedRecoveredData: ParsedCsv,
    db: IDBPDatabase<Covid19DataStoreDbSchema>,
  ) {
    const canadaProvincesData = await db.getAllFromIndex('data', 'byCountryOrRegion', 'Canada');
    const canadaTotalValues = this.sumMultipleLocationValues(canadaProvincesData);

    const parsedCanadaRecoveredValues = parsedRecoveredData['Canada'];

    let i = 0;
    for (const columnName in parsedCanadaRecoveredValues) {
      if (
        !parsedCanadaRecoveredValues.hasOwnProperty(columnName) ||
        !Covid19DataStore.isDateColumn(columnName)
      ) {
        continue;
      }

      canadaTotalValues[i].recovered = parsedCanadaRecoveredValues[columnName] as number;
      i++;
    }

    const canadaTotalData: InternalLocationData = {
      location: 'Canada',
      countryOrRegion: 'Canada',
      values: canadaTotalValues,
      latitude: '56.1304',
      longitude: '-106.3468',
    };

    await db.put('data', canadaTotalData);
  }

  private async addChinaTotalDataToPersistedData(db: IDBPDatabase<Covid19DataStoreDbSchema>) {
    const chinaProvincesData = await db.getAllFromIndex('data', 'byCountryOrRegion', 'China');
    const chinaTotalValues = this.sumMultipleLocationValues(chinaProvincesData);

    const chinaTotalData: InternalLocationData = {
      location: 'China',
      countryOrRegion: 'China',
      values: chinaTotalValues,
      latitude: '35.8617',
      longitude: '104.1954',
    };

    await db.put('data', chinaTotalData);
  }

  private sumMultipleLocationValues(data: InternalLocationData[]): InternalLocationDataValues {
    let sum: InternalLocationDataValues = [];

    data.forEach(({ values }, index) => {
      if (index === 0) {
        sum = [...values];
        return;
      }

      values.forEach((valuesOnDate, index) => {
        const totalValuesOnDate = sum[index];
        const { date, confirmed, deaths, recovered } = valuesOnDate;
        const totalConfirmed = confirmed + totalValuesOnDate.confirmed;

        let totalDeaths = totalValuesOnDate.deaths;
        if (deaths != null) {
          totalDeaths = (totalDeaths ?? 0) + deaths;
        }

        let totalRecovered = totalValuesOnDate.recovered;
        if (recovered != null) {
          totalDeaths = (totalRecovered ?? 0) + recovered;
        }

        sum[index] = {
          date,
          confirmed: totalConfirmed,
          deaths: totalDeaths,
          recovered: totalRecovered,
        };
      })
    });

    return sum;
  }

  private async loadPersistedData(db: IDBPDatabase<Covid19DataStoreDbSchema>) {
    this._locations = [];
    this.data = {};

    let cursor = await db.transaction('data').store.openCursor();
    while (cursor) {
      this.data[cursor.key] = cursor.value;
      this._locations.push(cursor.key);

      cursor = await cursor.continue();
    }

    if (this._locations.length === 0) {
      throw Covid19DataStore.persistedDataAnomalyError();
    }

    const firstLocation = this._locations[0];
    const firstLocationData = this.data[firstLocation].values;
    if (firstLocationData == null || firstLocationData.length === 0) {
      throw Covid19DataStore.persistedDataAnomalyError();
    }

    this.dataSetLength = firstLocationData.length as number;
    this._firstDate = MDYStringToDate(firstLocationData[0].date as string);
    this._lastDate = MDYStringToDate(firstLocationData[this.dataSetLength - 1].date as string);

    this._lastUpdated = await db.get('settings', Covid19DataStore.SETTINGS_DATA_LAST_UPDATED_KEY);
    if (this._lastUpdated == null || !(this._lastUpdated instanceof Date)) {
      throw Covid19DataStore.persistedDataAnomalyError();
    }
  }

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
  private static LATITUDE_COLUMN_TITLE = 'Lat';
  private static LONGITUDE_COLUMN_TITLE = 'Long';
  private static DB_NAME = 'Covid19DataStoreDb';
  private static DB_DATA_VALIDITY_MS = 60 * 60 * 1000; // 1 hour
  private static SETTINGS_DATA_EXPIRATION_TIME_KEY = 'DataExpiresAt';
  private static SETTINGS_DATA_LAST_UPDATED_KEY = 'DataLastUpdateAt';

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

  private static async hasFreshPersistedData(db: IDBPDatabase<Covid19DataStoreDbSchema>): Promise<boolean> {
    const dataExpiresAt = await db.get(
      'settings',
      Covid19DataStore.SETTINGS_DATA_EXPIRATION_TIME_KEY,
    ) as (Date | undefined);
    const dataLastUpdatedAt = await db.get(
      'settings',
      Covid19DataStore.SETTINGS_DATA_LAST_UPDATED_KEY,
    ) as (Date | undefined);
    const locationDataCount = await db.count('data');

    if (dataExpiresAt == null || dataLastUpdatedAt == null || locationDataCount < 0) {
      return false;
    }

    return Date.now() < dataExpiresAt.getTime();
  }

  private static async persistSettings(db: IDBPDatabase<Covid19DataStoreDbSchema>) {
    const dataLastUpdated = await Covid19DataStore.getDateOfLastCommitIncludingRepoDirectory();
    const dataExpiresAt = new Date(Date.now() + Covid19DataStore.DB_DATA_VALIDITY_MS);

    await db.put('settings', dataLastUpdated, Covid19DataStore.SETTINGS_DATA_LAST_UPDATED_KEY);
    await db.put('settings', dataExpiresAt, Covid19DataStore.SETTINGS_DATA_EXPIRATION_TIME_KEY);
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

  private static isUSStateOrCountyData(countryOrRegion: string, provinceOrState?: string) {
    return countryOrRegion === 'US' && provinceOrState != null;
  }

  private static invalidLocationError(location: string) {
    return new Error(`Invalid location: "${location}".`);
  }

  private static notLoadedError() {
    return new Error('Store is not populated. Make sure to first call the `loadData` method.');
  }

  private static persistedDataAnomalyError() {
    return new Error('The persisted data seems to be empty or in wrong format.');
  }

  private static fetchFailedError(status: number, statusText: string) {
    return new Error(`There was an error fetching the data. Response status: ${status} - ${statusText}`);
  }

  private static dbNotOpenError() {
    return new Error('IndexedDB connection is not open.');
  }
}
