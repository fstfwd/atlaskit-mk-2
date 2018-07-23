import { mount } from 'enzyme';
import * as React from 'react';
import { stateKey } from '../../../../src/plugins/block-type/pm-plugins/main';
import ToolbarBlockType from '../../../../src/plugins/block-type/ui/ToolbarBlockType';
import ToolbarButton from '../../../../src/ui/ToolbarButton';
import TextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';
import Item from '@atlaskit/item';
import AkButton from '@atlaskit/button';
import {
  doc,
  p,
  createEditor,
  code_block,
  blockquote,
  panel,
} from '@atlaskit/editor-test-helpers';
import {
  NORMAL_TEXT,
  HEADING_1,
  HEADING_2,
  HEADING_3,
  HEADING_4,
  HEADING_5,
  HEADING_6,
} from '../../../../src/plugins/block-type/types';
import { analyticsService } from '../../../../src/analytics';
import panelPlugin from '../../../../src/plugins/panel';
import listPlugin from '../../../../src/plugins/lists';
import codeBlockPlugin from '../../../../src/plugins/code-block';

describe('@atlaskit/editor-core/ui/ToolbarBlockType', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
      pluginKey: stateKey,
      editorPlugins: [panelPlugin, listPlugin, codeBlockPlugin()],
    });

  it('should render disabled ToolbarButton if isDisabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarBlockType
        pluginState={pluginState}
        editorView={editorView}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if current selection is blockquote', () => {
    const { editorView, pluginState } = editor(doc(blockquote(p('te{<>}xt'))));
    const toolbarOption = mount(
      <ToolbarBlockType
        pluginState={pluginState}
        editorView={editorView}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should not render disabled ToolbarButton if current selection is panel', () => {
    const { editorView, pluginState } = editor(doc(panel()(p('te{<>}xt'))));
    const toolbarOption = mount(
      <ToolbarBlockType pluginState={pluginState} editorView={editorView} />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(false);
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if code-block is selected', () => {
    const { editorView, pluginState } = editor(
      doc(code_block({ language: 'js' })('te{<>}xt')),
    );
    const toolbarOption = mount(
      <ToolbarBlockType
        pluginState={pluginState}
        editorView={editorView}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to none if property isReducedSpacing=true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarBlockType
        pluginState={pluginState}
        editorView={editorView}
        isReducedSpacing={true}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toBe('none');
    toolbarOption.unmount();
  });

  it('should render icon in dropdown-menu if property isSmall=true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarBlockType
        pluginState={pluginState}
        editorView={editorView}
        isSmall={true}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).find(TextStyleIcon).length).toBe(
      1,
    );
    toolbarOption.unmount();
  });

  it('should render current block type in dropdown-menu if property isSmall=false', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarBlockType pluginState={pluginState} editorView={editorView} />,
    );
    expect(
      toolbarOption
        .find(ToolbarButton)
        .first()
        .text()
        .indexOf('Normal text') >= 0,
    ).toBe(true);
    toolbarOption.unmount();
  });

  describe('blockType dropdown items', () => {
    let toolbarOption;
    beforeEach(() => {
      const { editorView, pluginState } = editor(doc(p('text')));
      toolbarOption = mount(
        <ToolbarBlockType pluginState={pluginState} editorView={editorView} />,
      );
      toolbarOption.find(ToolbarButton).simulate('click');
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    [NORMAL_TEXT, HEADING_1, HEADING_2, HEADING_3, HEADING_4, HEADING_5, HEADING_6,]
    .forEach(blockType => {
      it(`should have tagName ${blockType.tagName} present`, () => {
        expect(toolbarOption
          .find(Item)
          .findWhere((n) => n.type() === blockType.tagName && n.text() === blockType.title)
          .length).toEqual(1);
      });
    });
  });

  describe('analytics', () => {
    let trackEvent;
    let toolbarOption;
    beforeEach(() => {
      const { editorView, pluginState } = editor(doc(p('text')));
      toolbarOption = mount(
        <ToolbarBlockType pluginState={pluginState} editorView={editorView} />,
      );
      toolbarOption.find(ToolbarButton).simulate('click');
      trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    [NORMAL_TEXT, HEADING_1, HEADING_2, HEADING_3, HEADING_4, HEADING_5, HEADING_6]
    .forEach(blockType => {
      it(`should trigger analyticsService.trackEvent when ${
        blockType.title
      } is clicked`, () => {
        toolbarOption
          .find(Item)
          .filterWhere(n => n.text() === blockType.title)
          .simulate('click');
        expect(trackEvent).toHaveBeenCalledWith(
          `atlassian.editor.format.${blockType.name}.button`,
        );
      });
    });
  });
});
