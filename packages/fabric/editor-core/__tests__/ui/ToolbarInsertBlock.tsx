import { mount } from 'enzyme';
import * as React from 'react';
import blockTypePlugins from '../../src/plugins/block-type';
import tablePlugins from '../../src/plugins/table';
import tableCommands from '../../src/plugins/table/commands';
import mediaPlugins from '../../src/plugins/media';
import mentionsPlugins from '../../src/plugins/mentions';
import DropdownMenu from '../../src/ui/DropdownMenu';
import ToolbarInsertBlock from '../../src/ui/ToolbarInsertBlock';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji';
import { testData as emojiTestData } from '@atlaskit/emoji/dist/es5/support';
import Item from '@atlaskit/item';
import {
  doc,
  p,
  makeEditor,
  code_block,
  defaultSchema,
} from '@atlaskit/editor-test-helpers';
import ToolbarButton from '../../src/ui/ToolbarButton';
import { MediaProvider } from '@atlaskit/media-core';
import ProviderFactory from '../../src/providerFactory';
import { analyticsService } from '../../src/analytics';
import EditorWidth from '../../src/utils/editor-width';

const emojiProvider = emojiTestData.getEmojiResourcePromise();

const mediaProvider: Promise<MediaProvider> = Promise.resolve({
  viewContext: Promise.resolve({} as any),
  uploadContext: Promise.resolve({} as any),
});

const providerFactory = new ProviderFactory();
providerFactory.setProvider('mediaProvider', mediaProvider);

describe('@atlaskit/editor-core/ui/ToolbarInsertBlock', () => {
  const blockTypePluginsSet = blockTypePlugins(defaultSchema);
  const tablePluginsSet = tablePlugins();
  const mediaPluginsSet = mediaPlugins(defaultSchema, { providerFactory });
  const mentionsPluginsSet = mentionsPlugins(
    defaultSchema,
    new ProviderFactory(),
  );
  const editor = (doc: any) =>
    makeEditor({
      doc,
      plugins: [
        ...blockTypePluginsSet,
        ...tablePluginsSet,
        ...mediaPluginsSet,
        ...mentionsPluginsSet,
      ],
    });
  let trackEvent;
  beforeEach(() => {
    trackEvent = jest.fn();
    analyticsService.trackEvent = trackEvent;
  });

  it('should render disabled ToolbarButtons if isDisabled property is true', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        tableSupported={true}
        tableHidden={false}
        editorView={editorView}
        availableWrapperBlockTypes={
          blockTypePluginsSet[0].getState(editorView.state)
            .availableWrapperBlockTypes
        }
        isDisabled={true}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
    toolbarOption.unmount();
  });

  it('should return null if none of the plugins are present', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(<ToolbarInsertBlock editorView={editorView} />);
    expect(toolbarOption.html()).toEqual(null);
    toolbarOption.unmount();
  });

  // Following test case is breaking due to trouble in @atlaskit/downdown.
  // isDisabled is always set to false.
  it.skip('should disable mention option if mentionsEnabled is false', () => {
    const { editorView } = editor(
      doc(code_block({ language: 'js' })('te{<>}xt')),
    );
    const toolbarOption = mount(
      <ToolbarInsertBlock
        mentionsSupported={true}
        mentionsEnabled={false}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint5 - 1}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    const mentionButton = toolbarOption
      .find('Item')
      .filterWhere(n => n.html().indexOf('Mention') >= 0);
    expect(mentionButton.prop('isDisabled')).toEqual(true);
    toolbarOption.unmount();
  });

  it('should close emoji picker when dropdown is toggled', () => {
    const { editorView } = editor(doc(p()));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        emojiDisabled={false}
        emojiProvider={emojiProvider}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint5 - 1}
      />,
    );
    toolbarOption.setState({ emojiPickerOpen: true });
    toolbarOption.find(ToolbarButton).simulate('click');
    expect(toolbarOption.state('emojiPickerOpen')).toEqual(false);
    toolbarOption.unmount();
  });

  it('should open emoji picker when emoji option is clicked', () => {
    const { editorView } = editor(doc(p()));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        emojiDisabled={false}
        emojiProvider={emojiProvider}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint4 - 1}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    const mediaButton = toolbarOption
      .find('Item')
      .filterWhere(n => n.html().indexOf('Emoji') >= 0);
    mediaButton.simulate('click');
    expect(toolbarOption.state('emojiPickerOpen')).toEqual(true);
    toolbarOption.unmount();
  });

  it('should have emoji picker component when emojiPickerOpen is true', () => {
    const { editorView } = editor(doc(p()));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        emojiDisabled={false}
        emojiProvider={emojiProvider}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint5 - 1}
      />,
    );
    toolbarOption.setState({ emojiPickerOpen: true });
    expect(toolbarOption.find(AkEmojiPicker).length).toEqual(1);
    toolbarOption.unmount();
  });

  it('should have 1 child elements if mediaSupported and mediaUploadsEnabled is defined and equals true', async () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        mediaSupported={true}
        mediaUploadsEnabled={true}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint6 - 1}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).length).toEqual(1);
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to none if editorWidth is not defined', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginStateBlockType = blockTypePluginsSet[0].getState(
      editorView.state,
    );
    const toolbarOption = mount(
      <ToolbarInsertBlock
        editorView={editorView}
        availableWrapperBlockTypes={
          pluginStateBlockType.availableWrapperBlockTypes
        }
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual('none');
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to none if editorWidth is less then BreakPoint10', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        mediaSupported={true}
        mediaUploadsEnabled={true}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint10 - 1}
      />,
    );
    expect(
      toolbarOption
        .find(ToolbarButton)
        .first()
        .prop('spacing'),
    ).toEqual('none');
    toolbarOption.unmount();
  });

  it('should call onShowMediaPicker when media option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const spy = jest.fn();
    const toolbarOption = mount(
      <ToolbarInsertBlock
        mediaSupported={true}
        mediaUploadsEnabled={true}
        onShowMediaPicker={spy}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint6 - 1}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    const mediaButton = toolbarOption
      .find('Item')
      .filterWhere(n => n.html().indexOf('Files and images') >= 0);
    mediaButton.simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.media.button',
    );
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to default if editorWidth is greater then BreakPoint10', () => {
    const { editorView } = editor(doc(p('text')));
    const spy = jest.fn();
    const toolbarOption = mount(
      <ToolbarInsertBlock
        mediaSupported={true}
        mediaUploadsEnabled={true}
        onShowMediaPicker={spy}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint10 + 1}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    const mediaButton = toolbarOption
      .find(Item)
      .filterWhere(n => n.text().indexOf('Files and images') >= 0);
    mediaButton.simulate('click');
    expect(
      toolbarOption
        .find(ToolbarButton)
        .first()
        .prop('spacing'),
    ).toEqual('default');
    toolbarOption.unmount();
  });

  it('should trigger insertBlockType when Panel option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginStateBlockType = blockTypePluginsSet[0].getState(
      editorView.state,
    );
    const spy = jest.fn();

    const toolbarOption = mount(
      <ToolbarInsertBlock
        availableWrapperBlockTypes={
          pluginStateBlockType.availableWrapperBlockTypes
        }
        onInsertBlockType={spy}
        editorView={editorView}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    blockTypePluginsSet[0].getState(
      editorView.state,
    ).insertBlockType = jest.fn();
    const panelButton = toolbarOption
      .find(Item)
      .filterWhere(n => n.text().indexOf('Panel') >= 0);
    panelButton.simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.panel.button',
    );
    toolbarOption.unmount();
  });

  it('should trigger insertBlockType when code block option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginStateBlockType = blockTypePluginsSet[0].getState(
      editorView.state,
    );
    const spy = jest.fn();

    const toolbarOption = mount(
      <ToolbarInsertBlock
        availableWrapperBlockTypes={
          pluginStateBlockType.availableWrapperBlockTypes
        }
        onInsertBlockType={spy}
        editorView={editorView}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    blockTypePluginsSet[0].getState(
      editorView.state,
    ).insertBlockType = jest.fn();
    const codeblockButton = toolbarOption
      .find(Item)
      .filterWhere(n => n.text().indexOf('Code block') >= 0);
    codeblockButton.simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.codeblock.button',
    );
    toolbarOption.unmount();
  });

  it('should trigger insertBlockType when blockquote option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginStateBlockType = blockTypePluginsSet[0].getState(
      editorView.state,
    );
    const spy = jest.fn();

    const toolbarOption = mount(
      <ToolbarInsertBlock
        availableWrapperBlockTypes={
          pluginStateBlockType.availableWrapperBlockTypes
        }
        onInsertBlockType={spy}
        editorView={editorView}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    const blockquoteButton = toolbarOption
      .find(Item)
      .filterWhere(n => n.text().indexOf('Block quote') >= 0);

    blockquoteButton.simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.blockquote.button',
    );
    toolbarOption.unmount();
  });

  it('should track table creation event when table menu is clicked option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        tableSupported={true}
        tableHidden={false}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint3 - 1}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    const spy = jest.fn();
    tableCommands.createTable = () => spy;
    const tableButton = toolbarOption
      .find(Item)
      .filterWhere(n => n.text().indexOf('Table') >= 0);
    tableButton.simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.table.button',
    );
    toolbarOption.unmount();
  });

  it('should trigger insertMacroFromMacroBrowser when "[...] View More" option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const insertMacroFromMacroBrowser = jest.fn();
    const macroProvider = {} as any;

    const toolbarOption = mount(
      <ToolbarInsertBlock
        macroProvider={macroProvider}
        onInsertMacroFromMacroBrowser={() => insertMacroFromMacroBrowser}
        editorView={editorView}
      />,
    );

    toolbarOption.find(ToolbarButton).simulate('click');
    const button = toolbarOption
      .find(Item)
      .filterWhere(n => n.text().indexOf('View more') > -1);
    button.simulate('click');
    expect(insertMacroFromMacroBrowser).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.macro.button',
    );
    toolbarOption.unmount();
  });

  describe('Options in insert toolbar', () => {
    it('should have table option if tableSupported is true', () => {
      const { editorView } = editor(doc(p('text')));
      const toolbarOption = mount(
        <ToolbarInsertBlock
          tableSupported={true}
          tableHidden={false}
          editorView={editorView}
          editorWidth={EditorWidth.BreakPoint3 - 1}
        />,
      );
      toolbarOption.find(ToolbarButton).simulate('click');
      expect(
        toolbarOption
          .find('Item')
          .filterWhere(n => n.html().indexOf('Insert table') > -1).length > 0,
      ).toEqual(true);
    });

    it('should have 3 child elements if availableWrapperBlockTypes is defined', () => {
      const { editorView } = editor(doc(p('text')));
      const pluginStateBlockType = blockTypePluginsSet[0].getState(
        editorView.state,
      );
      const toolbarOption = mount(
        <ToolbarInsertBlock
          availableWrapperBlockTypes={
            pluginStateBlockType.availableWrapperBlockTypes
          }
          editorView={editorView}
        />,
      );
      const items = toolbarOption.find(DropdownMenu).prop('items');
      expect((items[0] as any).items.length).toEqual(3);
      toolbarOption.unmount();
    });

    it('should have link option in dropdown if the width is greater then BreakPoint7', () => {
      const { editorView } = editor(doc(p('text')));
      const toolbarOption = mount(
        <ToolbarInsertBlock
          editorView={editorView}
          editorWidth={EditorWidth.BreakPoint7 - 1}
        />,
      );
      toolbarOption.find(ToolbarButton).simulate('click');
      expect(
        toolbarOption
          .find('Item')
          .filterWhere(n => n.html().indexOf('Add link') > -1).length,
      ).toEqual(1);
      toolbarOption.unmount();
    });

    it('should have media option in dropdown if the width is less then BreakPoint6', () => {
      const { editorView } = editor(doc(p('text')));
      const toolbarOption = mount(
        <ToolbarInsertBlock
          mediaSupported={true}
          mediaUploadsEnabled={true}
          editorView={editorView}
          editorWidth={EditorWidth.BreakPoint6 - 1}
        />,
      );
      toolbarOption.find(ToolbarButton).simulate('click');
      expect(
        toolbarOption
          .find('Item')
          .filterWhere(n => n.html().indexOf('Files and images') > -1).length,
      ).toEqual(1);
      toolbarOption.unmount();
    });

    it('should have mention option in dropdown if the width is greater then BreakPoint5', () => {
      const { editorView } = editor(doc(p('text')));
      const toolbarOption = mount(
        <ToolbarInsertBlock
          mentionsSupported={true}
          mentionsEnabled={true}
          editorView={editorView}
          editorWidth={EditorWidth.BreakPoint5 - 1}
        />,
      );
      toolbarOption.find(ToolbarButton).simulate('click');
      expect(
        toolbarOption
          .find('Item')
          .filterWhere(n => n.html().indexOf('Mention') > -1).length,
      ).toEqual(1);
      toolbarOption.unmount();
    });

    it('should have emoji option in dropdown if the width is greater then BreakPoint4', () => {
      const { editorView } = editor(doc(p('text')));
      const toolbarOption = mount(
        <ToolbarInsertBlock
          emojiProvider={emojiProvider}
          editorView={editorView}
          editorWidth={EditorWidth.BreakPoint4 - 1}
        />,
      );
      toolbarOption.find(ToolbarButton).simulate('click');
      expect(
        toolbarOption
          .find('Item')
          .filterWhere(n => n.html().indexOf('Emoji') > -1).length,
      ).toEqual(1);
      toolbarOption.unmount();
    });

    it('should have table option if width is less then BreakPoint3', () => {
      const { editorView } = editor(doc(p('text')));
      const toolbarOption = mount(
        <ToolbarInsertBlock
          tableSupported={true}
          editorView={editorView}
          editorWidth={EditorWidth.BreakPoint3 - 1}
        />,
      );
      toolbarOption.find(ToolbarButton).simulate('click');
      expect(
        toolbarOption
          .find('Item')
          .filterWhere(n => n.html().indexOf('Table') > -1).length,
      ).toEqual(1);
      toolbarOption.unmount();
    });
  });
});
