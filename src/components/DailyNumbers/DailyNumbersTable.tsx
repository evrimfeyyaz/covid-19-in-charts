import React, { FunctionComponent } from 'react';
import { DateValue } from '../../store/CovidDataStore';
import { prettifyDate } from '../../utilities/dateUtilities';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import { COLORS } from '../../constants';
import { numToGroupedString } from '../../utilities/numUtilities';
import DailyNumbersTableItem from './DailyNumbersTableItem';
import CardGroup from 'react-bootstrap/CardGroup';

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
    const noData = 'No Data';

    const confirmedValue = numToGroupedString(data.confirmed);
    const newConfirmedValue = numToGroupedString(data.newConfirmed);
    const recoveredValue = data.recovered ? numToGroupedString(data.recovered) : noData;
    const deathsValue = data.deaths ? numToGroupedString(data.deaths) : noData;

    body = (
      <Card.Body>
        <CardGroup>
          <Col>
            <DailyNumbersTableItem
              bgColor={COLORS.confirmed}
              title='Confirmed Cases'
              value={confirmedValue}
            />
          </Col>

          <Col>
            <DailyNumbersTableItem
              bgColor={COLORS.newConfirmed}
              title='New Cases'
              value={newConfirmedValue}
            />
          </Col>
        </CardGroup>
        <CardGroup className='mt-4'>
          <Col>
            <DailyNumbersTableItem
              bgColor={COLORS.recovered}
              title='Recovered'
              value={recoveredValue}
            />
          </Col>

          <Col>
            <DailyNumbersTableItem
              bgColor={COLORS.deaths}
              title='Deaths'
              value={deathsValue}
            />
          </Col>
        </CardGroup>
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
