//@flow
import React, { Component, Fragment } from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Pagination, { collapseRange } from '../src';

const MAX_NUMBER_OF_PAGES = 7;

type State = {
  items: Array<{ link: string, value: number }>,
  selected: number,
};

export default class extends Component<{}, State> {
  state = {
    items: pageLinks,
    selected: 1,
  };

  onArrowClicked = (direction: string) => {
    if (direction === 'previous') {
      this.setState({
        selected: this.state.selected - 1,
      });
    } else {
      this.setState({
        selected: this.state.selected + 1,
      });
    }
  };

  updateTheSelected = (newPage: number) => {
    this.setState({
      selected: newPage,
    });
  };

  sendAnalytics = (analytic: any) => console.log(analytic);

  render() {
    const pageLinksCollapsed = collapseRange(
      MAX_NUMBER_OF_PAGES,
      this.state.selected,
      this.state.items,
    );
    const { selected } = this.state;
    const firstPage = pageLinksCollapsed[0];
    const lastPage = pageLinksCollapsed[pageLinksCollapsed.length - 1];
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.sendAnalytics}>
        <Pagination>
          {(LeftNavigator, Link, RightNavigator) => (
            <Fragment>
              <LeftNavigator
                isDisabled={firstPage.value === selected}
                onClick={(e, v) => {
                  v.fire();
                  this.onArrowClicked('previous');
                }}
              />
              {pageLinksCollapsed.map((pageLink, index) => {
                if (pageLink === '...') {
                  return (
                    <span
                      //eslint-disable-next-line
                      key={`${pageLink}-${index}`}
                      style={{ padding: '0 8px' }}
                    >
                      ...
                    </span>
                  );
                }
                const { value } = pageLink;
                return (
                  <Link
                    key={`${value}`}
                    onClick={(e, v, f) => {
                      console.log({ e, v, f });
                      this.updateTheSelected(value);
                    }}
                    isSelected={value === this.state.selected}
                  >
                    {value}
                  </Link>
                );
              })}
              <RightNavigator
                isDisabled={lastPage.value === selected}
                onClick={(e, v) => {
                  v.fire();
                  this.onArrowClicked();
                }}
              />
            </Fragment>
          )}
        </Pagination>
      </AnalyticsListener>
    );
  }
}

const pageLinks: Array<{ link: string, value: number }> = [...Array(13)].map(
  (_, index) => ({
    link: '#hello',
    value: index + 1,
  }),
);
