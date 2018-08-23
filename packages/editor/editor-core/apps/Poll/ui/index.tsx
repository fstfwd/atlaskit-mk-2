import * as React from 'react';
import Button from '@atlaskit/button';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import MediaServicesPreselectedIcon from '@atlaskit/icon/glyph/media-services/preselected';
import { akColorB300, akColorN70 } from '@atlaskit/util-shared-styles';
import {
  CompletedChoiceContainer,
  Meta,
  Header,
  ChoicesContainer,
  ProgressBar,
} from './styles';
import { getExpiresInLabel, isCompleted, getUserId } from './utils';
import { initPoll, vote } from './actions';

const CheckIcon = <CheckCircleIcon label="Vote" primaryColor={akColorB300} />;
const CircleIcon = (
  <MediaServicesPreselectedIcon label="Vote" primaryColor={akColorN70} />
);

interface Props {
  id: string;
  editable: boolean;
  title: string;
  choices: Array<{ id: string; value: string }>;
  finishDate: number;
}

type Votes = Array<{ userId: string; choiceId: string }>;

interface State {
  loading: boolean;
  selectedChoiceId?: string;
  userId: string | null;
  // dynamic prop, fetching this from API
  votes: Votes;
}

const CompletedChoice = (props: {
  id: string;
  value: string;
  votes: Votes;
}) => {
  const { votes, id, value } = props;
  const numOfChoices = votes.filter(vote => vote.choiceId === id).length;
  const percent = Math.round(numOfChoices * 100 / votes.length);
  return (
    <CompletedChoiceContainer>
      <ProgressBar width={percent} />
      <div>
        <span className="completed-choice-percent">{`${percent}%`}</span>
        <span className="completed-choice-value">{value}</span>
      </div>
    </CompletedChoiceContainer>
  );
};

export class PollApp extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      votes: [],
      userId: getUserId(),
      loading: true,
    };

    initPoll({ id: props.id }).then(votes => {
      console.log(`setting up Poll with ${votes.length} `);
      this.setState({ votes, loading: false });
    });
  }

  render() {
    const { title, choices, finishDate } = this.props;
    const { loading, userId, selectedChoiceId, votes } = this.state;
    const allowedToVote = userId && !isCompleted({ votes, userId });

    if (loading) {
      return <div>loading...</div>;
    }

    return (
      <>
        <Header>{title}</Header>
        <ChoicesContainer>
          {choices.map((choice, i) => {
            return allowedToVote ? (
              <Button
                key={choice.id}
                shouldFitContainer
                iconBefore={
                  selectedChoiceId === choice.id ? CheckIcon : CircleIcon
                }
                onClick={() => this.handleSelect(choice.id)}
              >
                {choice.value}
              </Button>
            ) : (
              <CompletedChoice {...choice} key={choice.id} votes={votes} />
            );
          })}
        </ChoicesContainer>
        {allowedToVote && (
          <Button appearance="primary" onClick={this.handleVote}>
            Vote
          </Button>
        )}
        {!userId && (
          <Button href="https://id.atlassian.com/login">Login</Button>
        )}
        <Meta>
          {votes.length} votes • {getExpiresInLabel(finishDate)}
        </Meta>
      </>
    );
  }

  private handleSelect = choiceId => {
    this.setState({ selectedChoiceId: choiceId });
  };

  private handleVote = () => {
    const { selectedChoiceId, userId } = this.state;
    const { editable } = this.props;
    if (typeof selectedChoiceId !== 'undefined' && userId && !editable) {
      this.setState({ loading: true });

      vote({ choiceId: selectedChoiceId, userId }).then(votes => {
        console.log('voted! all new votes:', votes);
        // this.setState({ votes, loading: false });
      });
    }
  };
}
