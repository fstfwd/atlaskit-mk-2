import * as React from 'react';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { mediaSingle, media } from '@atlaskit/editor-test-helpers';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../../../src/plugins/media';
import MediaSingle from '../../../src/nodeviews/ui/media-single';
interface MediaProps {
  node: PMNode;
}

class Media extends React.Component<MediaProps, {}> {
  render() {
    return null;
  }
}

describe('nodeviews/mediaSingle', () => {
  let pluginState;
  const mediaNode = media({
    id: 'foo',
    type: 'file',
    collection: 'collection',
  });

  beforeEach(() => {
    pluginState = {} as MediaPluginState;
    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
  });

  it('sets child to isMediaSingle to be true', () => {
    const view = {} as EditorView;
    const mediaSingleNode = mediaSingle({ layout: 'wrap-right' })(mediaNode);

    const wrapper = mount(
      <MediaSingle view={view} node={mediaSingleNode}>
        <Media node={mediaNode} />
      </MediaSingle>,
    );

    const child = wrapper.childAt(0);
    expect(child && child.props().isMediaSingle).toBe(true);
  });

  it('notifies plugin if node layout is updated', () => {
    const view = {} as EditorView;
    const mediaSingleNode = mediaSingle({ layout: 'wrap-right' })();
    const updatedMediaSingleNode = mediaSingle({ layout: 'center' })();

    const updateLayoutSpy = jest.fn();
    pluginState.updateLayout = updateLayoutSpy;

    const wrapper = mount(
      <MediaSingle view={view} node={mediaSingleNode}>
        <Media node={mediaNode} />
      </MediaSingle>,
    );

    wrapper.setProps({ node: updatedMediaSingleNode });

    expect(updateLayoutSpy).toHaveBeenCalledWith('center');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
