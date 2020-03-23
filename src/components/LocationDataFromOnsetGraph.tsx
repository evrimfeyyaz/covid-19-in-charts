import React, { FunctionComponent } from 'react';
import { DateValues } from '../store/JHUCSSECovidDataStore';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';

interface LocationDataFromOnsetGraphProps {
  data: DateValues
}

const LocationDataFromOnsetGraph: FunctionComponent<LocationDataFromOnsetGraphProps> = ({ data }) => {
  return (
    <BarChart
      width={500}
      height={600}
      data={data}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
      layout='vertical'
      barSize={50}
    >
      <XAxis type='number' />
      <YAxis dataKey="date" type='category' />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
};

export default LocationDataFromOnsetGraph;
