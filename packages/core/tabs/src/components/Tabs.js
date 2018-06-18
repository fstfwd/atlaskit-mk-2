// @flow

import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import TabsNavigation from './TabsNavigation';
import DefaultTabContent from './TabContent';
import DefaultTabItem from './TabItem';
import { Tabs as StyledTabs } from '../styled';
import type {
  IsSelectedTestFunction,
  selectedProp,
  TabData,
  TabsProps,
  TabsState,
} from '../types';

const defaultIsSelectedTestNumber: IsSelectedTestFunction = (
  selectedIndex,
  tab,
  tabIndex,
) => selectedIndex === tabIndex;

const defaultIsSelectedTestObject: IsSelectedTestFunction = (selected, tab) =>
  selected === tab;

const defaultComponents = {
  Content: DefaultTabContent,
  Item: DefaultTabItem,
};

export class Tabs extends Component<TabsProps, TabsState> {
  static defaultProps = {
    components: {},
  };

  constructor(props: TabsProps) {
    super(props);

    const initiallyselected =
      this.props.selected || this.props.defaultSelected || this.props.tabs[0];

    const selected = this.resolveSelected(initiallyselected);

    this.state = {
      selected,
    };
  }

  componentWillReceiveProps(newProps: TabsProps) {
    if (
      typeof newProps.selected !== 'undefined' &&
      newProps.selected !== this.state.selected
    ) {
      const selected = this.resolveSelected(newProps.selected, newProps);
      this.setState({ selected });
    } else if (newProps.tabs !== this.props.tabs) {
      const updatedselected = this.resolveSelected(
        this.state.selected,
        newProps,
      );
      this.setState({ selected: updatedselected });
    }
  }

  resolveSelected = (selected: selectedProp, newProps?: TabsProps): TabData => {
    const { tabs, isSelectedTest } = newProps || this.props;

    const testFunction: IsSelectedTestFunction = (() => {
      if (isSelectedTest) {
        return isSelectedTest;
      }
      if (typeof selected === 'number') {
        return defaultIsSelectedTestNumber;
      }
      return defaultIsSelectedTestObject;
    })();

    return (
      tabs.find((tab, tabIndex) => testFunction(selected, tab, tabIndex)) ||
      tabs[0]
    );
  };

  onSelect = (newselected: TabData, newSelectedIndex: number) => {
    const { onSelect, selected } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(newselected, newSelectedIndex);
    }
    if (typeof selected === 'undefined') {
      this.setState({ selected: newselected });
    }
  };

  render() {
    const { components, tabs } = this.props;
    const { selected } = this.state;

    const { Content, Item } = { ...defaultComponents, ...components };
    const contentProps = {
      data: selected,
      elementProps: {
        role: 'tabpanel',
      },
    };
    return (
      <StyledTabs>
        <TabsNavigation
          component={Item}
          onSelect={this.onSelect}
          selected={selected}
          tabs={tabs}
        />
        <Content {...contentProps} />
      </StyledTabs>
    );
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'tabs',
  packageName: packageName,
  packageVersion: packageVersion,
})(
  withAnalyticsEvents({
    onSelect: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'tabs',

      attributes: {
        packageName: packageName,
        packageVersion: packageVersion,
      },
    }),
  })(Tabs),
);
