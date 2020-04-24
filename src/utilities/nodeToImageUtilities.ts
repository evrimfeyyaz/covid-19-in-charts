import { v4 as uuidv4 } from 'uuid';
import domtoimage from 'dom-to-image';
import { COLORS } from '../constants';
import FileSaver from 'file-saver';

export async function downloadNode(node: HTMLElement): Promise<string> {
  const horizontalPadding = 20;
  const verticalPadding = 20;
  const scale = 2;
  const fileName = `${uuidv4()}.png`;

  // Some of the code below is from
  // https://github.com/tsayen/dom-to-image/issues/69#issuecomment-486146688
  const pngImage = await domtoimage
    .toPng(node, {
      width: node.offsetWidth * scale + horizontalPadding * scale * 2,
      height: node.offsetHeight * scale + verticalPadding * scale * 2,
      bgcolor: COLORS.bgColor,
      style: {
        padding: `${verticalPadding}px ${horizontalPadding}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: node.offsetWidth + horizontalPadding * 2 + 'px',
        height: node.offsetHeight + verticalPadding * 2 + 'px',
      },
    });

  FileSaver.saveAs(pngImage, fileName);

  return pngImage;
}
