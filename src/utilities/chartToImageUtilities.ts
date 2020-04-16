import { uuidv4 } from './uuidv4';
import domtoimage from 'dom-to-image';
import { COLORS } from '../constants';
import FileSaver from 'file-saver';

export async function downloadRechartsChart(chartNode: HTMLElement): Promise<string> {
  const horizontalPadding = 20;
  const verticalPadding = 20;
  const scale = 2;
  const fileName = `${uuidv4()}.png`;

  // Some of the code below is from
  // https://github.com/tsayen/dom-to-image/issues/69#issuecomment-486146688
  const pngImage = await domtoimage
    .toPng(chartNode, {
      width: chartNode.offsetWidth * scale + horizontalPadding * scale * 2,
      height: chartNode.offsetHeight * scale + verticalPadding * scale * 2,
      bgcolor: COLORS.bgColor,
      style: {
        padding: `${verticalPadding}px ${horizontalPadding}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: chartNode.offsetWidth + horizontalPadding * 2 + 'px',
        height: chartNode.offsetHeight + verticalPadding * 2 + 'px',
      },
    });

  FileSaver.saveAs(pngImage, fileName);

  return pngImage;
}
