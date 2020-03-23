import parse from 'csv-parse';
import _ from 'lodash';

interface ParsedCsvRow {
  readonly [key: string]: string | number
}

type ParsedCsv = readonly ParsedCsvRow[];

interface DateValue {
  date: string,
  value: number
}

interface ProvinceOrStateData {
  values: DateValue[],
  firstNonZeroValueIndex: number | null
}

interface DataByCountry {
  [countryOrRegion: string]: {
    [provinceOrState: string]: ProvinceOrStateData
  }
}

export default class JHUCSSECovidDataStore {
  private static BASE_URL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/';
  private static CONFIRMED_URL = `${JHUCSSECovidDataStore.BASE_URL}time_series_19-covid-Confirmed.csv`;
  private static DEATHS_URL = `${JHUCSSECovidDataStore.BASE_URL}time_series_19-covid-Deaths.csv`;
  private static RECOVERED_URL = `${JHUCSSECovidDataStore.BASE_URL}time_series_19-covid-Recovered.csv`;
  private static COUNTRY_TOTAL_KEY = 'Total';
  private static INDEX_OF_FIRST_DATE_COLUMN = 4;

  private static isIndexOfDateColumn(index: number): boolean {
    return index >= JHUCSSECovidDataStore.INDEX_OF_FIRST_DATE_COLUMN;
  }

  private static isLocationNameCountry(location: string): boolean {
    return location.indexOf('(') === -1;
  }

  private static isDateColumn(columnName: string): boolean {
    return !!columnName.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/);
  }

  private static parseCountryAndProvinceFromLocation(location: string): { country: string, province: string } {
    const parsedLocation = location.match(/^([a-zA-Z\s]+)\s\(([a-zA-Z\s]+)\)$/);

    if (typeof parsedLocation?.[1] !== 'string' || typeof parsedLocation?.[2] !== 'string') {
      throw new Error(`Invalid country and province string: ${location}.`);
    }

    return {
      country: parsedLocation[1],
      province: parsedLocation[2],
    };
  }

  private static throwInvalidLocationError(location: string) {
    throw new Error(`Invalid location: "${location}".`);
  }

  private casesByCountry: DataByCountry | undefined;
  private deathsByCountry: DataByCountry | undefined;
  private recoveredByCountry: DataByCountry | undefined;
  private locations: string[] | undefined;

  async loadData(): Promise<void> {
    const rawConfirmedDataResponse = await fetch(JHUCSSECovidDataStore.CONFIRMED_URL);
    const rawConfirmedData = await rawConfirmedDataResponse.text();
    const parsedConfirmedData = await this.parseCsv(rawConfirmedData);
    this.casesByCountry = await this.formatParsedData(parsedConfirmedData);

    const rawDeathsDataResponse = await fetch(JHUCSSECovidDataStore.DEATHS_URL);
    const rawDeathsData = await rawDeathsDataResponse.text();
    const parsedDeathsData = await this.parseCsv(rawDeathsData);
    this.deathsByCountry = await this.formatParsedData(parsedDeathsData);

    const rawRecoveredDataResponse = await fetch(JHUCSSECovidDataStore.RECOVERED_URL);
    const rawRecoveredData = await rawRecoveredDataResponse.text();
    const parsedRecoveredData = await this.parseCsv(rawRecoveredData);
    this.recoveredByCountry = await this.formatParsedData(parsedRecoveredData);
  }

  getListOfLocations() {
    this.throwErrorIfNotLoaded();

    if (this.locations != null) {
      return this.locations;
    }

    const locations: string[] = [];
    const casesByCountry = this.casesByCountry as DataByCountry;

    Object.entries(casesByCountry).forEach(([countryName, countryData]) => {
      if (Object.keys(countryData).length === 1) { // No provincial data.
        locations.push(countryName);
      } else {
        Object.entries(countryData).forEach(([provinceName, provinceData]) => {
          if (provinceName === JHUCSSECovidDataStore.COUNTRY_TOTAL_KEY) {
            locations.push(countryName);
          } else {
            locations.push(`${countryName} (${provinceName})`);
          }
        });
      }
    });

    locations.sort((a, b) => a.localeCompare(b));
    this.locations = locations;

    return this.locations;
  }

  getCasesDataByLocation(location: string) {
    this.throwErrorIfNotLoaded();

    const casesByCountry = this.casesByCountry as DataByCountry;

    if (JHUCSSECovidDataStore.isLocationNameCountry(location)) {
      if (!casesByCountry.hasOwnProperty(location)) {
        JHUCSSECovidDataStore.throwInvalidLocationError(location);
      }

      return casesByCountry[location];
    } else {
      const { country, province } = JHUCSSECovidDataStore.parseCountryAndProvinceFromLocation(location);

      if (!casesByCountry.hasOwnProperty(country)) {
        JHUCSSECovidDataStore.throwInvalidLocationError(location);
      }

      if (!casesByCountry[country].hasOwnProperty(province)) {
        JHUCSSECovidDataStore.throwInvalidLocationError(location);
      }

      return casesByCountry[country][province];
    }
  }

  private throwErrorIfNotLoaded() {
    if (this.casesByCountry == null || this.deathsByCountry == null || this.recoveredByCountry == null) {
      throw new Error('You need to first call the `loadData` method to populate the store.');
    }
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

            if (JHUCSSECovidDataStore.isDateColumn(context.column)) {
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

  private formatParsedData(parsedData: ParsedCsv): Promise<DataByCountry> {
    return new Promise((resolve, reject) => {
      let formattedData;

      try {
        formattedData = this.formatDataByCountry(parsedData);
        this.mutatingAddCountryTotalsToFormattedData(formattedData);
      } catch (err) {
        reject(err);
      }

      resolve(formattedData);
    });
  }

  private formatDataByCountry(parsedData: ParsedCsv): DataByCountry {
    let formattedData: DataByCountry = {};

    for (let i = 0; i < parsedData.length; i++) {
      const locationData = parsedData[i];
      const countryOrRegion = locationData['Country/Region'];
      const provinceOrState = locationData['Province/State'] || JHUCSSECovidDataStore.COUNTRY_TOTAL_KEY;

      let firstNonZeroValueIndex: number | null = null;
      const values = Object.keys(locationData).reduce<DateValue[]>((result, dateStr, index) => {
        if (JHUCSSECovidDataStore.isIndexOfDateColumn(index)) {
          const value = locationData[dateStr] as number;

          if (value > 0 && firstNonZeroValueIndex == null) {
            firstNonZeroValueIndex = index - JHUCSSECovidDataStore.INDEX_OF_FIRST_DATE_COLUMN;
          }

          result = [...result, { date: dateStr, value }];
        }

        return result;
      }, []);

      formattedData = {
        ...formattedData,
        [countryOrRegion]: {
          ...formattedData[countryOrRegion],
          [provinceOrState]: {
            values,
            firstNonZeroValueIndex,
          },
        },
      };
    }

    return formattedData;
  }

  private mutatingAddCountryTotalsToFormattedData(formattedData: DataByCountry): void {
    Object.keys(formattedData).forEach((country) => {
      const countryData = formattedData[country];

      if (countryData.hasOwnProperty(JHUCSSECovidDataStore.COUNTRY_TOTAL_KEY)) {
        return;
      }

      const dataSetLength = countryData[JHUCSSECovidDataStore.COUNTRY_TOTAL_KEY].values.length;
      let countryTotal: ProvinceOrStateData = {
        values: [],
        firstNonZeroValueIndex: dataSetLength,
      };

      Object.values(countryData).forEach(provinceData => {
        const countryFirstNonZeroTime = countryTotal.firstNonZeroValueIndex ?? dataSetLength;
        const provinceFirstNonZeroTime = provinceData.firstNonZeroValueIndex ?? dataSetLength;

        if (countryTotal.firstNonZeroValueIndex == null || countryFirstNonZeroTime > provinceFirstNonZeroTime) {
          countryTotal.firstNonZeroValueIndex = provinceData.firstNonZeroValueIndex;
        }

        if (countryTotal.values.length === 0) {
          countryTotal.values = _.cloneDeep(provinceData.values);
        } else {
          for (let j = 0; j < countryTotal.values.length; j++) {
            countryTotal.values[j].value = countryTotal.values[j].value + provinceData.values[j].value;
          }
        }
      });

      countryData[JHUCSSECovidDataStore.COUNTRY_TOTAL_KEY] = countryTotal;
    });
  }
}
