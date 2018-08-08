// @flow
import React from 'react';
import { css } from 'emotion';
import { colors } from '@atlaskit/theme';
import { BORDER_WIDTH } from './constants';

// set fallbacks for border color/width to protect consumers from invalid values
type OuterProps = {
  bgColor: string,
  size: string,
};

export const Outer = (props: OuterProps) => {
  console.log('OUTER', props.bgColor, BORDER_WIDTH[props.size]);
  return (
    <span
      className={css({
        alignContent: 'center;',
        alignItems: 'center;',
        backgroundColor: props.bgColor || colors.background,
        borderRadius: '50%',
        boxSizing: 'border-box;',
        display: 'flex;',
        height: '100%;',
        overflow: 'hidden;',
        padding: `${BORDER_WIDTH[props.size] || BORDER_WIDTH.medium}px;`,
        width: '100%;',
      })}
      {...props}
    />
  );
};

export const Inner = props => (
  <span
    className={css({
      alignItems: 'center;',
      borderRadius: '50%;',
      display: 'flex;',
      height: '100%;',
      overflow: 'hidden;',
      width: '100%;',
    })}
    {...props}
  />
);
