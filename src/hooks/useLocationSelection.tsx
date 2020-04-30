import React from 'react';
import LocationSelectionInput from '../components/common/LocationSelectionInput';
import { hasSameElements } from '../utilities/arrayUtilities';
import { NonNullElementArrayParam } from '../utilities/useQueryParamsUtilities';
import { useAlwaysPresentQueryParam } from './useAlwaysPresentQueryParam';

type UseLocationSelectionReturnValue = [
  string[], // selectedLocations
  JSX.Element // locationInputComponent
]

function useLocationSelection(
  locationsList: string[],
  defaultLocations: string[],
  multiple = false,
): UseLocationSelectionReturnValue {
  const [
    locations,
    setLocations,
  ] = useAlwaysPresentQueryParam('location', defaultLocations, NonNullElementArrayParam);

  function handleLocationChange(selectedLocations: string[]) {
    if (selectedLocations.length > 0 && !hasSameElements(selectedLocations, locations)) {
      setLocations(selectedLocations);
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
      key={encodeURIComponent(locations.join('-'))}
    />
  );

  return [
    locations,
    locationInputComponent,
  ];
}

export default useLocationSelection;
