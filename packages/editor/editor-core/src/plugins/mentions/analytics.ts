import { EventType, GasPayload } from '@atlaskit/analytics-gas-types';
import { isSpecialMention, MentionDescription } from '@atlaskit/mention';
import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
import { SelectItemMode } from '../type-ahead/commands/select-item.js';

const componentName = 'mention';

export const buildAnalyticsPayload = (
  actionSubject: string,
  action: string,
  eventType: EventType,
  sessionId: string,
  otherAttributes = {},
): GasPayload => ({
  action,
  actionSubject,
  eventType,
  attributes: {
    packageName,
    packageVersion,
    componentName,
    sessionId,
    ...otherAttributes,
  },
  source: 'unknown',
});

type QueryAttributes = Partial<{
  queryLength: number;
  spaceInQuery: boolean;
}>;

const emptyQueryResponse: QueryAttributes = {
  queryLength: 0,
  spaceInQuery: false,
};

const extractAttributesFromQuery = (query?: string): QueryAttributes => {
  if (query) {
    return {
      queryLength: query.length,
      spaceInQuery: query.indexOf(' ') !== -1,
    };
  }
  return emptyQueryResponse;
};

export const buildTypeAheadCancelPayload = (
  duration: number,
  sessionId: string,
  query?: string,
): GasPayload => {
  const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
  return buildAnalyticsPayload(
    'mentionTypeahead',
    'cancelled',
    'ui',
    sessionId,
    {
      duration,
      queryLength,
      spaceInQuery,
    },
  );
};

const getPosition = (
  mentionList: MentionDescription[] | undefined,
  selectedMention: MentionDescription,
): number | undefined => {
  if (mentionList) {
    const index = mentionList.findIndex(
      mention => mention.id === selectedMention.id,
    );
    return index === -1 ? undefined : index;
  }
  return;
};

const isClicked = (insertType: SelectItemMode) => insertType === 'selected';

export const buildTypeAheadInsertedPayload = (
  duration: number,
  sessionId: string,
  insertType: SelectItemMode,
  mention: MentionDescription,
  mentionList?: MentionDescription[],
  query?: string,
): GasPayload => {
  const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
  return buildAnalyticsPayload(
    'mentionTypeahead',
    isClicked(insertType) ? 'clicked' : 'pressed',
    'ui',
    sessionId,
    {
      duration,
      position: getPosition(mentionList, mention),
      keyboardKey: isClicked(insertType) ? undefined : insertType,
      queryLength,
      spaceInQuery,
      isSpecial: isSpecialMention(mention),
      accessLevel: mention.accessLevel || '',
      userType: mention.userType,
      userId: mention.id,
    },
  );
};

export const buildTypeAheadRenderedPayload = (
  duration: number,
  userIds: Array<string>,
  query: string,
): GasPayload => {
  return {
    action: 'rendered',
    actionSubject: 'mentionTypeAhead',
    eventType: 'ui',
    attributes: {
      packageName,
      packageVersion,
      componentName,
      duration,
      userIds,
      query,
    },
  };
};
