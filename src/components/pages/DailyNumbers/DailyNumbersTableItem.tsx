import React, { FunctionComponent } from 'react';
import Card from 'react-bootstrap/Card';
import { numToGroupedString } from '../../../utilities/numUtilities';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import _ from 'lodash';

interface DailyNumbersTableItemProps {
  headerBgColor: string,
  title: string,
  value: number | null,
  rateValue?: number | null,
  newValue?: number | null,
  headerClassName?: string,
}

const DailyNumbersTableItem: FunctionComponent<DailyNumbersTableItemProps> = ({
                                                                                headerBgColor, headerClassName,
                                                                                title, value, rateValue, newValue,
                                                                              }) => {
  const valueStr = value ? numToGroupedString(value) : 'No Data';
  const rateValueStr = rateValue ? (rateValue * 100).toFixed(2) : undefined;
  const newValueStr = newValue ? `+${numToGroupedString(newValue)}` : undefined;

  return (
    <Card className='rounded-lg bg-light mb-4 text-center'>
      <Card.Header style={{ backgroundColor: headerBgColor }} className={'h5 ' + headerClassName}>
        {title} {rateValueStr && (
        <small>({rateValueStr}%)</small>
      )}
      </Card.Header>
      <Card.Body>
        <Card.Text as='div'>
          <span className='h2 text-shadow-dark'>
            {valueStr}
          </span>
          {newValueStr && (
            <OverlayTrigger
              placement='bottom'
              overlay={
                <Tooltip id={`tooltip-${_.snakeCase(title)}`}>
                  Increase from the day before.
                </Tooltip>
              }
            >
              <div className='text-muted'>{newValueStr}</div>
            </OverlayTrigger>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DailyNumbersTableItem;
