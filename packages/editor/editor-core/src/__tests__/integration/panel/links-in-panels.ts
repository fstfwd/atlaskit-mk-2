import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '../../../../../../../build/webdriver-runner/wd-wrapper.js';
//'@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';

BrowserTestCase(
  'Inserts a link into a panel by typing Markdown',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);

    await browser.waitForSelector(fullpage.placeholder);
    await browser.click(fullpage.placeholder);

    await quickInsert(browser, 'Panel');

    // type some text
    await browser.type(editable, '[Atlassian](https://www.atlassian.com/)');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'Inserts a link into a panel by clicking the toolbar button',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);

    await browser.waitForSelector(fullpage.placeholder);
    await browser.click(fullpage.placeholder);

    await quickInsert(browser, 'Panel');

    // click the toolbar button
    const link = `[aria-label="Link"]`;
    await browser.click(link);

    // type link
    await browser.type(editable, 'https://www.atlassian.com/');
    await browser.keydown(13);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
