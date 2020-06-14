import React, { FunctionComponent, useRef, useState } from "react";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import { titleCase } from "title-case";

interface MoreInfoTextProps {
  /**
   * The text that should show an overlaid information when hovered over.
   */
  text: string;
  /**
   * The title of the information popover. If no title is given then a title-cased version of the
   * `text` is used.
   */
  title?: string;
  /**
   * The detailed information to show.
   */
  info: string | JSX.Element;
  /**
   * The color of the text.
   */
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * A component that renders a text which shows extra information on mouse over.
 */
export const MoreInfo: FunctionComponent<MoreInfoTextProps> = ({
  text,
  title,
  info,
  color,
  style,
  className,
}) => {
  const textRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);

  function toggleInfo(): void {
    setShowInfo(!showInfo);
  }

  const containerStyle = {
    ...style,
    color,
    borderColor: color,
  };

  return (
    <>
      <span
        ref={textRef}
        onMouseEnter={toggleInfo}
        onMouseLeave={toggleInfo}
        className={`${className} more-info`}
        style={containerStyle}
      >
        {text}
      </span>
      <Overlay target={textRef.current} show={showInfo} placement="top">
        <Popover id="more-info-popover">
          <Popover.Title as="h3">{title ?? titleCase(text)}</Popover.Title>
          <Popover.Content>{info}</Popover.Content>
        </Popover>
      </Overlay>
    </>
  );
};
