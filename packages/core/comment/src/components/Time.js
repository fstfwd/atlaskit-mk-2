// @flow

import React, { Component, type Node } from 'react';
import Field from './Field';

type Props = {
  /** The time of the comment. */
  children?: Node,
  /** The URL of the link. If not provided, the element will be rendered as text. */
  href?: string,
  /** Handler called when the element is clicked. */
  // flowlint-next-line unclear-type:off
  onClick?: Function,
  /** Handler called when the element is focused. */
  // flowlint-next-line unclear-type:off
  onFocus?: Function,
  /** Handler called when the element is moused over. */
  // flowlint-next-line unclear-type:off
  onMouseOver?: Function,
};

export default class Time extends Component<Props> {
  render() {
    const { children, href, onClick, onFocus, onMouseOver } = this.props;
    return (
      <Field
        href={href}
        onClick={onClick}
        onFocus={onFocus}
        onMouseOver={onMouseOver}
      >
        {children}
      </Field>
    );
  }
}
