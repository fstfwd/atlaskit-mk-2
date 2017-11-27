// @flow

import React from 'react';
import Spinner from '@atlaskit/spinner';
import { akColorB400 } from '@atlaskit/util-shared-styles';

export default () => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: akColorB400,
      padding: '10px',
    }}
  >
    <Spinner invertColor size="small" />
    <Spinner invertColor size="medium" />
    <Spinner invertColor size="large" />
    <Spinner invertColor size="xlarge" />
  </div>
);
