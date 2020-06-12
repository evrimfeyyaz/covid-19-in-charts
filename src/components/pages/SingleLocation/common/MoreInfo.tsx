import React, { FunctionComponent, useRef, useState } from "react";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import { titleCase } from "title-case";

interface MoreInfoProps {
  /**
   * The text that should show an overlaid information when hovered over.
   */
  text: string;
  /**
   * The detailed information to show.
   */
  info: string | JSX.Element;
  /**
   * The color of the text.
   */
  color?: string;
}

export const MoreInfo: FunctionComponent<MoreInfoProps> = ({ text, info, color }) => {
  const textRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);

  function toggleInfo(): void {
    setShowInfo(!showInfo);
  }

  const style = {
    color,
    borderColor: color,
  };

  return (
    <>
      <span
        ref={textRef}
        onMouseEnter={toggleInfo}
        onMouseLeave={toggleInfo}
        className="more-info"
        style={style}
      >
        {text}
      </span>
      <Overlay target={textRef.current} show={showInfo} placement="top">
        <Popover id="more-info-popover">
          <Popover.Title as="h3">{titleCase(text)}</Popover.Title>
          <Popover.Content>{info}</Popover.Content>
        </Popover>
      </Overlay>
    </>
  );
};
