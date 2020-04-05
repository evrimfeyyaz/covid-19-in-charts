import React, { FunctionComponent } from 'react';
import { DateValues } from '../store/CovidDataStore';
import {
  Bar,
  CartesianGrid,
  ComposedChart, Label,
  Legend,
  Line, ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Card from 'react-bootstrap/Card';
import SingleLocationProgressionTooltip from './SingleLocationProgressionTooltip';
import { COLORS } from '../constants';

interface SingleLocationProgressionChartProps {
  data: DateValues,
  location: string,
  exceedingProperty: string,
  exceedingValue: number,
}

const SingleLocationProgressionChart: FunctionComponent<SingleLocationProgressionChartProps> = ({
                                                                                                  data, location,
                                                                                                  exceedingProperty,
                                                                                                  exceedingValue,
                                                                                                }) => {
  let exceedingPropertyText = 'confirmed cases';
  if (exceedingProperty === 'deaths') {
    exceedingPropertyText = 'deaths';
  }

  return (
    <>
      <h1 className='h3 mb-3'>COVID-19 Progression: {location}</h1>
      <Card className='shadow-lg border-0' style={{ borderRadius: 15 }}>
        <Card.Body>
          <ResponsiveContainer width='100%' height={400}>
            <ComposedChart width={600} height={400} data={data}
                           margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis>
                <Label value={`Number of days since ${exceedingPropertyText} exceeded ${exceedingValue}`}
                       position='bottom'
                       offset={20} />
              </XAxis>
              <YAxis yAxisId="left" label={{ value: 'Cases', angle: -90, position: 'left' }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, dataMax => dataMax * 5]}
                     label={{ value: 'Deaths', angle: 90, position: 'right' }} />
              <Tooltip content={SingleLocationProgressionTooltip} />
              <Legend align='center' verticalAlign='top' height={40} />
              <Bar dataKey='newConfirmed' yAxisId='left' fill={COLORS.newConfirmed} name='New Cases' />
              <Line
                type='monotone' dataKey='deaths' yAxisId='right'
                stroke={COLORS.deaths} strokeWidth={3} name='Deaths'
                dot={false} activeDot={false}
              />
              <Line
                type='monotone' yAxisId='left' dataKey="confirmed"
                stroke={COLORS.confirmed} strokeWidth={3} name='Confirmed Cases'
                dot={false} activeDot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </>
  );
};

export default SingleLocationProgressionChart;
