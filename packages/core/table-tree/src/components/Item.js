// @flow
import React, { PureComponent } from 'react';
import Items from './Items';
import toItemId from '../utils/toItemId';
import { type RenderFunction, type RowData } from './../types';

type Props = {
  data: RowData,
  depth?: number,
  render: RenderFunction,
};

type State = {
  isExpanded: boolean,
};

// TODO is it really pure?
export default class Item extends PureComponent<Props, State> {
  state: State = {
    isExpanded: false,
  };

  static defaultProps = {
    depth: 0,
  };

  handleExpandToggleClick = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  };

  render() {
    const { depth, data, render } = this.props;
    const { isExpanded } = this.state;

    const renderedRow = render(data);
    if (!renderedRow) {
      return null;
    }
    const { hasChildren, itemId, childItems } = renderedRow.props;
    const wrappedRow = React.cloneElement(renderedRow, {
      onExpandToggle: this.handleExpandToggleClick,
      depth,
      isExpanded,
      data,
    });
    return (
      <div>
        {wrappedRow}
        {hasChildren && (
          <div id={toItemId(itemId)}>
            {isExpanded && (
              <Items
                parentData={data}
                depth={depth}
                items={childItems}
                // getItemsData={getChildrenData}
                render={render}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}
