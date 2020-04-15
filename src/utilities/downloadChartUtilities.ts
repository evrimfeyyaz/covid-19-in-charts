import { uuidv4 } from './uuidv4';
import domtoimage from 'dom-to-image';
import { COLORS } from '../constants';
import FileSaver from 'file-saver';

export function downloadRechartsChart(chartNode: HTMLElement): Promise<void> {
  const horizontalPadding = 20;
  const verticalPadding = 20;
  const fileName = `${uuidv4()}.png`;

  // Some of the code below is from
  // https://github.com/tsayen/dom-to-image/issues/69#issuecomment-486146688
  return domtoimage
    .toBlob(chartNode, {
      width: chartNode.offsetWidth * 2 + horizontalPadding * 2 * 2,
      height: chartNode.offsetHeight * 2 + verticalPadding * 2 * 2,
      bgcolor: COLORS.bgColor,
      style: {
        padding: `${verticalPadding}px ${horizontalPadding}px`,
        transform: 'scale(2)',
        transformOrigin: 'top left',
        width: chartNode.offsetWidth + horizontalPadding * 2 + 'px',
        height: chartNode.offsetHeight + verticalPadding * 2 + 'px',
      },
    })
    .then(blob => FileSaver.saveAs(blob, fileName));
}
