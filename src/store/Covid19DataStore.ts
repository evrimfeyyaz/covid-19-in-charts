import parse from 'csv-parse';
import _ from 'lodash';
import { dateToMDYString, MDYStringToDate } from '../utilities/dateUtilities';
import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { US_LOCATIONS, US_STATES } from './usLocations';

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

export default class Covid19DataStore {
  private db: IDBPDatabase<Covid19DataStoreDbSchema> | undefined;
  private dataSetLength: number = 0;
  private _locations: string[] | undefined;
  private _lastUpdated: Date | undefined;
  private _firstDate: Date | undefined;
  private _lastDate: Date | undefined;

  constructor(onLoadingStatusChange?: (isLoading: boolean, loadingMessage?: string) => void) {
    this.onLoadingStatusChange = onLoadingStatusChange;
  }

  onLoadingStatusChange?: (isLoading: boolean, loadingMessage?: string) => void;

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
    this.onLoadingStatusChange?.(true, 'Opening database connection.');
    await this.setDb();

    if (this.db == null) {
      throw Covid19DataStore.dbNotOpenError();
    }

    this.onLoadingStatusChange?.(true, 'Checking if the COVID-19 data already exists.');
    const hasFreshPersistedData = await Covid19DataStore.hasFreshPersistedData(this.db);

    if (!hasFreshPersistedData) {
      this.onLoadingStatusChange?.(true, 'Fetching new data.');
      const parsedConfirmedData = await this.getParsedDataFromURL(Covid19DataStore.CONFIRMED_URL);
      const parsedDeathsData = await this.getParsedDataFromURL(Covid19DataStore.DEATHS_URL);
      const parsedRecoveredData = await this.getParsedDataFromURL(Covid19DataStore.RECOVERED_URL);

      this.onLoadingStatusChange?.(true, 'Formatting and saving the fetched data.');
      await Covid19DataStore.clearData(this.db);
      await this.formatAndPersistParsedData(this.db, parsedConfirmedData, parsedDeathsData, parsedRecoveredData);
      await this.addAustraliaTotalDataToPersistedData(this.db);
      await this.addCanadaTotalDataToPersistedData(parsedRecoveredData, this.db);
      await this.addChinaTotalDataToPersistedData(this.db);

      await Covid19DataStore.persistSettings(this.db);
    }

    this.onLoadingStatusChange?.(true, 'Creating the locations list.');
    await this.setLastUpdatedAt(this.db);
    await this.setLocations(this.db);
    this.onLoadingStatusChange?.(false);
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

  async getDataByLocation(location: string): Promise<LocationData> {
    if (this.db == null) {
      throw Covid19DataStore.dbNotOpenError();
    }

    let internalLocationData = await this.db.get('data', location);

    // Check if the user is requesting US state data while it
    // is not yet loaded.
    if (location.includes('US') && internalLocationData == null) {
      this.onLoadingStatusChange?.(true, 'Loading the US state and county data. This might take a short while.');
      await this.loadUSCountyData(this.db);
      this.onLoadingStatusChange?.(false);
      internalLocationData = await this.db.get('data', location);
    }

    if (internalLocationData == null) {
      throw Covid19DataStore.invalidLocationError(location);
    }

    const locationDataValues = internalLocationData.values.map((valuesOnDate, index) => {
      let newConfirmed = 0;
      let newRecovered = null;
      let newDeaths = null;
      let recoveryRate: number | null = 0;
      let mortalityRate: number | null = 0;

      if (index > 0) {
        const { confirmed, recovered, deaths } = valuesOnDate;
        let yesterdaysData = internalLocationData?.values[index - 1];

        if (recovered != null && yesterdaysData?.recovered != null) {
          newRecovered = recovered - yesterdaysData.recovered;
        }

        if (deaths != null && yesterdaysData?.deaths != null) {
          newDeaths = deaths - yesterdaysData.deaths;
        }

        if (confirmed != null && yesterdaysData?.confirmed != null) {
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

  async getDataByLocations(locations: string[]): Promise<LocationData[]> {
    const locationsData: LocationData[] = [];
    for (const location of locations) {
      locationsData.push(await this.getDataByLocation(location));
    }

    return locationsData;
  }

  async getDataByLocationAndDate(location: string, date: Date): Promise<ValuesOnDate> {
    const locationData = await this.getDataByLocation(location);
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
    db: IDBPDatabase<Covid19DataStoreDbSchema>,
    parsedConfirmedData: ParsedCsv,
    parsedDeathsData: ParsedCsv,
    parsedRecoveredData?: ParsedCsv,
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
  }

  private async addAustraliaTotalDataToPersistedData(db: IDBPDatabase<Covid19DataStoreDbSchema>) {
    const australiaStateData = await db.getAllFromIndex('data', 'byCountryOrRegion', 'Australia');
    const australiaTotalValues = this.sumMultipleLocationValues(australiaStateData);

    // Latitudes and longitudes are from:
    // https://www.latlong.net/
    const australiaTotalData: InternalLocationData = {
      location: 'Australia',
      countryOrRegion: 'Australia',
      values: australiaTotalValues,
      latitude: '-25.274399',
      longitude: '133.775131',
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

    // Latitudes and longitudes are from:
    // https://www.latlong.net/
    const canadaTotalData: InternalLocationData = {
      location: 'Canada',
      countryOrRegion: 'Canada',
      values: canadaTotalValues,
      latitude: '56.130367',
      longitude: '-106.346771',
    };

    await db.put('data', canadaTotalData);
  }

  private async addChinaTotalDataToPersistedData(db: IDBPDatabase<Covid19DataStoreDbSchema>) {
    const chinaProvincesData = await db.getAllFromIndex('data', 'byCountryOrRegion', 'China');
    const chinaTotalValues = this.sumMultipleLocationValues(chinaProvincesData);

    // Latitudes and longitudes are from:
    // https://www.latlong.net/
    const chinaTotalData: InternalLocationData = {
      location: 'China',
      countryOrRegion: 'China',
      values: chinaTotalValues,
      latitude: '35.861660',
      longitude: '104.195396',
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
      });
    });

    return sum;
  }

  private async setLastUpdatedAt(db: IDBPDatabase<Covid19DataStoreDbSchema>) {
    this._lastUpdated = await db.get('settings', Covid19DataStore.SETTINGS_DATA_LAST_UPDATED_KEY);
    if (this._lastUpdated == null) {
      throw Covid19DataStore.persistedDataAnomalyError();
    }
  }

  private async setLocations(db: IDBPDatabase<Covid19DataStoreDbSchema>) {
    this._locations = await db.getAllKeys('data');

    if (this._locations.length === 0) {
      throw Covid19DataStore.persistedDataAnomalyError();
    }

    this.addUSStatesAndCountiesToLocations();

    const firstLocation = this._locations[0];
    const firstLocationData = (await db.get('data', firstLocation))?.values;
    if (firstLocationData == null || firstLocationData.length === 0) {
      throw Covid19DataStore.persistedDataAnomalyError();
    }

    this.dataSetLength = firstLocationData.length as number;
    this._firstDate = MDYStringToDate(firstLocationData[0].date as string);
    this._lastDate = MDYStringToDate(firstLocationData[this.dataSetLength - 1].date as string);
  }

  private addUSStatesAndCountiesToLocations() {
    if (this._locations == null) {
      throw Covid19DataStore.notLoadedError();
    }

    const usIndex = this._locations.indexOf('US');
    // Check if US state data already exists in the DB.
    if (!this._locations[usIndex + 1].includes('US')) {
      this._locations.splice(usIndex + 1, 0, ...US_LOCATIONS);
    }
  }

  private async loadUSCountyData(db: IDBPDatabase<Covid19DataStoreDbSchema>) {
    const parsedUSConfirmedData = await this.getParsedDataFromURL(Covid19DataStore.US_CONFIRMED_URL);
    const parsedUSDeathsData = await this.getParsedDataFromURL(Covid19DataStore.US_DEATHS_URL);
    await this.formatAndPersistParsedData(db, parsedUSConfirmedData, parsedUSDeathsData);
    await this.addUSStateTotalsDataToPersistedData(db);
  }

  private async addUSStateTotalsDataToPersistedData(db: IDBPDatabase<Covid19DataStoreDbSchema>) {
    for (const state of US_STATES) {
      const { name, latitude, longitude } = state;
      const countiesData = await db.getAllFromIndex('data', 'byProvinceOrState', name);
      const stateTotalValues = this.sumMultipleLocationValues(countiesData);

      const location = Covid19DataStore.getFullLocationName('US', name);
      const stateTotalData: InternalLocationData = {
        location,
        countryOrRegion: 'US',
        values: stateTotalValues,
        latitude,
        longitude,
      };

      await db.put('data', stateTotalData);
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
      subLocation.length > 0 &&
      county.length > 0
    ) {
      subLocation = `${county}, ${subLocation}`;
    }

    if (
      subLocation != null &&
      subLocation.length > 0
    ) {
      location = `${location} (${subLocation})`;
    }

    return location;
  }

  private static async clearData(db: IDBPDatabase<Covid19DataStoreDbSchema>) {
    await db.clear('data');
    await db.clear('settings');
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
