import * as React from 'react';
import { PureComponent } from 'react';
import { Schema } from 'prosemirror-model';
import {
  UnsupportedBlock,
  ProviderFactory,
  defaultSchema,
  MentionEventHandler,
  CardEventClickHandler,
  AppCardEventClickHandler,
  AppCardActionEventClickHandler,
  ActionEventClickHandler,
} from '@atlaskit/editor-common';
import { ReactSerializer, renderDocument, RendererContext } from '../../';
import { RenderOutputStat } from '../../';
import { Wrapper } from './style';

export interface MentionEventHandlers {
  onClick?: MentionEventHandler;
  onMouseEnter?: MentionEventHandler;
  onMouseLeave?: MentionEventHandler;
}

export interface EventHandlers {
  mention?: MentionEventHandlers;
  media?: {
    onClick?: CardEventClickHandler;
  };
  action?: {
    onClick?: ActionEventClickHandler;
  };
  applicationCard?: {
    onClick?: AppCardEventClickHandler;
    onActionClick?: AppCardActionEventClickHandler;
  };
}

export interface Props {
  document: any;
  dataProviders?: ProviderFactory;
  eventHandlers?: EventHandlers;
  onComplete?: (stat: RenderOutputStat) => void;
  portal?: HTMLElement;
  rendererContext?: RendererContext;
  schema?: Schema;
}

export default class Renderer extends PureComponent<Props, {}> {
  private providerFactory: ProviderFactory;
  private serializer: ReactSerializer;

  constructor(props: Props) {
    super(props);
    this.providerFactory = props.dataProviders || new ProviderFactory();

    this.updateSerializer(props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.portal !== this.props.portal) {
      this.updateSerializer(nextProps);
    }
  }

  private updateSerializer(props: Props) {
    const { eventHandlers, portal, rendererContext } = props;

    this.serializer = new ReactSerializer(
      this.providerFactory,
      eventHandlers,
      portal,
      rendererContext,
    );
  }

  render() {
    const { document, onComplete, schema } = this.props;

    try {
      const { result, stat } = renderDocument(
        document,
        this.serializer,
        schema || defaultSchema,
      );

      if (onComplete) {
        onComplete(stat);
      }

      return <Wrapper>{result}</Wrapper>;
    } catch (ex) {
      return (
        <Wrapper>
          <UnsupportedBlock />
        </Wrapper>
      );
    }
  }

  componentWillUnmount() {
    const { dataProviders } = this.props;

    // if this is the ProviderFactory which was created in constructor
    // it's safe to destroy it on Renderer unmount
    if (!dataProviders) {
      this.providerFactory.destroy();
    }
  }
}
