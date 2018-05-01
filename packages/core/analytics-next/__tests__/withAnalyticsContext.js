// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { AnalyticsContext, withAnalyticsContext } from '../src';

type WrappedProps = {
  // flowlint-next-line unclear-type:off
  children: any,
};

it('should render the provided component', () => {
  const Button = ({ children }: WrappedProps) => <button>{children}</button>;
  const ButtonWithContext = withAnalyticsContext()(Button);
  const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

  expect(wrapper.html()).toBe('<button>Hello</button>');
});

it('should have descriptive displayName', () => {
  const MyGreatButton = ({ children }: WrappedProps) => (
    <button>{children}</button>
  );
  const ButtonWithContext = withAnalyticsContext()(MyGreatButton);

  expect(ButtonWithContext.displayName).toBe(
    'WithAnalyticsContext(MyGreatButton)',
  );
});

it('should wrap inner component with analytics context component', () => {
  const Button = ({ children }: WrappedProps) => <button>{children}</button>;
  const ButtonWithContext = withAnalyticsContext()(Button);
  const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

  expect(
    wrapper.equals(
      <AnalyticsContext data={{}}>
        <Button>Hello</Button>
      </AnalyticsContext>,
    ),
  ).toBe(true);
});

it('should pass analyticsContext prop data to analytics context component', () => {
  const Button = ({ children }: WrappedProps) => <button>{children}</button>;
  const ButtonWithContext = withAnalyticsContext()(Button);
  const wrapper = shallow(
    <ButtonWithContext analyticsContext={{ name: 'specialButton' }}>
      Hello
    </ButtonWithContext>,
  );

  expect(
    wrapper.equals(
      <AnalyticsContext data={{ name: 'specialButton' }}>
        <Button>Hello</Button>
      </AnalyticsContext>,
    ),
  ).toBe(true);
});

it('should pass default data to analytics context when no prop exists', () => {
  const Button = ({ children }: WrappedProps) => <button>{children}</button>;
  const ButtonWithContext = withAnalyticsContext({ name: 'button' })(Button);
  const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

  expect(
    wrapper.equals(
      <AnalyticsContext data={{ name: 'button' }}>
        <Button>Hello</Button>
      </AnalyticsContext>,
    ),
  ).toBe(true);
});

it('should pass an empty object to analytics context if no default or prop value defined', () => {
  const Button = ({ children }: WrappedProps) => <button>{children}</button>;
  const ButtonWithContext = withAnalyticsContext()(Button);
  const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

  expect(
    wrapper.equals(
      <AnalyticsContext data={{}}>
        <Button>Hello</Button>
      </AnalyticsContext>,
    ),
  ).toBe(true);
});
