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
  deaths: number,
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
  private static COUNTRY_TOTAL_KEY = 'Total';
  private static INDEX_OF_FIRST_DATE_COLUMN = 4;

  static stripDataBeforePropertyExceedsN(locationData: Readonly<LocationData>, property: string, n: number): LocationData {
    const dataClone = _.cloneDeep(locationData);

    if (property !== 'confirmed' && property !== 'deaths') {
      throw new Error('Property should either be "confirmed" or "deaths"');
    }

    return {
      ...dataClone,
      values: dataClone.values.filter(value => value[property] > n),
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

  async loadData(): Promise<void> {
    const parsedConfirmedData = await this.getParsedDataFromURL(CovidDataStore.CONFIRMED_URL);
    const parsedDeathsData = await this.getParsedDataFromURL(CovidDataStore.DEATHS_URL);
    this.dataByLocation = await this.formatParsedData(parsedConfirmedData, parsedDeathsData);
    this._locations = Object.keys(this.dataByLocation).sort((location1, location2) => location1.localeCompare(location2));
    this.dataSetLength = this.dataByLocation[this._locations[0]].values.length;
  }

  get locations(): string[] {
    if (this._locations == null) {
      throw CovidDataStore.notLoadedError();
    }

    return _.cloneDeep(this._locations);
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

  private formatParsedData(parsedConfirmedData: ParsedCsv, parsedDeathsData: ParsedCsv): Promise<DataByLocation> {
    return new Promise((resolve, reject) => {
      let formattedData;

      try {
        formattedData = this.formatDataByLocation(parsedConfirmedData, parsedDeathsData);
        formattedData = this.addCountryTotalsToFormattedData(formattedData);
      } catch (err) {
        reject(err);
      }

      resolve(formattedData);
    });
  }

  private formatDataByLocation(parsedConfirmedData: ParsedCsv, parsedDeathsData: ParsedCsv): DataByLocation {
    let formattedData: DataByLocation = {};

    for (let i = 0; i < parsedConfirmedData.length; i++) {
      const confirmedData = parsedConfirmedData[i];
      const deathsData = parsedDeathsData[i];
      const countryOrRegion = confirmedData['Country/Region'] as string;
      const provinceOrState = confirmedData['Province/State'];
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
          const deaths = deathsData[dateStr] as number;

          let newConfirmed = 0;
          if (prevDateStr != null) {
            const yesterdaysConfirmed = confirmedData[prevDateStr] as number;
            newConfirmed = Math.max(0, confirmed - yesterdaysConfirmed);
          }

          result = [...result, { date: dateStr, confirmed, newConfirmed, deaths }];
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
      location: `
            Australia(${CovidDataStore.COUNTRY_TOTAL_KEY})`,
      values: [],
      latitude: '-25.2744',
      longitude: '133.7751',
    };
    const canadaTotalData: LocationData = {
      location: `;
            Canada(${CovidDataStore.COUNTRY_TOTAL_KEY})`,
      values: [],
      latitude: '56.1304',
      longitude: '-106.3468',
    };
    const chinaTotalData: LocationData = {
      location: `;
            China(${CovidDataStore.COUNTRY_TOTAL_KEY})`,
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
          countryTotalData.values[index].deaths += locationData.values[index].deaths;
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
}
