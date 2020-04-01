import React, { FunctionComponent } from 'react';
import { DateValues } from '../store/CovidDataStore';
import {
  Bar,
  CartesianGrid,
  ComposedChart, Label,
  Legend,
  Line, ResponsiveContainer, Text,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface SingleLocationProgressionChartProps {
  data: DateValues,
  location: string,
  casesExceed: number,
}

const SingleLocationProgressionChart: FunctionComponent<SingleLocationProgressionChartProps> = ({ data, location, casesExceed }) => {
  return (
    <>
      <h1 className='h2'>COVID-19 Progression: {location}</h1>
      <ResponsiveContainer width='100%' height={400}>
        <ComposedChart width={600} height={400} data={data}
                       margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis>
            <Label value={`Number of days since cases exceeded ${casesExceed}`} position='bottom' offset={20} />
          </XAxis>
          <YAxis yAxisId="left" label={{ value: 'Cases', angle: -90, position: 'left' }} />
          <YAxis yAxisId="right" orientation="right" domain={[0, dataMax => dataMax * 5]}
                 label={{ value: 'Deaths', angle: 90, position: 'right' }} />
          <Tooltip />
          <Legend align='center' verticalAlign='top' />
          <Bar dataKey='newConfirmed' yAxisId='left' fill='#eb8242' name='New Cases' />
          <Line type='monotone' dataKey='deaths' yAxisId='right' stroke='#da2d2d' strokeWidth={3} name='Deaths'
                dot={{ stroke: undefined, fill: '#da2d2d' }}
                activeDot={{ strokeWidth: 2, stroke: '#da2d2d', fill: 'white' }} />
          <Line type='monotone' yAxisId='left' dataKey="confirmed" stroke="#f6da63" strokeWidth={3}
                name='Confirmed Cases' dot={{ stroke: undefined, fill: '#f6da63' }}
                activeDot={{ strokeWidth: 2, stroke: '#f6da63', fill: 'white' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
};

export default SingleLocationProgressionChart;
