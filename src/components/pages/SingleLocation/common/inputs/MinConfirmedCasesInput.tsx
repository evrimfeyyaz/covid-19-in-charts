import React, { FunctionComponent } from "react";
import Form from "react-bootstrap/Form";

interface MinConfirmedCasesProps {
  /**
   * The current set minimum confirmed cases value as a number, or `null` if the minimum confirmed
   * cases option is off.
   */
  value: number | null;
  /**
   * Called when the user has requested to change the minimum confirmed cases value.
   *
   * @param value The new minimum confirmed cases value, or `null` if the minimum confirmed cases
   *   option is off.
   */
  onChange?: (value: number | null) => void;
}

/**
 * An input that allows the user to select what the minimum number of confirmed cases should be for
 * the data on a certain date to be charted.
 */
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