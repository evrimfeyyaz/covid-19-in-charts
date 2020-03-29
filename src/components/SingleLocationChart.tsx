import React, { FunctionComponent } from 'react';
import { DateValues } from '../store/CovidDataStore';
import {
  Bar,
  CartesianAxis,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface SingleLocationGraphProps {
  data: DateValues,
}

const SingleLocationChart: FunctionComponent<SingleLocationGraphProps> = ({ data }) => {
  return (
    <div>
      <ComposedChart width={600} height={400} data={data}
                     margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis />
        <YAxis yAxisId="left" label={{ value: 'Cases', angle: -90, position: 'center' }} />
        <YAxis yAxisId="right" orientation="right" domain={[0, dataMax => dataMax * 5]}
               label={{ value: 'Deaths', angle: 90, position: 'center' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey='newConfirmed' yAxisId='left' fill='#eb8242' name='New Cases' />
        <Line type='monotone' dataKey='deaths' yAxisId='right' stroke='#da2d2d' strokeWidth={3} name='Deaths'
              dot={{ stroke: false, fill: '#da2d2d' }}
              activeDot={{ strokeWidth: 2, stroke: '#da2d2d', fill: 'white' }} />
        <Line type='monotone' yAxisId='left' dataKey="confirmed" stroke="#f6da63" strokeWidth={3}
              name='Confirmed Cases' dot={{ stroke: false, fill: '#f6da63' }}
              activeDot={{ strokeWidth: 2, stroke: '#f6da63', fill: 'white' }} />
      </ComposedChart>
    </div>
  );
};

export default SingleLocationChart;