import React from 'react';
import LocationSelectionInput from '../components/common/LocationSelectionInput';
import { hasSameElements } from '../utilities/arrayUtilities';
import { NonNullElementArrayParam } from '../utilities/useQueryParamsUtilities';
import { useAlwaysPresentQueryParam } from './useAlwaysPresentQueryParam';
import { getLocalStorageItem, setLocalStorageItem } from '../utilities/localStorageUtilities';

type UseLocationSelectionReturnValue = [
  string[], // selectedLocations
  JSX.Element // locationInputComponent
]

interface UseLocationSelectionOptions {
  multiple?: boolean,
  maxNumOfSelections?: number,
  lastSelectionAsDefault?: boolean,
  lastSelectionStorageKey?: string,
}

function useLocationSelection(
  locationsList: string[],
  defaultLocations: string[],
  options: UseLocationSelectionOptions = {},
): UseLocationSelectionReturnValue {
  const {
    multiple,
    maxNumOfSelections,
    lastSelectionAsDefault,
    lastSelectionStorageKey,
  } = options;

  const initialSelections = restoreLastSelection();
  const [
    locations,
    setLocations,
  ] = useAlwaysPresentQueryParam('location', initialSelections, NonNullElementArrayParam);

  function handleLocationChange(selectedLocations: string[]) {
    const newLocations = maxNumOfSelections ? selectedLocations.slice(0, maxNumOfSelections) : selectedLocations;

    if (selectedLocations.length > 0 && !hasSameElements(selectedLocations, locations)) {
      setLocations(newLocations);
      persistLastSelection(newLocations);
    }
  }

  function persistLastSelection(selectedLocations: string[]) {
    if (lastSelectionAsDefault && lastSelectionStorageKey) {
      setLocalStorageItem(lastSelectionStorageKey, selectedLocations)
    }
  }

  function restoreLastSelection(): string[] {
    let lastSelections: (string[] | null) = null;
    if (lastSelectionAsDefault && lastSelectionStorageKey) {
      lastSelections = getLocalStorageItem(lastSelectionStorageKey);
    }

    return lastSelections ?? defaultLocations;
  }

  const placeholder = multiple ? 'Select locations...' : 'Select location...';

  const locationInputComponent = (
    <LocationSelectionInput
      locationsList={locationsList}
      defaultLocations={locations}
      id='location-selection-input'
      placeholder={placeholder}
      multiple={multiple}
      onLocationChange={handleLocationChange}
      maxNumOfSelections={maxNumOfSelections}
      key={encodeURIComponent(locations.join('-'))}
    />
  );

  return [
    locations,
    locationInputComponent,
  ];
}

export default useLocationSelection;
