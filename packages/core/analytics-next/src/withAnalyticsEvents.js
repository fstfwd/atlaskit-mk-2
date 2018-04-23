// @flow

import React, {
  Component,
  type Node,
  type ComponentType,
  type ElementConfig,
} from 'react';
import PropTypes from 'prop-types';

import UIAnalyticsEvent from './UIAnalyticsEvent';
import type { AnalyticsEventPayload } from './types';

export type CreateUIAnalyticsEvent = (
  payload: AnalyticsEventPayload,
) => UIAnalyticsEvent;

export type WithAnalyticsEventsProps = {
  createAnalyticsEvent: CreateUIAnalyticsEvent,
};

type AnalyticsEventsProps = {
  createAnalyticsEvent: CreateUIAnalyticsEvent | void,
};

type EventMap<ProvidedProps: {}> = {
  [string]:
    | AnalyticsEventPayload
    | ((
        create: CreateUIAnalyticsEvent,
        props: ProvidedProps,
      ) => UIAnalyticsEvent | void),
};

// This component is used to grab the analytics functions off context.
// It uses legacy context, but provides an API similar to 16.3 context.
// This makes it easier to use with the forward ref API.
class AnalyticsContextConsumer extends Component<{
  children: CreateUIAnalyticsEvent => Node,
}> {
  static contextTypes = {
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
    getAtlaskitAnalyticsContext: PropTypes.func,
  };
  createAnalyticsEvent = (payload: AnalyticsEventPayload): UIAnalyticsEvent => {
    const {
      getAtlaskitAnalyticsEventHandlers,
      getAtlaskitAnalyticsContext,
    } = this.context;
    const context =
      (typeof getAtlaskitAnalyticsContext === 'function' &&
        getAtlaskitAnalyticsContext()) ||
      [];
    const handlers =
      (typeof getAtlaskitAnalyticsEventHandlers === 'function' &&
        getAtlaskitAnalyticsEventHandlers()) ||
      [];
    return new UIAnalyticsEvent({ context, handlers, payload });
  };
  render() {
    return this.props.children(this.createAnalyticsEvent);
  }
}

// given all props and a map with the callback props to add analytics,
// patch the callbacks to provide analytics information.
const modifyCallbackProps = <T: {}>(
  props: T,
  eventMap: $Shape<T>,
  createAnalyticsEvent: CreateUIAnalyticsEvent,
): $Shape<T> =>
  Object.keys(eventMap).reduce((modified, propCallbackName) => {
    const eventCreator = eventMap[propCallbackName];
    const providedCallback = props[propCallbackName];
    if (!['object', 'function'].includes(typeof eventCreator)) {
      return modified;
    }
    const modifiedCallback = (...args) => {
      const analyticsEvent =
        typeof eventCreator === 'function'
          ? eventCreator(createAnalyticsEvent, props)
          : createAnalyticsEvent(eventCreator);

      if (providedCallback) {
        providedCallback(...args, analyticsEvent);
      }
    };
    return {
      ...modified,
      [propCallbackName]: modifiedCallback,
    };
  }, {});

export default function withAnalyticsEvents<
  Props: {},
  InnerComponent: ComponentType<Props>,
  ExternalProps: $Diff<ElementConfig<InnerComponent>, AnalyticsEventsProps>,
>(
  createEventMap: EventMap<ExternalProps> = {},
): (WrappedComponent: InnerComponent) => ComponentType<ExternalProps> {
  return WrappedComponent => {
    // $FlowFixMe - flow 0.67 doesn't know about forwardRef
    const WithAnalyticsEvents = React.forwardRef(
      (props: ExternalProps, ref) => (
        <AnalyticsContextConsumer>
          {createAnalyticsEvent => (
            <WrappedComponent
              {...props}
              {...modifyCallbackProps(
                props,
                createEventMap,
                createAnalyticsEvent,
              )}
              createAnalyticsEvent={createAnalyticsEvent}
              ref={ref}
            />
          )}
        </AnalyticsContextConsumer>
      ),
    );

    WithAnalyticsEvents.displayName = `WithAnalyticsEvents(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    return WithAnalyticsEvents;
  };
}
