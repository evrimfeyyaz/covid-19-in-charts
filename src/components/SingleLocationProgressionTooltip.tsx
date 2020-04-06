import React, { FunctionComponent } from 'react';
import Card from 'react-bootstrap/Card';
import { DateValue } from '../store/CovidDataStore';
import { prettifyMDYDate } from '../utilities/dateUtilities';
import Table from 'react-bootstrap/Table';
import { COLORS } from '../constants';

interface SingleLocationProgressionTooltipProps {
  payload: { payload: DateValue }[],
  label: string,
  active: boolean
}

const SingleLocationProgressionTooltip: FunctionComponent<SingleLocationProgressionTooltipProps> = ({ payload, label, active }) => {
  if (!active) {
    return null;
  }

  const { confirmed, newConfirmed, deaths, recovered, date } = payload[0].payload;

  return (
    <Card className='shadow-sm rounded-lg'>
      <Card.Body className='rounded-lg'>
        <Card.Title className='text-center'>
          {prettifyMDYDate(date)}
        </Card.Title>
        <Card.Text>
          <Table borderless size='sm'>
            <tbody>
            <tr>
              <td style={{ backgroundColor: COLORS.confirmed, width: 5, borderRadius: 5 }} />
              <th>Confirmed Cases</th>
              <td className='text-right'>{confirmed}</td>
            </tr>
            <tr style={{ height: 5 }} />
            <tr>
              <td style={{ backgroundColor: COLORS.newConfirmed, width: 5, borderRadius: 5 }} />
              <th>New Cases</th>
              <td className='text-right'>{newConfirmed}</td>
            </tr>
            <tr style={{ height: 5 }} />
            <tr>
              <td style={{ backgroundColor: COLORS.deaths, width: 5, borderRadius: 5 }} />
              <th>Deaths</th>
              <td className='text-right'>{deaths ?? 'n/a'}</td>
            </tr>
            <tr style={{ height: 5 }} />
            <tr>
              <td style={{ backgroundColor: COLORS.recovered, width: 5, borderRadius: 5 }} />
              <th>Recovered</th>
              <td className='text-right'>{recovered ?? 'n/a'}</td>
            </tr>
            </tbody>
          </Table>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default SingleLocationProgressionTooltip;
