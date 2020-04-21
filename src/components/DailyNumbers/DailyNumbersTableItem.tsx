import React, { FunctionComponent } from 'react';
import Card from 'react-bootstrap/Card';
import { numToGroupedString } from '../../utilities/numUtilities';

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

  let fullTitle = title;
  if (rateValueStr != null) {
    fullTitle += ` (${rateValueStr}%)`;
  }

  return (
    <Card className='shadow rounded-lg mb-4'>
      <Card.Header style={{ backgroundColor: headerBgColor }} className={headerClassName}>
        {fullTitle}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <span className='h2 text-shadow-dark'>
            {valueStr}
          </span>
          {newValueStr && (
            <div className='text-muted'>{newValueStr}</div>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DailyNumbersTableItem;
