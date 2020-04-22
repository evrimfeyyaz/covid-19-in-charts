import React, { FunctionComponent } from 'react';
import { DateValue } from '../../../store/CovidDataStore';
import { COLORS } from '../../../constants';
import DailyNumbersTableItem from './DailyNumbersTableItem';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface DailyNumbersTableProps {
  data?: DateValue,
}

const DailyNumbersTable: FunctionComponent<DailyNumbersTableProps> = ({ data }) => {
  let body = (
    <h2 className='h5 text-center my-5'>
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
      <>
        <Row>
          <Col xs={6}>
            <DailyNumbersTableItem
              headerBgColor={COLORS.confirmed}
              title='Confirmed Cases'
              value={confirmed}
            />
          </Col>
          <Col xs={6}>
            <DailyNumbersTableItem
              headerBgColor={COLORS.newConfirmed}
              title='New Cases'
              value={newConfirmed}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <DailyNumbersTableItem
              headerBgColor={COLORS.recovered}
              title='Recovered'
              value={recovered}
              rateValue={recoveryRate}
              newValue={newRecovered}
              headerClassName='text-light'
            />
          </Col>
          <Col xs={6}>
            <DailyNumbersTableItem
              headerBgColor={COLORS.deaths}
              title='Deaths'
              value={deaths}
              rateValue={mortalityRate}
              newValue={newDeaths}
              headerClassName='text-light'
            />
          </Col>
        </Row>
      </>
    );
  }

  return body;
};

export default DailyNumbersTable;
