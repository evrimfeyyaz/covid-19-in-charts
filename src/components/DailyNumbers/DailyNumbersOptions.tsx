import React, { FunctionComponent, useEffect, useState } from 'react';
import { getAliasesForLocation } from '../../utilities/countryUtilities';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface InputValues {
  locations: string[],
  date: Date,
}

interface InputErrors {
  locations: string[]
}

interface DailyNumbersOptionsProps {
  defaultLocation: string,
  minDate: Date,
  maxDate: Date,
  locations: string[],
  location: string,
  date: Date,
  onValuesChange: (location: string, date: Date) => void,
}

const DailyNumbersOptions: FunctionComponent<DailyNumbersOptionsProps> = ({
                                                                            defaultLocation, locations,
                                                                            minDate, maxDate,
                                                                            location, date, onValuesChange,
                                                                          }) => {
  const [inputValues, setInputValues] = useState<InputValues>({
    locations: [location],
    date,
  });

  useEffect(() => {
    const { locations, date } = inputValues;
    const errors = validateInputs(locations);

    if (errors.locations.length === 0) {
      let selectedLocation = inputValues.locations[0];

      if (locations.indexOf(selectedLocation) === -1) {
        selectedLocation = defaultLocation;

        setInputValues({
          ...inputValues,
          locations: [selectedLocation],
        });
      }

      onValuesChange(selectedLocation, date);
    }
  }, [inputValues, locations, onValuesChange, defaultLocation]);

  function handleLocationMenuBlur() {
    if (inputValues.locations.length === 0) {
      setInputValues({ ...inputValues, locations: [location] });
    }
  }

  function handleLocationChange(locations: string[]) {
    setInputValues({ ...inputValues, locations: locations });
  }

  function handleDateChange(date: Date) {
    setInputValues({ ...inputValues, date });
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
          onBlur={handleLocationMenuBlur}
          selected={inputValues.locations}
          paginationText='Show more locations'
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Date</Form.Label>
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

function validateInputs(selectedLocations: string[]): InputErrors {
  let errors: InputErrors = {
    locations: [],
  };

  if (selectedLocations.length === 0) {
    errors.locations = ['No location selected.'];
  } else {
    errors.locations = [];
  }

  return errors;
}

export default DailyNumbersOptions;
