import React, { FunctionComponent } from 'react';
import { DateValues } from '../../../store/CovidDataStore';
import { numToGroupedString } from '../../../utilities/numUtilities';

interface CasesInLocationLegendProps {
  payload?: {
    color: string,
    dataKey: string,
    inactive: boolean,
    value: string
  }[]
  data?: DateValues
}

const CasesInLocationLegend: FunctionComponent<CasesInLocationLegendProps> = ({ payload, data }) => {
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
    <div
      className='d-flex small border text-center rounded-lg mx-auto
      cases-in-location-legend-container overflow-hidden mb-4 flex-wrap'
    >
      {latestConfirmed != null && (
        <div className='flex-1'>
          <div className='py-1'
               style={{ backgroundColor: payloadConfirmed?.color }}>Confirmed
          </div>
          <div className='py-1'>{numToGroupedString(latestConfirmed)}</div>
        </div>
      )}

      {latestNewConfirmed != null && (
        <div className='flex-1'>
          <div className='py-1'
               style={{ backgroundColor: payloadNewConfirmed?.color }}>New
          </div>
          <div className='py-1'>{numToGroupedString(latestNewConfirmed)}</div>
        </div>
      )}

      {latestRecovered != null && (
        <div className='flex-1'>
          <div className='py-1 text-light'
               style={{ backgroundColor: payloadRecovered?.color }}>Recovered
          </div>
          <div className='py-1'>{numToGroupedString(latestRecovered)}</div>
        </div>
      )}

      {latestDeaths != null && (
        <div className='flex-1'>
          <div className='py-1 text-light'
               style={{ backgroundColor: payloadDeaths?.color }}>Deaths
          </div>
          <div className='py-1'>{numToGroupedString(latestDeaths)}</div>
        </div>
      )}
    </div>
  );
};

export default CasesInLocationLegend;
