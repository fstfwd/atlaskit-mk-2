import createRequest, { CreateRequestFunc } from './util/createRequest';
import { MediaItem } from '../';
import { AuthProvider } from '../auth';

export type DataUri = string;
export type ImageResizeMode = 'crop' | 'fit' | 'full-fit';

export interface FetchImageOptions {
  width: number;
  height: number;
  mode?: ImageResizeMode;
  allowAnimated?: boolean;
}

export interface DataUriService {
  fetchOriginalDataUri(mediaItem: MediaItem): Promise<DataUri>;
  fetchImageDataUri(
    mediaItem: MediaItem,
    widthOrOptions: number | FetchImageOptions,
    heightArg?: number,
    modeArg?: ImageResizeMode,
    allowAnimatedArg?: boolean,
  ): Promise<DataUri>;
}

export class MediaDataUriService implements DataUriService {
  private request: CreateRequestFunc;

  constructor(
    private readonly authProvider: AuthProvider,
    private readonly serviceHost: string,
    private readonly collectionName?: string,
  ) {
    this.request = createRequest({
      config: {
        serviceHost: this.serviceHost,
        authProvider: this.authProvider,
      },
      collectionName: this.collectionName,
    });
  }

  fetchOriginalDataUri(mediaItem: MediaItem): Promise<DataUri> {
    return this.fetchSomeDataUri(`/file/${mediaItem.details.id}/binary`, {
      'max-age': 3600,
      collection: this.collectionName,
    });
  }

  isFetchImageOptions(
    target: number | FetchImageOptions,
  ): target is FetchImageOptions {
    return !!(target as FetchImageOptions).width;
  }

  fetchImageDataUri(
    mediaItem: MediaItem,
    widthOrOptions: number | FetchImageOptions,
    heightArg?: number,
    modeArg?: ImageResizeMode,
    allowAnimatedArg?: boolean,
  ): Promise<DataUri> {
    const { width, height, mode, allowAnimated } = (() => {
      if (this.isFetchImageOptions(widthOrOptions)) {
        return widthOrOptions;
      } else {
        return {
          width: widthOrOptions,
          height: heightArg,
          mode: modeArg,
          allowAnimated: allowAnimatedArg,
        };
      }
    })();

    return this.fetchSomeDataUri(`/file/${mediaItem.details.id}/image`, {
      width,
      height,
      mode: mode || 'crop',
      allowAnimated: allowAnimated === undefined ? true : allowAnimated,
      'max-age': 3600,
      collection: this.collectionName,
    });
  }

  fetchSomeDataUri(url: string, params: Object): Promise<DataUri> {
    return this.request({
      url,
      params,
      responseType: 'image',
    }).then(this.readBlob);
  }

  private readBlob(blob: Blob): Promise<DataUri> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', () => reject(reader.error));

      reader.readAsDataURL(blob);
    });
  }
}
