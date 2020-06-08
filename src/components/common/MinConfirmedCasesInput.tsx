import React, { FunctionComponent } from "react";
import Form from "react-bootstrap/Form";

interface MinConfirmedCasesProps {
  value: number | null;
  onChange?: (value: number | null) => void;
}

export const MinConfirmedCasesInput: FunctionComponent<MinConfirmedCasesProps> = ({
  value,
  onChange,
}) => {
  const selectedValue = value == null ? "Off" : value.toString();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const number = parseInt(event.currentTarget.value);

    if (isNaN(number)) {
      onChange?.(null);
    } else {
      onChange?.(number);
    }
  }

  return (
    <Form.Group>
      <Form.Label>Minimum Confirmed Cases</Form.Label>
      <Form.Control as="select" value={selectedValue} onChange={handleChange} custom>
        <option value="off">Off</option>
        <option value={10}>10</option>
        <option value={100}>100</option>
        <option value={1000}>1,000</option>
        <option value={10000}>10,000</option>
        <option value={100000}>100,000</option>
      </Form.Control>
    </Form.Group>
  );
};
