import * as React from 'react';
import { Rectangle, Vector2, Bounds } from '../camera';
import { Container } from './container';
import { Image } from './image';
import { Margin } from './margin';
import { ImagePlacerWrapper } from './styled';
import { dataURItoFile } from '../util';

const isNum = (value: any): boolean => typeof value === 'number';
const isBool = (value: any): boolean => typeof value === 'boolean';
const isStr = (value: any): boolean => typeof value === 'string';

export interface ImagePlacerProps {
  containerWidth: number;
  containerHeight: number;
  imageWidth?: number;
  imageHeight?: number;
  src?: string;
  margin: number;
  zoom: number;
  maxZoom: number;
  useConstraints: boolean;
  circular: boolean;
  backgroundColor: string;
  onZoomChange?: (zoom: number) => void;
  onExport?: (api: ImagePlacerAPI) => void;
}

const defaultProps: Partial<ImagePlacerProps> = {
  containerWidth: 200,
  containerHeight: 200,
  margin: 28,
  maxZoom: 2,
  zoom: 0,
  useConstraints: false,
  circular: false,
  imageWidth: 0,
  imageHeight: 0,
  backgroundColor: 'transparent',
};

export interface ImagePlacerAPI {
  toCanvas: () => HTMLCanvasElement;
  toDataURI: () => string;
  toFile: () => File;
}

export interface ImagePlacerState {
  imageWidth: number; // changes with zoom, this.imageRect for original src rect
  imageHeight: number; // changes with zoom, this.imageRect for original src rect
  originX: number;
  originY: number;
  zoom: number;
  errorMessage?: string;
  dragOrigin?: Vector2;
}

export class ImagePlacer extends React.Component<
  ImagePlacerProps,
  ImagePlacerState
> {
  imageRect: Rectangle = new Rectangle(0, 0); // the natural size of the image, without zoom scaling
  imageElement?: HTMLImageElement;

  state: ImagePlacerState = {
    originX: 0,
    originY: 0,
    imageWidth: 0,
    imageHeight: 0,
    zoom: this.props.zoom,
  };

  static defaultProps = defaultProps;

  private get imageBounds(): Bounds {
    const { margin, maxZoom } = this.props;
    const { originX, originY, imageWidth, imageHeight, zoom } = this.state;
    const x = margin + originX;
    const y = margin + originY;
    const maxWidthDiff = imageWidth * maxZoom - imageWidth;
    const maxHeightDiff = imageHeight * maxZoom - imageHeight;
    const width = imageWidth + maxWidthDiff * zoom;
    const height = imageHeight + maxHeightDiff * zoom;
    return new Bounds(x, y, width, height);
  }

  private get visibleBounds(): Bounds {
    const { containerWidth, containerHeight, margin } = this.props;
    return new Bounds(margin, margin, containerWidth, containerHeight);
  }

  private get sourceRect(): Bounds {
    const { containerWidth, containerHeight } = this.props;
    const { x: originX, y: originY } = this.mapCoords(0, 0);
    const { x: cornerX, y: cornerY } = this.mapCoords(
      containerWidth,
      containerHeight,
    );
    return new Bounds(originX, originY, cornerX - originX, cornerY - originY);
  }

  UNSAFE_componentWillReceiveProps(nextProps: ImagePlacerProps) {
    const { zoom } = this.state;
    if (isNum(nextProps.zoom) && nextProps.zoom !== zoom) {
      this.setZoom(nextProps.zoom);
    }
    if (
      isBool(nextProps.useConstraints) &&
      nextProps.useConstraints !== this.props.useConstraints
    ) {
      this.reset();
    }
    if (
      isNum(nextProps.containerWidth) &&
      nextProps.containerWidth != this.props.containerWidth
    ) {
      this.reset();
    }
    if (
      isNum(nextProps.containerHeight) &&
      nextProps.containerHeight != this.props.containerHeight
    ) {
      this.reset();
    }
    if (isNum(nextProps.margin) && nextProps.margin != this.props.margin) {
      this.setState({ zoom: 0 }, () => this.zoomToFit());
      if (this.props.onZoomChange) {
        this.props.onZoomChange(0);
      }
    }
    if (isStr(nextProps.src) && nextProps.src != this.props.src) {
      this.setState({ zoom: 0 }, () => this.reset());
      if (this.props.onZoomChange) {
        this.props.onZoomChange(0);
      }
    }
  }

  private reset() {
    const { imageRect } = this;
    this.setState(
      {
        imageWidth: imageRect.width,
        imageHeight: imageRect.height,
        zoom: 0,
        originX: 0,
        originY: 0,
      },
      () => this.zoomToFit(),
    );
  }

  private zoomToFit() {
    const { useConstraints } = this.props;
    const { imageWidth, imageHeight } = this.state;
    if (!useConstraints || imageWidth === 0 || imageHeight === 0) {
      return;
    }
    const itemRect = new Rectangle(imageWidth, imageHeight);
    const visibleBounds = this.visibleBounds;
    const scaleFactor = itemRect.scaleToFitSmallestSide(visibleBounds);
    const newItemRect = itemRect.scaled(scaleFactor);
    this.setState(
      {
        imageWidth: newItemRect.width,
        imageHeight: newItemRect.height,
        originX: 0,
        originY: 0,
      },
      () => this.applyConstraints(),
    );
  }

  private applyConstraints() {
    const { useConstraints } = this.props;
    const { originX: currentOriginX, originY: currentOriginY } = this.state;
    const { visibleBounds, imageBounds } = this;

    let originX = currentOriginX;
    let originY = currentOriginY;

    if (useConstraints) {
      const deltaLeft = visibleBounds.left - imageBounds.left;
      const deltaTop = visibleBounds.top - imageBounds.top;
      const deltaBottom = visibleBounds.bottom - imageBounds.bottom;
      const deltaRight = visibleBounds.right - imageBounds.right;

      if (
        imageBounds.right > visibleBounds.right &&
        imageBounds.left > visibleBounds.left
      ) {
        originX += deltaLeft;
      }
      if (
        imageBounds.bottom > visibleBounds.bottom &&
        imageBounds.top > visibleBounds.top
      ) {
        originY += deltaTop;
      }
      if (
        imageBounds.top < visibleBounds.top &&
        imageBounds.bottom < visibleBounds.bottom
      ) {
        originY += deltaBottom;
      }
      if (
        imageBounds.left < visibleBounds.left &&
        imageBounds.right < visibleBounds.right
      ) {
        originX += deltaRight;
      }
    } else {
      const deltaTop = visibleBounds.top - imageBounds.bottom;
      const deltaBottom = visibleBounds.bottom - imageBounds.top;
      const deltaLeft = visibleBounds.left - imageBounds.right;
      const deltaRight = visibleBounds.right - imageBounds.left;

      if (imageBounds.bottom < visibleBounds.top) {
        originY += deltaTop;
      }
      if (imageBounds.top > visibleBounds.bottom) {
        originY += deltaBottom;
      }
      if (imageBounds.right < visibleBounds.left) {
        originX += deltaLeft;
      }
      if (imageBounds.left > visibleBounds.right) {
        originX += deltaRight;
      }
    }

    this.setState({
      originX,
      originY,
    });
  }

  private setZoom(newZoom: number) {
    const { originX, originY } = this.state;
    const lastItemBounds = this.imageBounds;
    this.state.zoom = newZoom;
    const imageBounds = this.imageBounds;
    const delta = lastItemBounds.center.sub(imageBounds.center);
    const origin = new Vector2(originX + delta.x, originY + delta.y);
    this.setState(
      {
        zoom: newZoom,
        originX: origin.x,
        originY: origin.y,
      },
      () => this.applyConstraints(),
    );
  }

  mapCoords(xGlobal: number, yGlobal: number): Vector2 {
    const { imageRect, visibleBounds, imageBounds } = this;
    const offset = visibleBounds.origin.sub(imageBounds.origin);
    const rect = imageBounds.rect;
    const px = (offset.x + xGlobal) / rect.width;
    const py = (offset.y + yGlobal) / rect.height;
    return new Vector2(imageRect.width * px, imageRect.height * py).rounded();
  }

  toCanvas(): HTMLCanvasElement {
    const {
      containerWidth,
      containerHeight,
      backgroundColor,
      useConstraints,
      circular,
    } = this.props;
    const { imageElement } = this;

    const canvas = document.createElement('canvas');
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    const context = canvas.getContext('2d');

    if (context) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, containerWidth, containerHeight);

      if (imageElement) {
        if (circular) {
          context.beginPath();
          context.arc(
            containerWidth * 0.5,
            containerHeight * 0.5,
            Math.max(containerWidth, containerHeight) * 0.5,
            0,
            Math.PI * 2,
            true,
          );
          context.clip();
        }

        if (useConstraints) {
          const { sourceRect } = this;

          context.drawImage(
            imageElement,
            sourceRect.left,
            sourceRect.top,
            sourceRect.width,
            sourceRect.height,
            0,
            0,
            containerWidth,
            containerHeight,
          );
        } else {
          const { visibleBounds, imageBounds } = this;
          const { naturalWidth, naturalHeight } = imageElement;
          const { left, top, width, height } = imageBounds.relativeTo(
            visibleBounds,
          );

          context.drawImage(
            imageElement,
            0,
            0,
            naturalWidth,
            naturalHeight,
            left,
            top,
            width,
            height,
          );
        }
      }
    }
    return canvas;
  }

  toDataURI(): string {
    const canvas = this.toCanvas();
    return canvas.toDataURL();
  }

  toFile(): File {
    const dataURI = this.toDataURI();
    return dataURItoFile(dataURI);
  }

  onDragStart = () => {
    const { originX, originY } = this.state;
    this.setState({
      dragOrigin: new Vector2(originX, originY),
    });
  };

  onImageLoad = (
    imageElement: HTMLImageElement,
    width: number,
    height: number,
  ) => {
    this.imageRect = new Rectangle(width, height);
    this.imageElement = imageElement;
    this.setState({ imageWidth: width, imageHeight: height }, () =>
      this.zoomToFit(),
    );
    if (this.props.onExport) {
      this.props.onExport({
        toCanvas: () => this.toCanvas(),
        toDataURI: () => this.toDataURI(),
        toFile: () => this.toFile(),
      });
    }
  };

  onImageError = () => {
    this.setState({ errorMessage: 'An error occurred!' });
  };

  onDragMove = (delta: Vector2) => {
    const { dragOrigin } = this.state;
    if (dragOrigin) {
      let newOriginX = dragOrigin.x + delta.x;
      let newOriginY = dragOrigin.y + delta.y;
      this.setState(
        {
          originX: newOriginX,
          originY: newOriginY,
        },
        () => this.applyConstraints(),
      );
    }
  };

  onWheel = (delta: number) => {
    const { zoom } = this.state;
    const rawZoom = zoom + delta / 100;
    const clampedZoom = Math.min(Math.max(0, rawZoom), 1);
    this.setZoom(clampedZoom);
    if (this.props.onZoomChange) {
      this.props.onZoomChange(clampedZoom);
    }
  };

  render() {
    const {
      backgroundColor,
      containerWidth,
      containerHeight,
      src,
      margin,
      circular,
    } = this.props;
    const { errorMessage } = this.state;
    const { imageBounds } = this;

    return (
      <ImagePlacerWrapper backgroundColor={backgroundColor}>
        {errorMessage ? (
          errorMessage
        ) : (
          <Container
            width={containerWidth}
            height={containerHeight}
            margin={margin}
            onDragStart={this.onDragStart}
            onDragMove={this.onDragMove}
            onWheel={this.onWheel}
          >
            <Image
              src={src}
              x={imageBounds.x}
              y={imageBounds.y}
              width={imageBounds.width}
              height={imageBounds.height}
              onLoad={this.onImageLoad}
              onError={this.onImageError}
            />
            <Margin
              width={containerWidth}
              height={containerHeight}
              circular={circular}
              size={margin}
            />
          </Container>
        )}
      </ImagePlacerWrapper>
    );
  }
}