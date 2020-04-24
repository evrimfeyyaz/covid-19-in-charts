import { StringParam, useQueryParam } from 'use-query-params';
import { SETTINGS } from '../../../constants';
import React, { useEffect } from 'react';
import { getAliasesForLocation } from '../../../utilities/countryUtilities';
import SingleLocationSelectionInput from './SingleLocationSelectionInput';

type UseSingleLocationSelectionReturnValue = [
  string, // location
  JSX.Element // locationInputComponent
]

function useSingleLocationSelection(locations: string[]): UseSingleLocationSelectionReturnValue {
  useEffect(() => {
    // Set current query param in the URL, just in case it is missing.
    setLocation(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [location = SETTINGS.defaultLocation, setLocation] = useQueryParam('location', StringParam);

  function handleLocationChange(locations: string[]) {
    if (locations != null && locations.length > 0 && locations[0] !== location) {
      setLocation(locations[0]);
    }
  }

  function filterLocationsBy(option: string, props: { text: string }) {
    const location = option.toLowerCase().trim();
    const text = props.text.toLowerCase().trim();
    const aliases = getAliasesForLocation(option).map(alias => alias.toLowerCase().trim());

    const allNames = [location, ...aliases];

    return allNames.some(name => name.includes(text));
  }

  const locationInputComponent = (
    <SingleLocationSelectionInput
      locations={locations}
      defaultLocation={location}
      onLocationChange={handleLocationChange}
      filterLocationsBy={filterLocationsBy}
    />
  );

  return [
    location,
    locationInputComponent,
  ];
}

export default useSingleLocationSelection;
