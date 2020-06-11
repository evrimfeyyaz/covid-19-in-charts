import React, { FunctionComponent, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Form from "react-bootstrap/Form";
import { getAliasesForLocation } from "../../utilities/locationUtilities";

interface LocationSelectionInputProps {
  /**
   * The list of locations to show.
   */
  locationsList: string[];
  /**
   * The initial locations that are selected.
   */
  defaultLocations: string[];
  /**
   * Whether or not the user is allowed to select multiple locations.
   */
  multiple?: boolean;
  /**
   * The maximum number of locations that the user can select.
   */
  maxNumOfSelections?: number;
  /**
   * The placeholder text to show when there are no selected locations.
   */
  placeholder: string;
  /**
   * The id to assign to the input component.
   */
  id: string;
  /**
   * A callback that is fired when the selected locations are changed.
   *
   * @param locations The new locations that are selected.
   */
  onChange: (locations: string[]) => void;
}

/**
 * A component that allows the user to select a single location or multiple locations with
 * autocomplete.
 */
export const LocationSelectionInput: FunctionComponent<LocationSelectionInputProps> = ({
  locationsList,
  defaultLocations,
  multiple,
  maxNumOfSelections = Infinity,
  placeholder,
  id,
  onChange,
}) => {
  const [isMaxSelectionsReached, setIsMaxSelectionsReached] = useState(
    defaultLocations.length >= maxNumOfSelections
  );

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
    if (locations.length >= maxNumOfSelections) {
      setIsMaxSelectionsReached(true);
    } else {
      setIsMaxSelectionsReached(false);
    }

    onChange(locations);
  }

  /**
   * The menu to show the the number of maximum selections is reached (only when the `multiple`
   * option is set to `true`).
   */
  const maxSelectionsReachedMenu = (): JSX.Element => (
    <div className="bg-white text-danger px-3 py-2 rounded-lg small location-selection-input-max-selections-reached-menu">
      You can't select more than {maxNumOfSelections} locations.
    </div>
  );

  return (
    <Form.Group>
      <Form.Label>{multiple ? "Locations" : "Location"}</Form.Label>
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
        paginationText="Show more locations"
        renderMenu={isMaxSelectionsReached ? maxSelectionsReachedMenu : undefined}
      />
    </Form.Group>
  );
};
