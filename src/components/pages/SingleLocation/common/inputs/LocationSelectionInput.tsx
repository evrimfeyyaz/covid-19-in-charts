import React, { FunctionComponent } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Form from "react-bootstrap/Form";
import { getAliasesForLocation } from "../../../../../utilities/locationUtilities";

interface LocationSelectionInputProps {
  /**
   * The list of locations to show.
   */
  locationsList: string[];
  /**
   * The initial locations that are selected.
   */
  defaultLocation: string;
  /**
   * The id to assign to the input component.
   */
  id: string;
  /**
   * A callback that is fired when the selected location is changed.
   *
   * @param location The new location that is selected.
   */
  onChange: (location: string) => void;
}

/**
 * A component that allows the user to select a single location with autocomplete.
 */
export const LocationSelectionInput: FunctionComponent<LocationSelectionInputProps> = ({
  locationsList,
  defaultLocation,
  id,
  onChange,
}) => {
  /**
   * Determines what autocomplete options to show based on the user input.
   *
   * The arguments are normally provided by the `Typeahead` component, not to be used outside it.
   *
   * @param option The option that is being tested to see if it should be shown as an autocomplete
   *   option.
   * @param props The props of the `Typeahead` instance, mainly the current text and the already
   *   selected options.
   */
  function filterLocationsBy(option: string, props: { text: string; selected: string[] }): boolean {
    if (props.selected.includes(option)) {
      return false;
    }

    const location = option.toLowerCase().trim();
    const text = props.text.toLowerCase().trim();
    const aliases = getAliasesForLocation(option).map((alias) => alias.toLowerCase().trim());

    const allNames = [location, ...aliases];

    return allNames.some((name) => name.includes(text));
  }

  function handleChange(locations: string[]): void {
    if (locations.length > 0) {
      onChange(locations[0]);
    }
  }

  return (
    <Form.Group controlId="location-input">
      <Form.Label>Location</Form.Label>
      <Typeahead
        id={id}
        options={locationsList}
        defaultSelected={[defaultLocation]}
        filterBy={filterLocationsBy}
        placeholder="Select location..."
        highlightOnlyResult
        selectHintOnEnter
        clearButton
        onChange={handleChange}
        paginationText="Show more locations"
        inputProps={{
          id: "location-input",
        }}
      />
    </Form.Group>
  );
};
