import * as React from 'react';
import { ImagePreview, Outcome } from '../domain';
import { Img, ErrorMessage } from '../styled';
import { Spinner } from '../loading';
import { Context, FileItem } from '@atlaskit/media-core';

export type Props = {
  previewData: ImagePreview;
};

export const ImageViewer: React.StatelessComponent<Props> = ({
  previewData,
}) => {
  return <Img src={previewData.objectUrl} />;
};

export type ObjectUrl = string;

export const REQUEST_CANCELLED = 'request_cancelled';

export type ImageViewerProps = {
  context: Context;
  item: FileItem;
};

export type ImageViewerState = {
  objectUrl: Outcome<ObjectUrl, Error>;
};

export class ImageViewer2 extends React.Component<
  ImageViewerProps,
  ImageViewerState
> {
  state: ImageViewerState = {
    objectUrl: { status: 'PENDING' },
  };

  componentDidMount() {
    this.populateImagePreviewData(this.props.item, this.props.context);
  }

  componentWillUnmount() {
    this.release();
  }

  // TODO rerender on prop change, e.g. context?

  render() {
    const { objectUrl } = this.state;
    switch (objectUrl.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        return <Img src={objectUrl.data} />;
      case 'FAILED':
        return <ErrorMessage>{objectUrl.err.message}</ErrorMessage>;
    }
  }

  private cancelImageFetch?: () => void;

  // This method is spied on by some test cases, so don't rename or remove it.
  public preventRaceCondition() {
    // Calling setState might introduce a race condition, because the app has
    // already transitioned to a different state. To avoid this we're not doing
    // anything.
  }

  private async populateImagePreviewData(fileItem: FileItem, context: Context) {
    try {
      const service = context.getBlobService();
      const { response, cancel } = service.fetchImageBlobCancelable(fileItem, {
        width: 800,
        height: 600,
        mode: 'fit',
        allowAnimated: true,
      });
      this.cancelImageFetch = () => cancel(REQUEST_CANCELLED);
      const objectUrl = URL.createObjectURL(await response);
      this.setState({
        objectUrl: {
          status: 'SUCCESSFUL',
          data: objectUrl,
        },
      });
    } catch (err) {
      if (err.message === REQUEST_CANCELLED) {
        this.preventRaceCondition();
      } else {
        this.setState({
          objectUrl: {
            status: 'FAILED',
            err,
          },
        });
      }
    }
  }

  private release() {
    if (this.cancelImageFetch) {
      this.cancelImageFetch();
    }
    const { objectUrl } = this.state;

    if (objectUrl.status === 'SUCCESSFUL') {
      this.revokeObjectUrl(objectUrl.data);
    }
  }

  // This method is spied on by some test cases, so don't rename or remove it.
  public revokeObjectUrl(objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }
}
