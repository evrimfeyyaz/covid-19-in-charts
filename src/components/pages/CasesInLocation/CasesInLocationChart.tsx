import React, { FunctionComponent } from 'react';
import { DateValues } from '../../../store/CovidDataStore';
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
import CasesInLocationTooltip from './CasesInLocationTooltip';
import { COLORS } from '../../../constants';
import CasesInLocationLegend from './CasesInLocationLegend';
import { numToGroupedString } from '../../../utilities/numUtilities';
import NoData from '../../common/NoData';

interface CasesInLocationChartProps {
  data: DateValues,
  exceedingProperty: string,
  exceedingValue: number,
  isAnimationActive: boolean,
}

const CasesInLocationChart: FunctionComponent<CasesInLocationChartProps> = ({
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
      <ResponsiveContainer width='100%' height={400}>
        <ComposedChart width={600} height={400} data={data}
                       margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis>
            <Label value={`Number of days since ${exceedingPropertyText} exceeded ${exceedingValue}`}
                   position='bottom' offset={10} />
          </XAxis>

          <YAxis
            yAxisId="left"
            label={{ value: 'Confirmed Cases', angle: -90, position: 'left', dy: -60, dx: -15 }}
            tickFormatter={numToGroupedString}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, dataMax => dataMax * 2]}
            label={{ value: 'Deaths, New & Recovered Cases', angle: 90, position: 'right', dy: -110, dx: 5 }}
            tickFormatter={numToGroupedString}
          />
          <Tooltip content={CasesInLocationTooltip} offset={30} />
          <Legend align='center' verticalAlign='top' content={<CasesInLocationLegend data={data} />} />
          <Bar
            dataKey='newConfirmed' yAxisId='right'
            fill={COLORS.newConfirmed} name='New Cases'
            isAnimationActive={isAnimationActive}
          />
          <Line
            type='monotone' dataKey='deaths' yAxisId='right' opacity={.8}
            stroke={COLORS.deaths} strokeWidth={3} name='Deaths'
            dot={false} isAnimationActive={isAnimationActive}
          />
          <Line
            type='monotone' yAxisId='right' dataKey="recovered" opacity={.8}
            stroke={COLORS.recovered} strokeWidth={3} name='Recovered Cases'
            dot={false} isAnimationActive={isAnimationActive}
          />
          <Line
            type='monotone' yAxisId='left' dataKey="confirmed" opacity={.8}
            stroke={COLORS.confirmed} strokeWidth={3} name='Confirmed Cases'
            dot={false} isAnimationActive={isAnimationActive}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return body;
};

export default CasesInLocationChart;
