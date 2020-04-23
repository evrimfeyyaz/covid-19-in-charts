import React, { FunctionComponent } from 'react';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';

interface SingleLocationSelectionInputProps {
  locations: string[],
  defaultLocation: string,
  filterLocationsBy: (option: string, props: { text: string }) => boolean,
  onLocationChange: (locations: string[]) => void
}

const SingleLocationSelectionInput: FunctionComponent<SingleLocationSelectionInputProps> = ({
                                                                                              locations, defaultLocation,
                                                                                              filterLocationsBy, onLocationChange,
                                                                                            }) => {
  return (
    <Form.Group>
      <Form.Label>Location</Form.Label>
      <Typeahead
        id='location-selection'
        options={locations}
        filterBy={filterLocationsBy}
        placeholder="Select location..."
        highlightOnlyResult
        selectHintOnEnter
        clearButton
        onChange={onLocationChange}
        defaultInputValue={defaultLocation}
        paginationText='Show more locations'
      />
    </Form.Group>
  );
};

export default SingleLocationSelectionInput;
