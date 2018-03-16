// @flow
import { mount } from 'enzyme';
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';

import { name } from '../package.json';
import { SpotlightManager, SpotlightTarget } from '../src';

import SpotlightWithAnalytics, { Spotlight } from '../src/components/Spotlight';

function render(jsx) {
  return ReactDOMServer.renderToStaticMarkup(jsx);
}
function assertEqual(actual, expected) {
  expect(render(actual)).toBe(render(expected));
}

/* eslint-disable jest/no-disabled-tests */
describe(name, () => {
  describe('manager', () => {
    it('should render as a div by default', () => {
      assertEqual(
        <SpotlightManager>
          <span>foo</span>
        </SpotlightManager>,
        // should equal
        <div>
          <span>foo</span>
        </div>,
      );
    });
    it('should accept component as a prop', () => {
      assertEqual(
        <SpotlightManager component="section">
          <span>foo</span>
        </SpotlightManager>,
        // should equal
        <section>
          <span>foo</span>
        </section>,
      );
    });
    it('should accept complex component as a prop', () => {
      assertEqual(
        <SpotlightManager component={props => <blockquote {...props} />}>
          <span>foo</span>
        </SpotlightManager>,
        // should equal
        <blockquote>
          <span>foo</span>
        </blockquote>,
      );
    });
  });
  describe('target', () => {
    it('should render its children only', () => {
      assertEqual(
        <SpotlightManager>
          <SpotlightTarget name="foo">
            <span>foo</span>
          </SpotlightTarget>
        </SpotlightManager>,
        // should equal
        <div>
          <span>foo</span>
        </div>,
      );
    });
  });
  describe.skip('spotlight', () => {
    it('should render content', () => {
      assertEqual(
        <SpotlightManager>
          <div>
            <SpotlightTarget name="qux">
              <span>qux</span>
            </SpotlightTarget>
            <Spotlight
              header={() => <span>foo</span>}
              footer={() => <span>baz</span>}
              target="qux"
            >
              <span>bar</span>
            </Spotlight>
          </div>
        </SpotlightManager>,
        // should equal
        <div>
          <span>foo</span>
          <span>bar</span>
          <span>baz</span>
        </div>,
      );
    });
    it('should render SpotlightTarget in Spotlight', () => {
      assertEqual(
        <SpotlightManager>
          <div>
            <section>
              <Spotlight target="foo">
                <span>dialog</span>
              </Spotlight>
            </section>
            <SpotlightTarget name="foo">
              <span>target</span>
            </SpotlightTarget>
          </div>
        </SpotlightManager>,
        // should equal
        <div>
          <section>
            <span>dialog</span>
          </section>
          <span>target</span>
        </div>,
      );
    });
  });
});
describe('SpotlightWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    class SpotlightStub extends Component<*, *> {
      state = {
        isOpen: false,
      };

      componentDidMount() {
        this.setState({
          isOpen: true,
        });
      }

      render() {
        return (
          <SpotlightManager>
            <div>
              <SpotlightTarget name="foo">
                <span>target</span>
              </SpotlightTarget>
              <section>
                {this.state.isOpen && (
                  <SpotlightWithAnalytics target="foo">
                    <span>dialog</span>
                  </SpotlightWithAnalytics>
                )}
              </section>
            </div>
          </SpotlightManager>
        );
      }
    }

    mount(<SpotlightStub />);

    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });
});
