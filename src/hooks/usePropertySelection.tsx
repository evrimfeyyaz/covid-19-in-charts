import { useAlwaysPresentQueryParam } from './useAlwaysPresentQueryParam';
import { ValuesOnDatePropertyParam } from '../utilities/useQueryParamsUtilities';
import Form from 'react-bootstrap/Form';
import React, { ChangeEvent } from 'react';
import Covid19DataStore, { ValuesOnDateProperty } from '../store/Covid19DataStore';
import usePersistedSelection, { UsePersistedSelectionOptions } from './usePersistedSelection';

type UsePropertySelectionReturnValue = [
  ValuesOnDateProperty, // selectedProperty
  string, // humanizedProperty
  JSX.Element // propertyInputComponent
]

interface UsePropertySelectionOptions extends UsePersistedSelectionOptions {
  onlyCumulativeValues?: boolean
}

export function usePropertySelection(
  queryParamName: string,
  defaultProperty: ValuesOnDateProperty,
  inputLabel: string,
  options: UsePropertySelectionOptions = {},
): UsePropertySelectionReturnValue {
  const { onlyCumulativeValues } = options;

  const [
    initialProperty,
    persistLastProperty,
  ] = usePersistedSelection(defaultProperty, options);
  const [
    property,
    setProperty
  ] = useAlwaysPresentQueryParam(queryParamName, initialProperty, ValuesOnDatePropertyParam,);

  const humanizedProperty = Covid19DataStore.humanizePropertyName(property);
  const selectableProperties = Covid19DataStore.valuesOnDateProperties
    .filter(property => {
      return (
        property !== 'date' &&
        (
          !onlyCumulativeValues ||
          (property === 'confirmed' || property === 'deaths' || property === 'recovered')
        )
      );
    });

  function handlePropertyChange(event: ChangeEvent<HTMLInputElement>) {
    const newProperty = event.currentTarget.value;

    if (
      Covid19DataStore.isValuesOnDateProperty(newProperty) &&
      selectableProperties.indexOf(newProperty) !== -1 &&
      newProperty !== property
    ) {
      setProperty(newProperty);
      persistLastProperty(newProperty);
    }
  }

  const propertyInputComponent = (
    <Form.Group>
      <Form.Label>{inputLabel}</Form.Label>
      <Form.Control
        as="select"
        className='custom-select'
        onChange={handlePropertyChange}
        value={property}
      >
        {selectableProperties.map(property => (
          <option
            value={property}
            key={`${queryParamName}-${property}`}
          >
            {Covid19DataStore.humanizePropertyName(property)}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );

  return [property, humanizedProperty, propertyInputComponent];
}
