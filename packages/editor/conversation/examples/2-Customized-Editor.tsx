import { ReactionStore } from '@atlaskit/reactions';
import { MockReactionsAdapter } from '@atlaskit/reactions/src/adapter/MockReactionsAdapter';
import * as React from 'react';
import { MOCK_USERS } from '../example-helpers/MockData';
import {
  getDataProviderFactory,
  MockProvider as ConversationResource,
} from '../example-helpers/MockProvider';
import { Conversation } from '../src';

const provider = new ConversationResource({
  url: 'http://mockservice/',
  user: MOCK_USERS[3],
});

const reactionAdapter = new MockReactionsAdapter();

export default class ExistingConversation extends React.Component<
  {},
  { conversationId?: string }
> {
  state = {
    conversationId: undefined,
  };

  async componentDidMount() {
    const [conversation] = await provider.getConversations();

    this.setState({
      conversationId: conversation.conversationId,
    });
  }

  render() {
    const { conversationId } = this.state;
    if (!conversationId) {
      return null;
    }

    return (
      <ReactionStore adapter={reactionAdapter}>
        <Conversation
          id={conversationId}
          containerId="ari:cloud:platform::conversation/demo"
          provider={provider}
          dataProviders={getDataProviderFactory()}
          renderEditor={(Editor, props) => (
            <Editor {...props} appearance="message" saveOnEnter={true} />
          )}
        />
      </ReactionStore>
    );
  }
}
