import * as React from 'react';
import Blanket from '@atlaskit/blanket';
import { Context, MediaType, MediaItem, FileItem } from '@atlaskit/media-core';
import * as deepEqual from 'deep-equal';
import { MediaViewerRenderer } from './media-viewer-renderer';
import { Model, Identifier, initialModel, ObjectUrl } from './domain';
import { addAuthTokenToUrl } from './util';

export type Props = {
  onClose?: () => void;
  context: Context;
  data: Identifier;
};

export type State = Model;

export class MediaViewer extends React.Component<Props, State> {
  state: State = initialModel;

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
  componentWillUpdate(nextProps) {
    if (this.needsReset(this.props, nextProps)) {
      this.setState(initialModel);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.needsReset(this.props, prevProps)) {
      this.unsubscribe();
      this.subscribe();
    }
  }

  render() {
    const { onClose } = this.props;
    return (
      <div>
        <Blanket onBlanketClicked={onClose} isTinted />
        <MediaViewerRenderer model={this.state} />
      </div>
    );
  }

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
  private needsReset(propsA, propsB) {
    return (
      !deepEqual(propsA.data, propsB.data) || propsA.context !== propsB.context
    );
  }

  private subscription?: any;

  private subscribe() {
    const { context } = this.props;
    const { id, type, collectionName } = this.props.data;
    const provider = context.getMediaItemProvider(id, type, collectionName);

    this.subscription = provider.observable().subscribe({
      next: async mediaItem => {
        if (mediaItem.type === 'link') {
          this.setState({
            fileDetails: {
              status: 'FAILED',
              err: new Error('links are not supported at the moment'),
            }
          });
        } else {
          const { processingStatus, mediaType } = mediaItem.details;

          if (processingStatus === 'failed') {
            this.setState({
              fileDetails: {
                status: 'FAILED',
                err: new Error('processing failed'),
              }
             });
          } else if (processingStatus === 'succeeded') {
            this.setState({
              fileDetails: {
                status: 'SUCCESSFUL',
                data: {
                  mediaType: mediaType as MediaType,
                },
              }
            });

            switch (mediaItem.details.mediaType) {
              case 'image':
                return await handleImageEvent(mediaItem, context, this.setState.bind(this));
              case 'video':
                return await handleVideoEvent(mediaItem, context, this.setState.bind(this), collectionName);
              default:
                throw new Error('not implemented');
            }
          }
        }
      },
      complete: () => {
        /* do nothing */
      },
      error: err => {
        this.setState({
          fileDetails: {
            status: 'FAILED',
            err
          }
        });
      },
    });
  }

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}

async function handleVideoEvent(fileItem: FileItem, context: Context, setState: (args: Object) => void, collectionName?: string) {
  const videoArtifactUrl = getVideoArtifactUrl(fileItem, true); // HD for now.
  if (videoArtifactUrl) {
    const objectUrl = await addAuthTokenToUrl(videoArtifactUrl, context, collectionName);
    setState({
      previewData: {
        status: 'SUCCESSFUL',
        data: {
          viewer: 'VIDEO',
          objectUrl
        }
      }
    });
  } else {
    setState({
      previewData: {
        status: 'FAILED',
        err: new Error('no video artifacts found for this file')
      }
    });
  }
}

function getVideoArtifactUrl(fileItem: FileItem, hd: boolean) {
  const artifact = hd ? 'video_640.mp4' : 'video_1280.mp4';
  return fileItem.details
    && fileItem.details.artifacts
    && fileItem.details.artifacts[artifact]
    && fileItem.details.artifacts[artifact].url;
}

async function handleImageEvent(fileItem: MediaItem, context: Context, setState: (args: Object) => void) {
  try {
    // TODO:
    // - 1) MSW-530: revoke object URL
    // - 2) MSW-531: make sure we don't set a new state if the component is unmounted.
    const objectUrl = await getImageObjectUrl(fileItem, context, 800, 600);
    setState({
      previewData: {
        status: 'SUCCESSFUL',
        data: {
          viewer: 'IMAGE',
          objectUrl,
        }
      }
    });
  } catch (err) {
    setState({
      previewData: {
        status: 'FAILED',
        err
      }
    });
  }
}

async function getImageObjectUrl(
  mediaItem: MediaItem,
  context: Context,
  width,
  height
): Promise<ObjectUrl> {
  const service = context.getBlobService();
  const blob = await service.fetchImageBlob(mediaItem, {
    width,
    height,
    mode: 'fit',
    allowAnimated: true,
  });
  return URL.createObjectURL(blob);
}
