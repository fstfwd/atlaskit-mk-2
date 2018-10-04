import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { Filmstrip } from '@atlaskit/media-filmstrip';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../pm-plugins/main';
import { FileIdentifier } from '@atlaskit/media-card';
import { setNodeSelection } from '../../../utils/index';
import WithPluginState from '../../../ui/WithPluginState';
import { stateKey as reactNodeViewStateKey } from '../../../plugins/base/pm-plugins/react-nodeview';

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

export type MediaGroupProps = {
  forwardRef: (ref: HTMLElement) => void;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  selected: number | null;
};

class MediaGroup extends React.Component<MediaGroupProps> {
  private mediaPluginState: MediaPluginState;

  state = {
    selected: null,
  };

  constructor(props) {
    super(props);
    this.mediaPluginState = mediaStateKey.getState(props.view.state);
  }

  renderChildNodes = node => {
    const tempIds = [] as any;
    node.forEach((item, childOffset) => {
      tempIds.push(item.attrs.__key);
      console.log(tempIds, item.attrs.__fileName);
    });

    const items = tempIds.map((id, idx) => {
      const identifier: FileIdentifier = {
        id: this.mediaPluginState.stateManager.getState(id)!.fileId,
        mediaItemType: 'file',
      };
      return {
        filename: this.mediaPluginState.stateManager.getState(id)!.fileName,
        identifier,
        selectable: true,
        selected: this.props.selected === this.props.getPos() + idx + 1,
        onClick: (e, x) => {
          console.log('clicked ', this.props.getPos() + idx + 1);
          setNodeSelection(this.props.view, this.props.getPos() + idx + 1);
        },
      };
    });
    console.log('new items are ', items);
    return (
      <Filmstrip items={items} context={this.mediaPluginState.mediaContext} />
    );
  };

  render() {
    return <>{this.renderChildNodes(this.props.node)}</>;
  }
}

class MediaGroupNodeView extends ReactNodeView {
  render(props, forwardRef) {
    return (
      <WithPluginState
        editorView={this.view}
        plugins={{
          reactNodeViewState: reactNodeViewStateKey,
        }}
        render={({ reactNodeViewState }) => {
          const nodePos = this.getPos();
          const { $anchor, $head } = this.view.state.selection;
          const isSelected =
            nodePos < $anchor.pos && $head.pos < nodePos + this.node.nodeSize;
          return (
            <MediaGroup
              node={this.node}
              getPos={this.getPos}
              view={this.view}
              forwardRef={forwardRef}
              selected={isSelected ? $anchor.pos : null}
            />
          );
        }}
      />
    );
  }
}

export const ReactMediaGroupNode = (portalProviderAPI: PortalProviderAPI) => (
  node: any,
  view: any,
  getPos: () => number,
): NodeView => {
  return new MediaGroupNodeView(node, view, getPos, portalProviderAPI).init();
};
