// @flow

import React, { Component, type ComponentType } from 'react';

const getComponentName = (target: ComponentType<*>): string => {
  if (target.displayName && typeof target.displayName === 'string') {
    return target.displayName;
  }

  return target.name || 'Component';
};

const warnIfDeprecatedAppearance = appearance => {
  const deprecatedAppearances = ['help'];
  if (appearance && deprecatedAppearances.includes(appearance)) {
    // eslint-disable-next-line no-console
    console.warn(
      `Atlaskit: The Button appearance "${
        appearance
      }" is deprecated. Please use styled-components' ThemeProvider to provide a custom theme for Button instead.`,
    );
  }
};

type WithDeprecationWarningsProps = *;

export default function withDeprecationWarnings(
  WrappedComponent: ComponentType<WithDeprecationWarningsProps>,
): ComponentType<WithDeprecationWarningsProps> {
  return class WithDeprecationWarnings extends Component<
    WithDeprecationWarningsProps,
  > {
    static displayName = `WithDeprecationWarnings(${getComponentName(
      WrappedComponent,
    )})`;

    componentWillMount() {
      warnIfDeprecatedAppearance(this.props.appearance);
    }

    componentWillReceiveProps(newProps: WithDeprecationWarningsProps) {
      if (newProps.appearance !== this.props.appearance) {
        warnIfDeprecatedAppearance(newProps.appearance);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
