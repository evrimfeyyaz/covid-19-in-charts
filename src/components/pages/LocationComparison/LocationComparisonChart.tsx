import React, { FunctionComponent } from 'react';
import { LocationData } from '../../../store/Covid19DataStore';
import {
  CartesianGrid,
  Label,
  Legend,
  Line, LineChart, ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { COLORS } from '../../../constants';
import { numToGroupedString } from '../../../utilities/numUtilities';
import NoData from '../../common/NoData';
import _ from 'lodash';

interface LocationComparisonChartProps {
  data: LocationData[],
  property: string,
  humanizedExceedingProperty: string,
  exceedingValue: number,
  isAnimationActive: boolean,
}

const LocationComparisonChart: FunctionComponent<LocationComparisonChartProps> = ({
                                                                                    data,
                                                                                    humanizedExceedingProperty,
                                                                                    property,
                                                                                    exceedingValue,
                                                                                    isAnimationActive,
                                                                                  }) => {
  let body = (<NoData />);

  if (data.length > 0 && data.some(locationData => locationData.values.length > 0)) {
    const dataWithIndex = _.cloneDeep(data)
      .map(locationData => ({
        ...locationData,
        values: locationData.values.map((valuesObj, index) => ({ ...valuesObj, index })),
      }));

    body = (
      <ResponsiveContainer width='100%' height={400} className='mb-2'>
        <LineChart width={600} height={400} margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey='index' type='category' allowDuplicatedCategory={false}>
            <Label
              value={`Number of days since ${humanizedExceedingProperty} exceeded ${exceedingValue}`}
              position='bottom'
              offset={10}
            />
          </XAxis>

          <YAxis
            label={{ value: property, angle: -90, position: 'left', dy: -60, dx: -15 }}
            tickFormatter={numToGroupedString}
          />

          <Tooltip offset={30} />
          <Legend align='center' verticalAlign='top' />

          {dataWithIndex.map((locationData, index) => (
            <Line
              type='monotone'
              data={locationData.values}
              dataKey={property}
              opacity={.8}
              stroke={COLORS.graphColors[index % COLORS.graphColors.length]}
              strokeWidth={3}
              key={`${property}-${index}`}
              name={locationData.location}
              dot={false}
              isAnimationActive={isAnimationActive}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return body;
};

export default LocationComparisonChart;
