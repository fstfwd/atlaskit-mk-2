import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';

BrowserTestCase(
  'Panel: Insert link by typing Markdown',
  { skip: ['edge', 'ie'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);

    await browser.waitForSelector(fullpage.placeholder);
    await browser.click(fullpage.placeholder);

    await quickInsert(browser, 'Panel');

    await browser.type(editable, '[Atlassian](https://www.atlassian.com/)');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
