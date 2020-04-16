import React, { FunctionComponent } from 'react';
import ShareButtons from './ShareButtons';
import Button from 'react-bootstrap/Button';

interface ShareAndDownloadProps {
  title: string,
  smallButtons?: boolean,
  onDownloadClick: () => void
}

const ShareAndDownload: FunctionComponent<ShareAndDownloadProps> = ({ title, smallButtons = false, onDownloadClick }) => {
  return (
    <>
      <h2 className='h5 mt-3'>Share</h2>
      <ShareButtons title={title} url={window.location.href} small={smallButtons} />

      <h2 className='h5 mt-3'>Download</h2>
      <Button onClick={onDownloadClick} className='ml-2'>
        Download as PNG
      </Button>
    </>
  );
};

export default ShareAndDownload;
