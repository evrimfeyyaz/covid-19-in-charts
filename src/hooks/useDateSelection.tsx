import Form from 'react-bootstrap/Form';
import React from 'react';
import { DateParam, useQueryParam } from 'use-query-params';
import { isSameDay } from 'date-fns';
import DatePicker from '../components/common/DatePicker';

type UseDateSelectionReturnValue = [
  Date | undefined, // selectedDate
  JSX.Element // dateInputComponent
]

export function useDateSelection(
  minDate: Date,
  maxDate: Date,
): UseDateSelectionReturnValue {
  const [date, setDate] = useQueryParam('date', DateParam);

  const currentDate = date != null ? date : maxDate as Date;

  function handleDateChange(newDate: Date) {
    if (isSameDay(newDate, currentDate)) {
      return;
    }

    if (isSameDay(newDate, maxDate)) {
      setDate(undefined);
    } else {
      setDate(newDate);
    }
  }

  function handleShowLatestClick() {
    setDate(undefined);
  }

  const dateInputComponent = (
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
        selected={currentDate}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
      />
    </Form.Group>
  );

  return [currentDate, dateInputComponent];
}
