import * as React from 'react';
import { mount } from 'enzyme';
import Blanket from '@atlaskit/blanket';
import {
  MediaViewer,
  MediaViewerRenderer,
  DataSource,
} from '../../src/newgen/media-viewer';
import { FileViewer } from '../../src/newgen/file-viewer';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

describe('<MediaViewer />', () => {
  it('should close Media Viewer on click', () => {
    const onClose = jest.fn();
    const el = mount(<MediaViewer onClose={onClose} />);
    el.find(Blanket).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  const context = {};

  it.skip('shows only one item', () => {
    const onClose = jest.fn();
    const item = '';
    const el = mount(
      <MediaViewer data={item} context={context} onClose={onClose} />,
    );
  });

  it.skip('shows a list of items with a selected file', () => {
    const onClose = jest.fn();
    const list = ['', ''];
    const selected = '';
    const el = mount(
      <MediaViewer
        data={list}
        selected={selected}
        context={context}
        onClose={onClose}
      />,
    );
  });

  it.skip('shows a list of items without a selected file', () => {
    const onClose = jest.fn();
    const list = ['', ''];
    const selected = '';
    const el = mount(
      <MediaViewer data={list} context={context} onClose={onClose} />,
    );
  });

  it.skip('shows a selected file from a collection', () => {
    const onClose = jest.fn();
    const collection;
    const selected;
    const el = mount(
      <MediaViewer
        data={collection}
        selected={selected}
        context={context}
        onClose={onClose}
      />,
    );
  });

  it.skip('shows a file from a collection without a selection', () => {
    const onClose = jest.fn();
    const collection;
    const el = mount(
      <MediaViewer data={collection} context={context} onClose={onClose} />,
    );
  });

  it.skip(
    'shows an error message if selectedItem is different from provided item',
  );
  it.skip('shows an error message if selectedItem can not be found in list');
  it.skip(
    'shows an error message if selectedItem can not be found in collection',
  );
});

describe('<MediaViewerRenderer />', () => {
  it('renders a viewer for a list with one fileDetails object', () => {
    const fileDetails = { mediaType: 'doc' };
    const dataSource: DataSource = Observable.of([fileDetails]);
    const el = mount(
      <MediaViewerRenderer dataSource={dataSource} />
    );
    expect(el.find(FileViewer)).toHaveLength(1);
  });

  it.skip('updates when next is emitted');
  it.skip('handles errors correctly');
  it.skip('unsubscribes when completed?');
  it.skip('resubscribes when componentDidChange');
  it.skip('renders an error when there are no iems');
  it.skip('renders one of many items');
});
