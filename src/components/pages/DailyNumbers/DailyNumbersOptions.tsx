import React, { FunctionComponent } from 'react';
import Form from 'react-bootstrap/Form';
import 'react-datepicker/dist/react-datepicker.css';
import { isSameDay } from 'date-fns';
import DatePicker from '../../common/DatePicker';

interface DailyNumbersOptionsProps {
  locationInputComponent: JSX.Element,
  minDate: Date,
  maxDate: Date,
  date: Date,
  onDateChange: (date: Date) => void,
}

const DailyNumbersOptions: FunctionComponent<DailyNumbersOptionsProps> = ({
                                                                            locationInputComponent,
                                                                            minDate, maxDate, date,
                                                                            onDateChange,
                                                                          }) => {
  function handleDateChange(newDate: Date) {
    if (newDate != null && !isSameDay(newDate, date)) {
      onDateChange(newDate);
    }
  }

  function handleShowLatestClick() {
    handleDateChange(maxDate);
  }

  return (
    <>
      {locationInputComponent}
      <Form.Group>
        <div className='d-flex align-items-baseline justify-content-between'>
          <Form.Label>Date</Form.Label>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleShowLatestClick}
          >
            Show Latest
          </button>
        </div>
        <DatePicker
          selected={date}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
        />
      </Form.Group>
    </>
  );
};

export default DailyNumbersOptions;
