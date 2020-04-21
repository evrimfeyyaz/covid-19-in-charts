import React, { FunctionComponent } from 'react';
import { DateValue } from '../../store/CovidDataStore';
import { prettifyDate } from '../../utilities/dateUtilities';
import Card from 'react-bootstrap/Card';
import { COLORS } from '../../constants';
import { numToGroupedString } from '../../utilities/numUtilities';
import DailyNumbersTableItem from './DailyNumbersTableItem';
import CardDeck from 'react-bootstrap/CardDeck';

interface DailyNumbersTableProps {
  data?: DateValue,
  date: Date,
  title: string,
  lastUpdated: Date
}

const DailyNumbersTable: FunctionComponent<DailyNumbersTableProps> = ({ data, date, title, lastUpdated }) => {
  let body = (
    <h2 className='h6 text-center my-auto'>
      No data to show.
    </h2>
  );

  if (data != null) {
    const {
      confirmed,
      newConfirmed,
      recovered,
      deaths,
      newRecovered,
      newDeaths,
      mortalityRate,
      recoveryRate,
    } = data;

    body = (
      <Card.Body className='px-5 py-4'>
        <CardDeck>
          <DailyNumbersTableItem
            headerBgColor={COLORS.confirmed}
            title='Confirmed Cases'
            value={confirmed}
          />

          <DailyNumbersTableItem
            headerBgColor={COLORS.newConfirmed}
            title='New Cases'
            value={newConfirmed}
          />
        </CardDeck>
        <CardDeck>
          <DailyNumbersTableItem
            headerBgColor={COLORS.recovered}
            title='Recovered'
            value={recovered}
            rateValue={recoveryRate}
            newValue={newRecovered}
            headerClassName='text-light'
          />

          <DailyNumbersTableItem
            headerBgColor={COLORS.deaths}
            title='Deaths'
            value={deaths}
            rateValue={mortalityRate}
            newValue={newDeaths}
            headerClassName='text-light'
          />
        </CardDeck>
      </Card.Body>
    );
  }

  return (
    <>
      <h1 className='h4 mb-1'>{title}</h1>
      <p className='small text-muted ml-1'>{prettifyDate(date)}</p>
      <Card className='shadow-lg border-0 mt-3' style={{ borderRadius: 15 }}>
        {body}
        <p className='text-center mt-0 mb-2 font-weight-light font-italic text-muted'>
          <small>
            covid19incharts.com | source: <a className='text-decoration-none'
                                             href='https://github.com/CSSEGISandData/COVID-19'>JHU CSSE</a> | last
            updated: {lastUpdated.toUTCString()}
          </small>
        </p>
      </Card>
    </>
  );
};

export default DailyNumbersTable;
