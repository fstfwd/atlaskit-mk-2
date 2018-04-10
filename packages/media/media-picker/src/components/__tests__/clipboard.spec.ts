import { AuthProvider } from '@atlaskit/media-core';
import { MediaPickerContext } from '../../domain/context';
import { UserEvent } from '../../outer/analytics/events';

import { ModuleConfig, UploadParams } from '../../domain/config';
import { MockClipboardEvent, MockFile } from '../../util/clipboardEventMocks';
import { Clipboard } from '../clipboard';
import { UploadService } from '../../service/uploadService';

jest.mock('../../service/uploadService');

class MockContext implements MediaPickerContext {
  trackEvent(event: UserEvent) {}
}

class MockConfig implements ModuleConfig {
  apiUrl: string;
  authProvider: AuthProvider;
  uploadParams?: UploadParams;
}

describe('Clipboard', () => {
  let clipboard: Clipboard;
  let addFiles: any;

  beforeEach(done => {
    clipboard = new Clipboard(new MockContext(), new MockConfig());
    clipboard.activate();
    document.dispatchEvent(new Event('DOMContentLoaded'));

    addFiles = jest.fn();
    ((clipboard as any).uploadService as UploadService).addFiles = addFiles;

    // necessary for `domready` library
    setTimeout(done, 0);
  });

  afterEach(() => {
    clipboard.deactivate();
  });

  it('should not call this.uploadService.addFile() when a paste event is dispatched without files', () => {
    document.dispatchEvent(new MockClipboardEvent('paste'));
    expect(addFiles).toHaveBeenCalledTimes(0);
  });

  it('should call this.uploadService.addFile() when a paste event is dispatched with a single file', () => {
    document.dispatchEvent(new MockClipboardEvent('paste', [new MockFile()]));
    expect(addFiles).toHaveBeenCalledTimes(1);
  });

  it('should call this.uploadService.addFile() when a paste event is dispatched with multiple files', () => {
    document.dispatchEvent(
      new MockClipboardEvent('paste', [new MockFile(), new MockFile()]),
    );
    expect(addFiles).toHaveBeenCalledTimes(2);
  });

  it('should not call this.uploadService.addFile() when deactivated and a paste event is dispatched a single file', () => {
    clipboard.deactivate();
    document.dispatchEvent(new MockClipboardEvent('paste', [new MockFile()]));
    expect(addFiles).toHaveBeenCalledTimes(0);
  });
});
