import React, { FunctionComponent, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { getAliasesForLocation } from '../../utilities/countryUtilities';
import Form from 'react-bootstrap/Form';

interface LocationSelectionInputProps {
  locationsList: string[],
  defaultLocations: string[],
  multiple?: boolean,
  maxNumOfSelections?: number,
  placeholder: string,
  id: string,
  onLocationChange: (locations: string[]) => void
}

const LocationSelectionInput: FunctionComponent<LocationSelectionInputProps> = ({
                                                                                  locationsList, defaultLocations,
                                                                                  multiple, maxNumOfSelections = Infinity,
                                                                                  placeholder, id, onLocationChange,
                                                                                }) => {
  const [isMaxSelectionsReached, setIsMaxSelectionsReached] = useState(defaultLocations.length >= maxNumOfSelections);

  function filterLocationsBy(option: string, props: { text: string, selected: string[] }) {
    if (props.selected.includes(option)) {
      return false;
    }

    const location = option.toLowerCase().trim();
    const text = props.text.toLowerCase().trim();
    const aliases = getAliasesForLocation(option).map(alias => alias.toLowerCase().trim());

    const allNames = [location, ...aliases];

    return allNames.some(name => name.includes(text));
  }

  function handleChange(locations: string[]) {
    if (locations.length >= maxNumOfSelections) {
      setIsMaxSelectionsReached(true);
    } else {
      setIsMaxSelectionsReached(false);
    }

    onLocationChange(locations);
  }

  const maxSelectionsReachedMenu = () => (
    <div
      className='bg-white text-danger px-3 py-2 rounded-lg small location-selection-input-max-selections-reached-menu'>
      You can't select more than {maxNumOfSelections} locations.
    </div>
  );

  return (
    <Form.Group>
      <Form.Label>{multiple ? 'Locations' : 'Location'}</Form.Label>
      <Typeahead
        id={id}
        options={locationsList}
        defaultSelected={defaultLocations}
        filterBy={filterLocationsBy}
        placeholder={placeholder}
        highlightOnlyResult
        selectHintOnEnter
        clearButton
        multiple={multiple}
        onChange={handleChange}
        paginationText='Show more locations'
        renderMenu={
          isMaxSelectionsReached ? maxSelectionsReachedMenu : undefined
        }
      />
    </Form.Group>
  );
};

export default LocationSelectionInput;
