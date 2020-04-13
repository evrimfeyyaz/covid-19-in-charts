import React, { FunctionComponent } from 'react';
import { DateValues } from '../store/CovidDataStore';
import './CaseInLocationLegend.scss';

interface CaseInLocationLegendProps {
  payload?: {
    color: string,
    dataKey: string,
    inactive: boolean,
    value: string
  }[]
  data?: DateValues
}

const CaseInLocationLegend: FunctionComponent<CaseInLocationLegendProps> = ({ payload, data }) => {
  const latestValues = data?.[data?.length - 1];
  const latestConfirmed = latestValues?.confirmed;
  const latestNewConfirmed = latestValues?.newConfirmed;
  const latestRecovered = latestValues?.recovered;
  const latestDeaths = latestValues?.deaths;

  const payloadConfirmed = payload?.find(item => item.dataKey === 'confirmed');
  const payloadNewConfirmed = payload?.find(item => item.dataKey === 'newConfirmed');
  const payloadRecovered = payload?.find(item => item.dataKey === 'recovered');
  const payloadDeaths = payload?.find(item => item.dataKey === 'deaths');

  return (
    <div className='d-flex flex-column align-items-center small border rounded-lg mx-auto cill-container overflow-hidden mb-4'>
      <div className='d-flex w-100'>
        <div className='w-25 text-center' style={{ backgroundColor: payloadConfirmed?.color }}>Confirmed</div>
        <div className='w-25 text-center' style={{ backgroundColor: payloadNewConfirmed?.color }}>New</div>
        <div className='w-25 text-center' style={{ backgroundColor: payloadRecovered?.color }}>Recovered</div>
        <div className='w-25 text-center' style={{ backgroundColor: payloadDeaths?.color }}>Deaths</div>
      </div>
      <div className='d-flex w-100'>
        <div className='w-25 text-center'>{latestConfirmed}</div>
        <div className='w-25 text-center'>{latestNewConfirmed}</div>
        <div className='w-25 text-center'>{latestRecovered}</div>
        <div className='w-25 text-center'>{latestDeaths}</div>
      </div>
    </div>
  );
};

export default CaseInLocationLegend;
