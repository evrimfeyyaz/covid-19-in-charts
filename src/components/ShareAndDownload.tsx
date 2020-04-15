import React, { FunctionComponent } from 'react';
import ShareButtons from './ShareButtons';
import Button from 'react-bootstrap/Button';

interface ShareAndDownloadProps {
  title: string,
  small?: boolean,
  onDownloadClick: () => void
}

const ShareAndDownload: FunctionComponent<ShareAndDownloadProps> = ({ title, small = false, onDownloadClick }) => {
  let containerClassNames = 'mt-auto';

  if (small) {
    containerClassNames += ' d-none d-lg-block';
  }

  return (
    <div className={containerClassNames}>
      <h2 className='h5 mt-3'>Share</h2>
      <ShareButtons title={title} url={window.location.href} small={small} />

      <h2 className='h5 mt-3'>Download</h2>
      <Button onClick={onDownloadClick} className='ml-2'>
        Download as PNG
      </Button>
    </div>
  );
};

export default ShareAndDownload;
