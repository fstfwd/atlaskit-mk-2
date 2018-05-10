import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import Slider from 'react-rangeslider';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Cell } from '../pm-plugins/contextual-menu-plugin';
import { pluginKey } from '../pm-plugins/contextual-menu-plugin';

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
  providerFactory: ProviderFactory;
}

export interface State {
  value: number;
  cell?: Cell;
}

export default class SliderNode extends React.PureComponent<Props, State> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: props.node.attrs.value,
      cell: undefined,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { node } = nextProps;
    if (node.attrs.value !== this.state.value) {
      this.setState({
        value: node.attrs.value,
      });
    }
  }

  handleChangeStart = () => {
    // console.log('Change event started')
  };

  handleChange = value => {
    this.setState({
      value: Number(value.toFixed(1)),
    });
  };

  handleChangeComplete = () => {
    const { state, dispatch } = this.props.view;
    const { node } = this.props;
    const { clickedCell: cell } = pluginKey.getState(state);
    if (!cell) {
      return;
    }

    dispatch(
      state.tr.setNodeMarkup(
        cell.pos + 1,
        node.type,
        Object.assign({}, node.attrs, {
          value: this.state.value,
        }),
      ),
    );
  };

  render() {
    const { value } = this.state;

    return (
      <div
        data-value={value}
        className={`slider ${value < 0.7 ? 'danger' : ''}`}
      >
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={value}
          onChangeStart={this.handleChangeStart}
          onChange={this.handleChange}
          onChangeComplete={this.handleChangeComplete}
        />
      </div>
    );
  }
}
