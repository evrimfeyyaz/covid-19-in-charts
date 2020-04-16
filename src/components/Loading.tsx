import React, { FunctionComponent } from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Loading: FunctionComponent = () => {
  return (
    <div className='h-100 w-100 position-fixed d-flex align-items-center justify-content-center'
         style={{ top: 0, left: 0 }}>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loading;
