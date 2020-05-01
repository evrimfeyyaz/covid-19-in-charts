import React from 'react';
import LocationSelectionInput from '../components/common/LocationSelectionInput';
import { hasSameElements } from '../utilities/arrayUtilities';
import { NonNullElementArrayParam } from '../utilities/useQueryParamsUtilities';
import { useAlwaysPresentQueryParam } from './useAlwaysPresentQueryParam';

type UseLocationSelectionReturnValue = [
  string[], // selectedLocations
  JSX.Element // locationInputComponent
]

interface UseLocationSelectionOptions {
  multiple?: boolean,
  maxNumOfSelections?: number
}

function useLocationSelection(
  locationsList: string[],
  defaultLocations: string[],
  options: UseLocationSelectionOptions = {},
): UseLocationSelectionReturnValue {
  const { multiple, maxNumOfSelections } = options;
  const [
    locations,
    setLocations,
  ] = useAlwaysPresentQueryParam('location', defaultLocations, NonNullElementArrayParam);

  function handleLocationChange(selectedLocations: string[]) {
    const newLocations = maxNumOfSelections ? selectedLocations.slice(0, maxNumOfSelections) : selectedLocations;

    if (selectedLocations.length > 0 && !hasSameElements(selectedLocations, locations)) {
      setLocations(newLocations);
    }
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
