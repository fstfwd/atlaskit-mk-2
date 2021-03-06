import { removeOldProdSnapshots } from '@atlaskit/visual-regression/helper';

import { imageSnapshotFolder, initEditor } from '../_utils';
import {
  editable,
  setupMediaMocksProviders,
  insertMedia,
} from '../../integration/_helpers';

const snapshot = async page => {
  const image = await page.screenshot();
  // @ts-ignore
  expect(image).toMatchProdImageSnapshot();
};

describe('Snapshot Test: Media', () => {
  beforeAll(async () => {
    removeOldProdSnapshots(imageSnapshotFolder);
  });

  let page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await page.setViewport({ width: 1920, height: 1080 });
    await initEditor(page, 'full-page-with-toolbar');
    await setupMediaMocksProviders(page);

    // click into the editor
    await page.waitForSelector(editable);
    await page.click(editable);

    // prepare media
    await setupMediaMocksProviders(page);
  });

  afterEach(async () => {
    const image = await page.screenshot();
    // @ts-ignore
    expect(image).toMatchProdImageSnapshot();
  });

  describe('Lists', async () => {
    it('can insert a media single inside a bullet list', async () => {
      // type some text
      await page.click(editable);
      await page.type(editable, '* ');

      // now we can insert media as necessary
      await insertMedia(page);
      await page.waitForSelector('.media-card');
      await snapshot(page);
    });

    it('can insert a media single inside a numbered list', async () => {
      // type some text
      await page.click(editable);
      await page.type(editable, '1. ');

      // now we can insert media as necessary
      await insertMedia(page);
      await page.waitForSelector('.media-card');
      await snapshot(page);
    });
  });
});
