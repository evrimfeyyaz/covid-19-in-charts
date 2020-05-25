import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from 'react';
import { COLORS } from '../../../constants';
import DailyNumbersTableItem from './DailyNumbersTableItem';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NoData from '../../common/NoData';

interface DailyNumbersTableProps {
  data?: ValuesOnDate,
}

const DailyNumbersTable: FunctionComponent<DailyNumbersTableProps> = ({ data }) => {
  let body = (<NoData />);

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
      <Row className='mx-sm-2 my-sm-2'>
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
    );
  }

  return body;
};

export default DailyNumbersTable;
