// @flow
import React from 'react';
import { mount } from 'enzyme';

import { name } from '../../package.json';

import SingleLineTextInputWithAnalytics, {
  SingleLineTextInputBase,
} from '../SingleLineTextInput';

describe(name, () => {
  it('selects the input when select() is called', () => {
    const value = 'my-value';
    const wrapper = mount(
      <SingleLineTextInputBase isEditing onChange={() => {}} value={value} />,
    );

    wrapper.instance().select();

    const input = wrapper.find('input').instance();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(value.length);
  });
});
describe('analytics - Input', () => {});
describe('SingleLineTextInputWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    const value = 'my-value';
    mount(
      <SingleLineTextInputWithAnalytics
        isEditing
        onChange={() => {}}
        value={value}
      />,
    );
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
