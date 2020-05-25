import React, { FunctionComponent } from "react";
import Form from "react-bootstrap/Form";
import ReactDatePicker from "react-datepicker";
import { dateToYMDString, isDateBetween } from "../../utilities/dateUtilities";
import { isDateInputSupported } from "../../utilities/deviceUtilities";

interface DatePickerProps {
  selected: Date;
  minDate: Date;
  maxDate: Date;
  onChange: (date: Date) => void;
}

const DatePicker: FunctionComponent<DatePickerProps> = ({
  selected,
  minDate,
  maxDate,
  onChange,
}) => {
  const minDateStr = dateToYMDString(minDate);
  const maxDateStr = dateToYMDString(maxDate);
  const selectedDateStr = dateToYMDString(selected);

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const date = event.currentTarget.valueAsDate;

    if (date != null && isDateBetween(date, minDate, maxDate)) {
      onChange(date);
    }
  }

  let dateInput = (
    <Form.Control
      type="date"
      min={minDateStr}
      max={maxDateStr}
      value={selectedDateStr}
      pattern="\d{4}-\d{2}-\d{2}"
      onChange={handleDateChange}
    />
  );

  if (!isDateInputSupported()) {
    dateInput = (
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat="yyyy-MM-dd"
        className="form-control"
        wrapperClassName="d-block"
      />
    );
  }

  return dateInput;
};

export default DatePicker;
