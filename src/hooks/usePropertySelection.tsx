import {
  humanizePropertyName,
  isValuesOnDateProperty,
  valuesOnDateProperties
} from "../utilities/covid19APIUtilities";
import { useAlwaysPresentQueryParam } from "./useAlwaysPresentQueryParam";
import { ValuesOnDatePropertyParam } from "../utilities/useQueryParamsUtilities";
import Form from "react-bootstrap/Form";
import React, { ChangeEvent } from "react";
import usePersistedSelection, { UsePersistedSelectionOptions } from "./usePersistedSelection";

type UsePropertySelectionReturnValue = [
  string, // selectedProperty
  string, // humanizedProperty
  JSX.Element // propertyInputComponent
]

interface UsePropertySelectionOptions extends UsePersistedSelectionOptions {
  onlyCumulativeValues?: boolean
}

export function usePropertySelection(
  queryParamName: string,
  defaultProperty: string,
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

  const humanizedProperty = humanizePropertyName(property);
  const selectableProperties = valuesOnDateProperties
    .filter(property => {
      return (
        property !== "date" &&
        (
          !onlyCumulativeValues ||
          (property === "confirmed" || property === "deaths" || property === "recovered")
        )
      );
    });

  function handlePropertyChange(event: ChangeEvent<HTMLInputElement>) {
    const newProperty = event.currentTarget.value;

    if (
      isValuesOnDateProperty(newProperty) &&
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
            {humanizePropertyName(property)}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );

  return [property, humanizedProperty, propertyInputComponent];
}
