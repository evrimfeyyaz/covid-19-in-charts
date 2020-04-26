import { ArrayParam, useQueryParam } from 'use-query-params';
import React, { useEffect } from 'react';
import LocationSelectionInput from '../components/common/LocationSelectionInput';
import { hasSameElements } from '../utilities/arrayUtilities';

type UseLocationSelectionReturnValue = [
  string[], // selected locations
  JSX.Element // locationInputComponent
]

function useLocationSelection(
  locationsList: string[],
  defaultLocations: string[],
  multiple = false,
): UseLocationSelectionReturnValue {
  useEffect(() => {
    // Set current query param in the URL, just in case it is missing.
    setLocations(locations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [locations = defaultLocations, setLocations] = useQueryParam('location', ArrayParam);

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
    />
  );

  return [
    locations,
    locationInputComponent,
  ];
}

export default useLocationSelection;
