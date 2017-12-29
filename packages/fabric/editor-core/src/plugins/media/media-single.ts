import { Node as PMNode, Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MediaState } from '@atlaskit/media-core';

import { isImage } from '../../utils';
import { insertNodesEndWithNewParagraph } from '../../commands';
import { copyOptionalAttrsFromMediaState } from './media-common';

export interface MediaSingleState extends MediaState {
  thumbnail: {
    src: string;
    height?: number;
    width?: number;
  };
}

function isMediaSingleState(state: MediaState): state is MediaSingleState {
  return !!state.thumbnail;
}

export const insertMediaAsMediaSingle = (
  view: EditorView,
  node: PMNode,
): boolean => {
  const { state, dispatch } = view;
  const { mediaSingle, media } = state.schema.nodes;

  if (!mediaSingle) {
    return false;
  }

  // if not an image type media node
  if (node.type !== media || !isImage(node.attrs.__fileMimeType)) {
    return false;
  }

  const mediaSingleNode = mediaSingle.create({}, node);
  const nodes = [mediaSingleNode];

  return insertNodesEndWithNewParagraph(nodes)(state, dispatch);
};

export const insertMediaSingleNode = (
  view: EditorView,
  mediaState: MediaState,
  collection?: string,
): void => {
  if (!collection || !isMediaSingleState(mediaState)) {
    return;
  }

  const { state, dispatch } = view;
  const node = createMediaSingleNode(state.schema, collection)(mediaState);
  insertNodesEndWithNewParagraph([node])(state, dispatch);
};

export const createMediaSingleNode = (schema: Schema, collection: string) => (
  mediaState: MediaSingleState,
) => {
  const { id, thumbnail } = mediaState;
  const { width, height } = thumbnail;
  const { media, mediaSingle } = schema.nodes;

  const mediaNode = media.create({
    id,
    type: 'file',
    collection,
    width,
    height,
  });

  copyOptionalAttrsFromMediaState(mediaState, mediaNode);
  return mediaSingle.create({}, mediaNode);
};
