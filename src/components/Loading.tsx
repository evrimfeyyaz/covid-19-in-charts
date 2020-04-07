import React, { FunctionComponent } from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Loading: FunctionComponent = () => {
  return (
    <div className='h-100 d-flex justify-content-center align-items-center'>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loading;
