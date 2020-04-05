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

  const chart = (
    <div style={{ position: 'relative' }}>
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
            label={{ value: 'Cases', angle: -90, position: 'left', dy: -20, dx: -15 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, dataMax => dataMax * 5]}
            label={{ value: 'Deaths', angle: 90, position: 'right', dy: -25, dx: 5 }}
          />
          <Tooltip content={SingleLocationProgressionTooltip} />
          <Legend align='center' verticalAlign='top' height={45} />
          <Bar dataKey='newConfirmed' yAxisId='left' fill={COLORS.newConfirmed} name='New Cases' />
          <Line
            type='monotone' dataKey='deaths' yAxisId='right'
            stroke={COLORS.deaths} strokeWidth={3} name='Deaths'
            dot={false}
          />
          <Line
            type='monotone' yAxisId='left' dataKey="confirmed"
            stroke={COLORS.confirmed} strokeWidth={3} name='Confirmed Cases'
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <p className='text-center mt-0 mb-2 font-weight-light font-italic text-muted'>
        <small>
          covid19incharts.com | source:&nbsp;
          <a className='text-decoration-none' href='https://github.com/CSSEGISandData/COVID-19'>JHU CSSE</a>
        </small>
      </p>
    </div>
  );

  return (
    <>
      <h1 className='h3 mb-3'>COVID-19 Progression: {location}</h1>
      <Card className='shadow-lg border-0' style={{ borderRadius: 15 }}>
        <Card.Body>
          {data.length === 0 && (
            <h2 className='h6 text-center my-auto'>
              No data to show.
            </h2>
          )}
          {data.length > 0 && chart}
        </Card.Body>
      </Card>
    </>
  );
};

export default SingleLocationProgressionChart;
