import { mount } from 'enzyme';
import * as React from 'react';

import hyperlinkPlugins, { HyperlinkState } from '../../src/plugins/hyperlink';
import HyperlinkEdit from '../../src/ui/HyperlinkEdit';
import PanelTextInput from '../../src/ui/PanelTextInput';
import {
  createEvent,
  doc,
  p as paragraph,
  a as link,
  makeEditor,
  defaultSchema,
} from '@atlaskit/editor-test-helpers';
import { setTextSelection } from '../../src/utils';
import { PlaceholderCursor } from '../../src/plugins/placeholder-cursor/cursor';

describe('@atlaskit/editor-core/ui/HyperlinkEdit', () => {
  const editor = (doc: any) =>
    makeEditor<HyperlinkState>({
      doc,
      plugins: hyperlinkPlugins(defaultSchema),
    });
  const blurEvent = createEvent('blur');
  const focusEvent = createEvent('focus');

  it('should produce null HTML when another block on editor is focused', () => {
    const { editorView, plugin, pluginState } = editor(
      doc(
        paragraph('te{<>}xt'),
        paragraph(
          'before',
          link({ href: 'http://www.atlassian.com' })('text'),
          'after',
        ),
      ),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    plugin.props.handleDOMEvents!.blur(editorView, blurEvent);
    expect(hyperlinkEdit.html()).toEqual(null);
  });

  it('should not produce null HTML when a link on editor is focused', () => {
    const { editorView, plugin, pluginState } = editor(
      doc(
        paragraph(
          'before',
          link({ href: 'http://www.atlassian.com' })('te{<>}xt'),
          'after',
        ),
      ),
    );
    plugin.props.handleDOMEvents!.focus(editorView, focusEvent);
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    expect(hyperlinkEdit.html()).not.toBe(null);
  });

  it('should produce null HTML when editor is blur', () => {
    const { editorView, plugin, pluginState } = editor(
      doc(
        paragraph(
          'before',
          link({ href: 'http://www.atlassian.com' })('te{<>}xt'),
          'after',
        ),
      ),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    plugin.props.handleDOMEvents!.blur(editorView, blurEvent);
    expect(hyperlinkEdit.html()).toEqual(null);
  });

  it('should set autoFocus of PanelTextInput to true when link href is not defined', () => {
    const { editorView, pluginState } = editor(
      doc(paragraph('before', link({ href: '' })('te{<>}xt'), 'after')),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    const input = hyperlinkEdit.find(PanelTextInput);
    expect(input.prop('autoFocus')).toBe(true);
  });

  it('should set state variable autoFocusInput to false when link href is defined', () => {
    const { editorView, pluginState } = editor(
      doc(
        paragraph(
          'before',
          link({ href: 'http://www.atlassian.com' })('te{<>}xt'),
          'after',
        ),
      ),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    (editorView.dom as HTMLElement).click();
    expect(hyperlinkEdit.state('autoFocusInput')).not.toEqual(true);
  });

  it('should set state variable autoFocusInput to false when link href is defined', () => {
    const { editorView, pluginState } = editor(
      doc(
        paragraph(
          'before',
          link({ href: 'http://www.atlassian.com' })('te{<>}xt'),
          'after',
        ),
      ),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    (editorView.dom as HTMLElement).click();
    expect(hyperlinkEdit.state('autoFocusInput')).not.toEqual(true);
  });

  it('should show title input when title and href are same', () => {
    const { editorView, pluginState } = editor(
      doc(
        paragraph(
          'before',
          link({ href: 'http://www.atlassian.com' })('www.atlas{<>}sian.com'),
          'after',
        ),
      ),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    hyperlinkEdit.setState({ editorFocused: true });
    expect(hyperlinkEdit.find(PanelTextInput).prop('defaultValue')).toEqual('');
    expect(hyperlinkEdit.find(PanelTextInput).prop('placeholder')).toEqual(
      'Text to display',
    );
  });

  it('should show href input when title is defined', () => {
    const { editorView, pluginState } = editor(
      doc(
        paragraph(
          'before',
          link({ href: 'http://www.atlassian.com' })('Atlas{<>}sian'),
          'after',
        ),
      ),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    hyperlinkEdit.setState({ editorFocused: true });
    expect(hyperlinkEdit.find(PanelTextInput).prop('defaultValue')).toEqual(
      'http://www.atlassian.com',
    );
    expect(hyperlinkEdit.find(PanelTextInput).prop('placeholder')).toEqual(
      'Paste link',
    );
  });

  it('should clear data of previous link', () => {
    const { editorView, pluginState } = editor(
      doc(
        paragraph(
          'before',
          link({ href: 'http://www.atlassian.com' })(
            'http://www.at{<>}lassian.com',
          ),
          'between',
          link({ href: 'http://www.google.com' })('http://www.google.com'),
          'after',
        ),
      ),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    hyperlinkEdit.setState({ editorFocused: true });
    const input = hyperlinkEdit.find('PanelTextInput').find('input');
    (input.get(0) as any).value = 'Atlasian';
    input.simulate('change');
    input.simulate('keydown', { keyCode: 13 });
    setTextSelection(editorView, 10, 10);
    hyperlinkEdit.setState({ editorFocused: true });
    expect(hyperlinkEdit.find(PanelTextInput).prop('placeholder')).toEqual(
      'Paste link',
    );
    expect(hyperlinkEdit.find(PanelTextInput).prop('defaultValue')).toEqual(
      'http://www.atlassian.com',
    );
    setTextSelection(editorView, 25, 25);
    hyperlinkEdit.setState({ editorFocused: true });
    expect(hyperlinkEdit.find(PanelTextInput).prop('placeholder')).toEqual(
      'Text to display',
    );
    expect(hyperlinkEdit.find(PanelTextInput).prop('defaultValue')).toEqual('');
  });

  it('should update href on blur', () => {
    const { editorView, pluginState } = editor(
      doc(paragraph('before', link({ href: '' })('te{<>}xt'), 'after')),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    hyperlinkEdit.setState({ editorFocused: true });
    const input = hyperlinkEdit.find(PanelTextInput);
    const href = 'http://www.atlassian.com';
    input.prop('onChange')!(href);
    input.prop('onBlur')!();
    expect(pluginState.href).toEqual(href);
  });

  it('should update title on blur', () => {
    const { editorView, pluginState } = editor(
      doc(
        paragraph(
          'before',
          link({ href: 'http://www.atlassian.com' })('www.atlas{<>}sian.com'),
          'after',
        ),
      ),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    hyperlinkEdit.setState({ editorFocused: true });
    const input = hyperlinkEdit.find(PanelTextInput);
    const title = 'Atlassian';
    const origFn = pluginState.updateLinkText;
    let titleArg: string;
    const updateLinkTextStub = jest.spyOn(pluginState, 'updateLinkText');
    updateLinkTextStub.mockImplementation((...args) => {
      titleArg = args[0];
      return origFn.apply(pluginState, args);
    });
    input.prop('onChange')!(title);
    input.prop('onBlur')!();
    // pluginState.text doesn't work because link is not inclusive. After replace the selection gets outside of the link
    expect(titleArg!).toMatch(title);
    updateLinkTextStub.mockRestore();
  });

  it('should not update title or href on blur if there is no change', () => {
    const { editorView, pluginState } = editor(
      doc(
        paragraph(
          'before',
          link({ href: 'http://www.atlassian.com' })('www.atlas{<>}sian.com'),
          'after',
        ),
      ),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    hyperlinkEdit.setState({ editorFocused: true });
    const input = hyperlinkEdit.find(PanelTextInput);
    const updateLinkStub = jest.spyOn(pluginState, 'updateLink');
    const updateLinkTextStub = jest.spyOn(pluginState, 'updateLinkText');
    input.prop('onBlur')!();
    expect(updateLinkStub).not.toHaveBeenCalled();
    expect(updateLinkTextStub).not.toHaveBeenCalled();
    updateLinkTextStub.mockRestore();
    updateLinkStub.mockRestore();
  });

  it('should add placeholder cursor when input HyperlinkEdit is focused', () => {
    const { editorView, pluginState } = editor(
      doc(
        paragraph(
          'before',
          link({ href: 'http://www.atlassian.com' })('www.atlas{<>}sian.com'),
          'after',
        ),
      ),
    );
    const hyperlinkEdit = mount(
      <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
    );
    hyperlinkEdit.setState({ editorFocused: true });
    const input = hyperlinkEdit.find(PanelTextInput);
    input.simulate('mouseDown');
    expect(editorView.state.selection instanceof PlaceholderCursor).toEqual(
      true,
    );
  });
});
