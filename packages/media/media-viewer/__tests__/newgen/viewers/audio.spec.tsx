import * as util from '../../../src/newgen/util';
const constructAuthTokenUrlSpy = jest.spyOn(util, 'constructAuthTokenUrl');

import * as React from 'react';
import { mount } from 'enzyme';
import { Stubs } from '../../_stubs';
import { Subject } from 'rxjs/Subject';
import { FileItem, Auth } from '@atlaskit/media-core';
import { awaitError } from '@atlaskit/media-test-helpers';
import { AudioViewer } from '../../../src/newgen/viewers/audio';
import Spinner from '@atlaskit/spinner';
import {
  ErrorMessage,
  DefaultCoverWrapper,
  AudioCover,
} from '../../../src/newgen/styled';

const token = 'some-token';
const clientId = 'some-client-id';

const audioItem: FileItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'audio',
    artifacts: {
      'audio.mp3': {
        url: '/audio',
      },
    },
  },
};

function createContext(authPromise: Promise<Auth>) {
  const serviceHost = 'some-service-host';
  const authProvider = jest.fn().mockReturnValue(authPromise);
  const contextConfig = {
    serviceHost,
    authProvider,
  };
  return Stubs.context(
    contextConfig,
    undefined,
    Stubs.mediaItemProvider(new Subject<FileItem>()),
  ) as any;
}

function createFixture(authPromise: Promise<Auth>, collectionName?: string) {
  const context = createContext(authPromise);
  const el = mount(
    <AudioViewer
      context={context}
      item={audioItem}
      collectionName={collectionName}
      previewCount={0}
    />,
  );
  return { context, el };
}

describe('Audio viewer', () => {
  afterEach(() => {
    constructAuthTokenUrlSpy.mockClear();
  });

  it('assigns a src for audio files when successful', async () => {
    const authPromise = Promise.resolve({ token, clientId });
    const { el } = createFixture(authPromise);
    await (el as any).instance()['init']();
    el.update();
    expect(el.find('audio').prop('src')).toEqual(
      'some-service-host/audio?client=some-client-id&token=some-token',
    );
  });

  it('shows spinner when pending', async () => {
    const authPromise: any = new Promise(() => {});
    const { el } = createFixture(authPromise);
    el.update();
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows error if there is an error', async () => {
    const authPromise = Promise.reject(new Error('test error'));
    const { el } = createFixture(authPromise);
    await awaitError(authPromise, 'test error');
    el.update();
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  describe('cover', () => {
    it('it should show the default cover while the audio cover is loading', async () => {
      const authPromise = Promise.resolve({ token, clientId });
      const { el } = createFixture(authPromise);
      await (el as any).instance()['init']();
      el.update();
      expect(el.find(DefaultCoverWrapper)).toHaveLength(1);
    });

    it('it should show the default cover when the audio cover is errored', async () => {
      const authPromise = Promise.resolve({ token, clientId });
      const { el } = createFixture(authPromise);
      const instance: any = el.instance();

      instance['loadCover'] = () => Promise.reject('no cover found');
      await instance['init']();
      el.update();
      expect(el.find(DefaultCoverWrapper)).toHaveLength(1);
    });

    it('it should show the audio cover if exists', async () => {
      const authPromise = Promise.resolve({ token, clientId });
      const { el } = createFixture(authPromise);
      const instance: any = el.instance();
      const promiseSrc = Promise.resolve('cover-src');

      instance['loadCover'] = () => promiseSrc;
      await instance['init']();
      await promiseSrc;
      el.update();

      expect(el.find(DefaultCoverWrapper)).toHaveLength(0);
      expect(el.find(AudioCover).prop('src')).toEqual(
        'some-service-host/file/some-id/image?client=some-client-id&token=some-token',
      );
    });

    it('MSW-720: pass the collectionName to calls to constructAuthTokenUrl', async () => {
      const collectionName = 'collectionName';
      const authPromise = Promise.resolve({ token, clientId });
      const { el } = createFixture(authPromise, collectionName);
      const instance: any = el.instance();
      const promiseSrc = Promise.resolve('cover-src');

      instance['loadCover'] = () => promiseSrc;
      await instance['init']();
      await promiseSrc;
      el.update();

      expect(constructAuthTokenUrlSpy.mock.calls[0][2]).toEqual(collectionName);
      expect(constructAuthTokenUrlSpy.mock.calls[1][2]).toEqual(collectionName);
    });

    describe('AutoPlay', () => {
      async function createAutoPlayFixture(previewCount: number) {
        const authPromise = Promise.resolve({ token, clientId });
        const context = createContext(authPromise);
        const el = mount(
          <AudioViewer
            context={context}
            item={audioItem}
            collectionName="collectionName"
            previewCount={previewCount}
          />,
        );
        const instance: any = el.instance();
        await instance['init']();
        el.update();
        return el;
      }

      it('should auto play when it is the first preview', async () => {
        const el = await createAutoPlayFixture(0);
        expect(el.find({ autoPlay: true })).toHaveLength(2);
      });

      it('should not auto play when it is not the first preview', async () => {
        const el = await createAutoPlayFixture(1);
        expect(el.find({ autoPlay: true })).toHaveLength(0);
      });
    });
  });
});
