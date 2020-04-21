import React, { FunctionComponent } from 'react';
import Card from 'react-bootstrap/Card';

interface DailyNumbersTableItemProps {
  bgColor: string,
  title: string,
  value: string,
  className?: string,
}

const DailyNumbersTableItem: FunctionComponent<DailyNumbersTableItemProps> = ({ bgColor, title, value, className }) => {
  return (
    <Card className={`shadow rounded-lg ${className}`}>
      <Card.Header style={{ backgroundColor: bgColor }}>{title}</Card.Header>
      <Card.Body>
        <Card.Text className='h1 text-shadow-dark'>
          {value}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DailyNumbersTableItem;
