import { useAlwaysPresentQueryParam } from './useAlwaysPresentQueryParam';
import Form from 'react-bootstrap/Form';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
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
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current != null) {
      inputRef.current.value = number.toString();
      setError(undefined);
    }
  }, [number]);

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    const newNumber = parseInt(event.target.value);

    if (isNaN(newNumber)) {
      setError('Please enter a valid number.');
      return;
    } else {
      setError(undefined);
    }

    if (newNumber !== number) {
      setNumber(newNumber);
    }
  }

  const numberInputComponent = (
    <Form.Group>
      <Form.Label>{inputLabel}</Form.Label>
      <Form.Control
        defaultValue={number}
        onChange={handleNumberChange}
        isInvalid={error != null}
        ref={inputRef}
      />
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );

  return [number, numberInputComponent];
}
