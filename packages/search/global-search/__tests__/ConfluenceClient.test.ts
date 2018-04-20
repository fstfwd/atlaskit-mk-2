import ConfluenceClient, {
  RecentPage,
  RecentSpace,
} from '../src/api/ConfluenceClient';
import { ResultType, ResultContentType } from '../src/model/Result';

import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';

const DUMMY_CONFLUENCE_HOST = 'http://localhost';
const DUMMY_CLOUD_ID = '123';

function buildMockPage(type: ResultContentType): RecentPage {
  return {
    available: true,
    contentType: type,
    id: '123',
    lastSeen: 123,
    space: 'Search & Smarts',
    spaceKey: 'abc',
    title: 'Page title',
    type: 'page',
    url: 'http://localhost',
  };
}

const MOCK_SPACE = {
  id: '123',
  key: 'S&S',
  icon: 'icon',
  name: 'Search & Smarts',
};

function mockRecentlyViewPages(pages: RecentPage[]) {
  fetchMock.get(
    'begin:http://localhost//wiki/rest/recentlyviewed/1.0/recent',
    pages,
  );
}

function mockRecentlyViewedSpaces(spaces: RecentSpace[]) {
  fetchMock
    .get(
      'begin:http://localhost//wiki/rest/recentlyviewed/1.0/recent/spaces',
      spaces,
    )
    .catch(u => console.log(u));
}

describe('ConfluenceClient', () => {
  let confluenceClient: ConfluenceClient;

  beforeEach(() => {
    confluenceClient = new ConfluenceClient(
      DUMMY_CONFLUENCE_HOST,
      DUMMY_CLOUD_ID,
    );
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  describe('getRecentItems', () => {
    it('should return confluence items', async () => {
      const pages: RecentPage[] = [
        buildMockPage(ResultContentType.Page),
        buildMockPage(ResultContentType.Blogpost),
      ];

      mockRecentlyViewPages(pages);

      const result = await confluenceClient.getRecentItems();

      expect(result).toEqual([
        {
          resultId: pages[0].id,
          type: ResultType.Object,
          name: pages[0].title,
          href: pages[0].url,
          avatarUrl: '',
          containerName: pages[0].space,
          contentType: pages[0].contentType,
        },
        {
          resultId: pages[1].id,
          type: ResultType.Object,
          name: pages[1].title,
          href: pages[1].url,
          avatarUrl: '',
          containerName: pages[1].space,
          contentType: pages[1].contentType,
        },
      ]);
    });

    it('should not break if no results are returned', async () => {
      mockRecentlyViewPages([]);
      const result = await confluenceClient.getRecentItems();
      expect(result).toEqual([]);
    });
  });

  describe('getRecentSpaces', () => {
    it('should return confluence spaces', async () => {
      const spaces: RecentSpace[] = [MOCK_SPACE, MOCK_SPACE];

      mockRecentlyViewedSpaces(spaces);

      const result = await confluenceClient.getRecentSpaces();

      expect(result).toEqual([
        {
          resultId: MOCK_SPACE.id,
          type: ResultType.Container,
          name: MOCK_SPACE.name,
          href: `/wiki/${MOCK_SPACE.key}/overview`,
          avatarUrl: MOCK_SPACE.icon,
        },
        {
          resultId: MOCK_SPACE.id,
          type: ResultType.Container,
          name: MOCK_SPACE.name,
          href: `/wiki/${MOCK_SPACE.key}/overview`,
          avatarUrl: MOCK_SPACE.icon,
        },
      ]);
    });

    it('should not break if no spaces are returned', async () => {
      mockRecentlyViewedSpaces([]);
      const result = await confluenceClient.getRecentSpaces();
      expect(result).toEqual([]);
    });
  });
});
