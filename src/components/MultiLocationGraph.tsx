import React, { FunctionComponent } from 'react';
import { LocationData } from '../store/JHUCSSECovidDataStore';
import { CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';

interface MultiLocationGraphProps {
  data: LocationData[]
}

const MultiLocationGraph: FunctionComponent<MultiLocationGraphProps> = ({ data }) => {
  return (
    <div>
      <ComposedChart width={600} height={400} data={data}
                     margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.map(s => (
          <Line dataKey="confirmed" data={s.values} />
        ))}
      </ComposedChart>
    </div>
  );
};

export default MultiLocationGraph;
