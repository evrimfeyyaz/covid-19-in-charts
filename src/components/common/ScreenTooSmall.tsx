import React, { FunctionComponent } from "react";

const ScreenTooSmall: FunctionComponent = () => {
  return (
    <div className="d-flex-when-width-not-sufficient text-center px-5 py-4 flex-grow-1 flex-column justify-content-center">
      <h1 className="h4">Your screen is too small for viewing charts.</h1>

      <p>
        If possible, try using your device in landscape mode, or use a device with a larger screen.
      </p>
    </div>
  );
};

export default ScreenTooSmall;
