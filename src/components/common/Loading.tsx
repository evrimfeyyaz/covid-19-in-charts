import React, { FunctionComponent } from "react";
import Spinner from "react-bootstrap/Spinner";

interface LoadingProps {
  message?: string;
}

const Loading: FunctionComponent<LoadingProps> = ({ message }) => {
  return (
    <div
      className="h-100 w-100 position-fixed d-flex flex-column align-items-center justify-content-center"
      style={{ top: 0, left: 0, zIndex: -999 }}
    >
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>

      <p className="d-flex align-items-center px-5 text-center" style={{ height: 60 }}>
        {message ?? " "}
      </p>
    </div>
  );
};

export default Loading;
