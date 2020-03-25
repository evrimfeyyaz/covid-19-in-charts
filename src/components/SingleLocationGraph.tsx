import React, { FunctionComponent } from 'react';
import { DateValues } from '../store/JHUCSSECovidDataStore';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';

interface SingleLocationGraphProps {
  data: DateValues,
}

const SingleLocationGraph: FunctionComponent<SingleLocationGraphProps> = ({ data }) => {
  return (
    <div>
      <ComposedChart width={600} height={400} data={data}
                     margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar dataKey='deaths' yAxisId='right' barSize={20} fill='#413ea0' />
        <Line type="monotone" yAxisId='left' dataKey="confirmed" stroke="#82ca9d" />
      </ComposedChart>
    </div>
  );
};

export default SingleLocationGraph;
