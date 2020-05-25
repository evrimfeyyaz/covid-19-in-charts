import { LocationData } from "@evrimfeyyaz/covid-19-api";
import _ from "lodash";
import React, { FunctionComponent } from "react";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipFormatter,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../../../constants";
import { numToGroupedString, numToPercentageFactory } from "../../../utilities/numUtilities";
import NoData from "../../common/NoData";

interface LocationComparisonChartProps {
  data?: LocationData[];
  property: string;
  humanizedProperty: string;
  humanizedExceedingProperty: string;
  exceedingValue: number;
  isAnimationActive: boolean;
}

const LocationComparisonChart: FunctionComponent<LocationComparisonChartProps> = ({
  data,
  humanizedExceedingProperty,
  humanizedProperty,
  property,
  exceedingValue,
  isAnimationActive,
}) => {
  let body = <NoData />;

  if (
    data != null &&
    data.length > 0 &&
    data.some((locationData) => locationData.values.length > 0)
  ) {
    const dataWithIndex = _.cloneDeep(data).map((locationData) => ({
      ...locationData,
      values: locationData.values.map((valuesObj, index) => ({
        ...valuesObj,
        index,
      })),
    }));

    const yAxisTickFormatter = ["mortalityRate", "recoveryRate"].includes(property)
      ? numToPercentageFactory(2)
      : numToGroupedString;
    const tooltipFormatter: TooltipFormatter = (value, _name, { dataKey }) => {
      if (dataKey == null || typeof dataKey !== "string" || typeof value !== "number") {
        return <></>;
      }

      const formatter = ["mortalityRate", "recoveryRate"].includes(dataKey)
        ? numToPercentageFactory(3)
        : numToGroupedString;
      const formattedValue = formatter(value);

      return <>{formattedValue}</>;
    };

    body = (
      <ResponsiveContainer height={400} className="mb-2">
        <LineChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" type="category" allowDuplicatedCategory={false}>
            <Label
              value={`Number of days since ${humanizedExceedingProperty} exceeded ${exceedingValue}`}
              position="bottom"
              offset={10}
            />
          </XAxis>

          <YAxis
            label={{
              value: _.startCase(humanizedProperty),
              angle: -90,
              dx: -55,
            }}
            tickFormatter={yAxisTickFormatter}
            width={70}
          />

          <Tooltip offset={30} formatter={tooltipFormatter} />
          <Legend align="center" verticalAlign="top" wrapperStyle={{ top: 5 }} />

          {dataWithIndex.map((locationData, index) => (
            <Line
              type="monotone"
              data={locationData.values}
              dataKey={property}
              opacity={0.8}
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
