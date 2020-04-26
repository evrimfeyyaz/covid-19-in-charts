import React, { FunctionComponent } from 'react';
import { DateValues } from '../../../store/CovidDataStore';
import {
  CartesianGrid,
  ComposedChart, Label,
  Legend,
  Line, ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { COLORS } from '../../../constants';
import { numToGroupedString } from '../../../utilities/numUtilities';
import NoData from '../../common/NoData';

interface CountryStateComparisonChartProps {
  data: DateValues,
  exceedingProperty: string,
  exceedingValue: number,
  isAnimationActive: boolean,
}

const CountryStateComparisonChart: FunctionComponent<CountryStateComparisonChartProps> = ({
                                                                                          data, exceedingProperty,
                                                                                          exceedingValue, isAnimationActive,
                                                                                        }) => {
  let exceedingPropertyText = 'confirmed cases';
  if (exceedingProperty === 'deaths') {
    exceedingPropertyText = 'deaths';
  }

  let body = (<NoData />);

  if (data.length > 0) {
    body = (
      <ResponsiveContainer width='100%' height={400} className='mb-2'>
        <ComposedChart width={600} height={400} data={data}
                       margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis>
            <Label value={`Number of days since ${exceedingPropertyText} exceeded ${exceedingValue}`}
                   position='bottom' offset={10} />
          </XAxis>

          <YAxis
            label={{ value: 'Confirmed Cases', angle: -90, position: 'left', dy: -60, dx: -15 }}
            tickFormatter={numToGroupedString}
          />

          <Tooltip offset={30} />
          <Legend align='center' verticalAlign='top' />

          <Line
            type='monotone' dataKey='deaths' opacity={.8}
            stroke={COLORS.deaths} strokeWidth={3} name='Deaths'
            dot={false} isAnimationActive={isAnimationActive}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return body;
};

export default CountryStateComparisonChart;
