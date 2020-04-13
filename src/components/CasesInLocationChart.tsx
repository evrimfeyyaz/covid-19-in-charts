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
import CasesInLocationTooltip from './CasesInLocationTooltip';
import { COLORS } from '../constants';
import { prettifyMDYDate } from '../utilities/dateUtilities';
import CaseInLocationLegend from './CaseInLocationLegend';

interface CasesInLocationChartProps {
  data: DateValues,
  title: string,
  firstDate: string | undefined,
  lastDate: string | undefined,
  lastUpdated: Date,
  exceedingProperty: string,
  exceedingValue: number,
  isAnimationActive: boolean,
}

const CasesInLocationChart: FunctionComponent<CasesInLocationChartProps> = ({
                                                                              data, firstDate, lastDate,
                                                                              title, lastUpdated,
                                                                              exceedingProperty,
                                                                              exceedingValue,
                                                                              isAnimationActive,
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
            label={{ value: 'Confirmed Cases', angle: -90, position: 'left', dy: -60, dx: -15 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, dataMax => dataMax * 2]}
            label={{ value: 'Deaths, New & Recovered Cases', angle: 90, position: 'right', dy: -110, dx: 5 }}
          />
          <Tooltip content={CasesInLocationTooltip} offset={30} />
          <Legend align='center' verticalAlign='top' content={<CaseInLocationLegend data={data} />} />
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

      <p className='text-center mt-0 mb-2 font-weight-light font-italic text-muted'>
        <small>
          covid19incharts.com | source:&nbsp;
          <a className='text-decoration-none' href='https://github.com/CSSEGISandData/COVID-19'>JHU CSSE</a> | last
          updated:&nbsp;
          {lastUpdated.toUTCString()}
        </small>
      </p>
    </div>
  );

  return (
    <>
      <h1 className='h4 mb-1'>{title}</h1>
      {firstDate && lastDate && (
        <p className='small text-muted ml-1'>{prettifyMDYDate(firstDate)} - {prettifyMDYDate(lastDate)}</p>
      )}
      <Card className='shadow-lg border-0 mt-3' style={{ borderRadius: 15 }}>
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

export default CasesInLocationChart;
