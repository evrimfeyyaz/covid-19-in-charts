import { useAlwaysPresentQueryParam } from './useAlwaysPresentQueryParam';
import Form from 'react-bootstrap/Form';
import React, { ChangeEvent } from 'react';
import { NumberParam } from 'use-query-params';

type UseNumberSelectionReturnValue = [
  number, // selectedNumber
  JSX.Element // numberInputComponent
]

export function useNumberSelection(
  queryParamName: string,
  defaultValue: number,
  inputLabel: string,
): UseNumberSelectionReturnValue {
  const [number, setNumber] = useAlwaysPresentQueryParam(
    queryParamName,
    defaultValue,
    NumberParam,
  );

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    let newNumber = parseInt(value);

    if (!isNaN(newNumber) && newNumber !== number) {
      setNumber(newNumber);
    }
  }

  const numberInputComponent = (
    <Form.Group>
      <Form.Label>{inputLabel}</Form.Label>
      <Form.Control
        defaultValue={number}
        onChange={handleNumberChange}
      />
    </Form.Group>
  );

  return [number, numberInputComponent];
}
