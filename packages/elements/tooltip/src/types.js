// @flow

import { Component, type Element } from 'react';
import type { PropType } from 'babel-plugin-react-flow-props-to-prop-types'; // eslint-disable-line import/no-extraneous-dependencies

export type ChildrenType = PropType<Array<Element<any>> | Element<any>, any>;
export type ComponentType = PropType<Component<{}, {}, {}>, any>;
export type ElementType = PropType<Element<mixed>, any>;
export type FunctionType = (...args: Array<any>) => mixed;
export type SingleChild = ComponentType | ElementType;

export type PositionType = 'bottom' | 'left' | 'right' | 'top';
export type CoordinatesType = { left?: number, top?: number };
