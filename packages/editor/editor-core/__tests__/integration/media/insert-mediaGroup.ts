import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  setupMediaMocksProviders,
  message,
  comment,
  insertMedia,
} from '../_helpers';
import { sleep } from '@atlaskit/editor-test-helpers';

[comment, message].forEach(editor => {
  BrowserTestCase(
    `Inserts a media group on ${editor.name}`,
    { skip: ['edge', 'ie', 'safari'] },
    async client => {
      const browser = await new Page(client);

      await browser.goto(editor.path);
      await browser.click(editor.placeholder);

      // prepare media
      await setupMediaMocksProviders(browser);

      await browser.click(editable);
      await browser.type(editable, 'some text');

      // now we can insert media as necessary
      await insertMedia(browser);

      // wait for "upload" and finish doc sync
      await sleep(200);
      await browser.waitForSelector('.image');
      expect(await browser.isVisible('.image')).toBe(true);

      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
