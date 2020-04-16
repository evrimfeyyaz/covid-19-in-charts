import parse from 'csv-parse';
import _ from 'lodash';

interface ParsedCsvRow {
  readonly [key: string]: string | number
}

type ParsedCsv = readonly ParsedCsvRow[];

export interface DateValue {
  date: string,
  confirmed: number,
  newConfirmed: number,
  deaths: number | null,
  recovered: number | null
}

export type DateValues = DateValue[];

export interface LocationData {
  location: string,
  latitude: string,
  longitude: string,
  values: DateValues,
}

interface DataByLocation {
  [location: string]: LocationData
}

export default class CovidDataStore {
  private static BASE_URL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/';
  private static CONFIRMED_URL = `${CovidDataStore.BASE_URL}time_series_covid19_confirmed_global.csv`;
  private static DEATHS_URL = `${CovidDataStore.BASE_URL}time_series_covid19_deaths_global.csv`;
  private static RECOVERED_URL = `${CovidDataStore.BASE_URL}time_series_covid19_recovered_global.csv`;
  private static INDEX_OF_FIRST_DATE_COLUMN = 4;
  private static COUNTRY_OR_REGION_COLUMN_TITLE = 'Country/Region';
  private static PROVINCE_OR_STATE_COLUMN_TITLE = 'Province/State';
  private static LOCAL_DATA_VALIDITY_MS = 60 * 60 * 1000; // 1 hour

  private static async getDateOfLastCommitIncludingRepoDirectory(): Promise<Date> {
    const commitDataUrl = 'https://api.github.com/repos/CSSEGISandData/COVID-19/commits?path=csse_covid_19_data%2Fcsse_covid_19_time_series&page=1&per_page=1';

    const response = await fetch(commitDataUrl);
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

  private static isIndexOfDateColumn(index: number): boolean {
    return index >= CovidDataStore.INDEX_OF_FIRST_DATE_COLUMN;
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

  private dataByLocation: DataByLocation | undefined;
  private dataSetLength: number = 0;
  private _locations: string[] | undefined;
  private _lastUpdated: Date | undefined;

  async loadData(): Promise<void> {
    const localStorageLoadResult = this.loadDataFromLocalStorage();

    if (!localStorageLoadResult) {
      this._lastUpdated = await CovidDataStore.getDateOfLastCommitIncludingRepoDirectory();
      const parsedConfirmedData = await this.getParsedDataFromURL(CovidDataStore.CONFIRMED_URL);
      const parsedDeathsData = await this.getParsedDataFromURL(CovidDataStore.DEATHS_URL);
      const parsedRecoveredData = await this.getParsedDataFromURL(CovidDataStore.RECOVERED_URL);
      this.dataByLocation = await this.formatParsedData(parsedConfirmedData, parsedDeathsData, parsedRecoveredData);

      this.saveDataToLocalStorage();
    }

    this._locations = Object.keys(this.dataByLocation as DataByLocation).sort((location1, location2) => location1.localeCompare(location2));
    this.dataSetLength = this.dataByLocation?.[this._locations[0]].values.length as number;
  }

  get locations(): string[] {
    if (this._locations == null) {
      throw CovidDataStore.notLoadedError();
    }

    return _.cloneDeep(this._locations);
  }

  get lastUpdated(): Date {
    if (this._lastUpdated == null) {
      throw CovidDataStore.notLoadedError();
    }

    return new Date(this._lastUpdated.getTime());
  }

  getDataByLocation(location: string): LocationData {
    if (this.dataByLocation == null) {
      throw CovidDataStore.notLoadedError();
    }

    if (this.locations.indexOf(location) === -1) {
      throw CovidDataStore.invalidLocationError(location);
    }

    return _.cloneDeep(this.dataByLocation[location]);
  }

  private loadDataFromLocalStorage(): boolean {
    const localDataExpirationTimeStr = localStorage.getItem('localDataExpirationTimeStr');

    if (localDataExpirationTimeStr != null) {
      const localDataExpirationTime = parseInt(localDataExpirationTimeStr);

      if (Date.now() > localDataExpirationTime) {
        return false;
      }
    }

    const lastUpdatedTimeStr = localStorage.getItem('lastUpdatedTimeStr');
    const dataByLocationJson = localStorage.getItem('dataByLocationJson');

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

    const localDataExpirationTimeStr = (Date.now() + CovidDataStore.LOCAL_DATA_VALIDITY_MS).toString();
    const lastUpdatedTimeStr = this._lastUpdated?.getTime().toString();
    const dataByLocationJson = JSON.stringify(this.dataByLocation);

    localStorage.setItem('localDataExpirationTimeStr', localDataExpirationTimeStr);
    localStorage.setItem('lastUpdatedTimeStr', lastUpdatedTimeStr);
    localStorage.setItem('dataByLocationJson', dataByLocationJson);
  }

  private async getParsedDataFromURL(url: string): Promise<ParsedCsv> {
    const rawResponse = await fetch(url);
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
              throw new Error('Context column name should be `string`.');
            }

            if (CovidDataStore.isDateColumn(context.column)) {
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

  private formatParsedData(parsedConfirmedData: ParsedCsv, parsedDeathsData: ParsedCsv, parsedRecoveredData: ParsedCsv): Promise<DataByLocation> {
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

  private formatDataByLocation(parsedConfirmedData: ParsedCsv, parsedDeathsData: ParsedCsv, parsedRecoveredData: ParsedCsv): DataByLocation {
    let formattedData: DataByLocation = {};

    for (let i = 0; i < parsedConfirmedData.length; i++) {
      const confirmedData = parsedConfirmedData[i];
      const countryOrRegion = confirmedData[CovidDataStore.COUNTRY_OR_REGION_COLUMN_TITLE] as string;
      const provinceOrState = confirmedData[CovidDataStore.PROVINCE_OR_STATE_COLUMN_TITLE];

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
          deaths[CovidDataStore.COUNTRY_OR_REGION_COLUMN_TITLE] === countryOrRegion &&
          deaths[CovidDataStore.PROVINCE_OR_STATE_COLUMN_TITLE] === provinceOrState,
        );
      const recoveredData = parsedRecoveredData
        .find(recovered =>
          recovered[CovidDataStore.COUNTRY_OR_REGION_COLUMN_TITLE] === countryOrRegion
          && recovered[CovidDataStore.PROVINCE_OR_STATE_COLUMN_TITLE] === provinceOrState,
        );

      const latitude = confirmedData['Lat'] as string;
      const longitude = confirmedData['Long'] as string;

      let location = countryOrRegion;
      if (provinceOrState != null && typeof provinceOrState === 'string' && provinceOrState.trim().length > 0) {
        location = `${location} (${provinceOrState})`;
      }

      let prevDateStr: string | null = null;
      const values = Object.keys(confirmedData).reduce<DateValue[]>((result, dateStr, index) => {
        if (CovidDataStore.isIndexOfDateColumn(index)) {
          const confirmed = confirmedData[dateStr] as number;

          let deaths = null;
          if (deathsData != null) {
            deaths = deathsData[dateStr] as number;
          }

          let recovered = null;
          if (recoveredData != null) {
            recovered = recoveredData[dateStr] as number;
          }

          let newConfirmed = 0;
          if (prevDateStr != null) {
            const yesterdaysConfirmed = confirmedData[prevDateStr] as number;
            newConfirmed = Math.max(0, confirmed - yesterdaysConfirmed);
          }

          result = [...result, { date: dateStr, confirmed, newConfirmed, deaths, recovered }];
          prevDateStr = dateStr;
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

  private addCountryTotalsToFormattedData(formattedData: DataByLocation): DataByLocation {
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

      let countryTotalData: LocationData;
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
        countryTotalData.values = _.cloneDeep(locationData.values);
      } else {
        countryTotalData.values.forEach((value, index) => {
          countryTotalData.values[index].confirmed += locationData.values[index].confirmed;
          countryTotalData.values[index].newConfirmed += locationData.values[index].newConfirmed;

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

  private addCanadaRecoveredDataToFormattedData(formattedData: DataByLocation, parsedRecoveredData: ParsedCsv) {
    const formattedCanadaValues = _.cloneDeep(formattedData['Canada'].values);
    const parsedCanadaRecoveredValues = parsedRecoveredData
      .find(data => data[CovidDataStore.COUNTRY_OR_REGION_COLUMN_TITLE] === 'Canada');

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
