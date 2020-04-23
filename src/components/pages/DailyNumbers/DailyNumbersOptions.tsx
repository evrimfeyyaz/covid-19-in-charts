import React, { FunctionComponent } from 'react';
import Form from 'react-bootstrap/Form';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isSameDay } from 'date-fns';

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
        <ReactDatePicker
          selected={date}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat='yyyy-MM-dd'
          className='form-control'
          wrapperClassName='d-block'
        />
      </Form.Group>
    </>
  );
};

export default DailyNumbersOptions;
