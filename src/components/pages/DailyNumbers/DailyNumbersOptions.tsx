import React, { FunctionComponent } from 'react';
import { getAliasesForLocation } from '../../../utilities/countryUtilities';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isSameDay } from 'date-fns';

interface DailyNumbersOptionsProps {
  minDate: Date,
  maxDate: Date,
  locations: string[],
  location: string,
  date: Date,
  onDateChange: (date: Date) => void,
  onLocationChange: (location: string) => void,
}

const DailyNumbersOptions: FunctionComponent<DailyNumbersOptionsProps> = ({
                                                                            locations, minDate, maxDate,
                                                                            location, date,
                                                                            onDateChange, onLocationChange,
                                                                          }) => {
  function handleLocationChange(locations: string[]) {
    if (locations != null && locations.length > 0 && locations[0] !== location) {
      onLocationChange(locations[0]);
    }
  }

  function handleDateChange(newDate: Date) {
    if (newDate != null && !isSameDay(newDate, date)) {
      onDateChange(newDate);
    }
  }

  function handleShowLatestClick() {
    handleDateChange(maxDate);
  }

  function filterLocationsBy(option: string, props: { text: string }) {
    const location = option.toLowerCase().trim();
    const text = props.text.toLowerCase().trim();
    const aliases = getAliasesForLocation(option).map(alias => alias.toLowerCase().trim());

    const allNames = [location, ...aliases];

    return allNames.some(name => name.includes(text));
  }

  return (
    <>
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Typeahead
          id='location-selection'
          options={locations}
          filterBy={filterLocationsBy}
          placeholder='Select location...'
          highlightOnlyResult
          selectHintOnEnter
          clearButton
          onChange={handleLocationChange}
          defaultInputValue={location}
          paginationText='Show more locations'
        />
      </Form.Group>

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
