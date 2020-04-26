import React, { FunctionComponent } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { getAliasesForLocation } from '../../utilities/countryUtilities';
import Form from 'react-bootstrap/Form';

interface LocationSelectionInputProps {
  locations: string[],
  defaultLocations: string[],
  multiple?: boolean,
  placeholder: string,
  id: string,
  onLocationChange: (locations: string[]) => void
}

const LocationSelectionInput: FunctionComponent<LocationSelectionInputProps> = ({
                                                                                  locations, defaultLocations,
                                                                                  multiple, placeholder, id,
                                                                                  onLocationChange,
                                                                                }) => {
  function filterLocationsBy(option: string, props: { text: string }) {
    const location = option.toLowerCase().trim();
    const text = props.text.toLowerCase().trim();
    const aliases = getAliasesForLocation(option).map(alias => alias.toLowerCase().trim());

    const allNames = [location, ...aliases];

    return allNames.some(name => name.includes(text));
  }

  return (
    <Form.Group>
      <Form.Label>{multiple ? 'Locations' : 'Location'}</Form.Label>
      <Typeahead
        id={id}
        options={locations}
        filterBy={filterLocationsBy}
        placeholder={placeholder}
        highlightOnlyResult
        selectHintOnEnter
        clearButton
        multiple={multiple}
        onChange={onLocationChange}
        defaultSelected={defaultLocations}
        paginationText='Show more locations'
      />
    </Form.Group>
  );
};

export default LocationSelectionInput;
