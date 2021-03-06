import { HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';

import { fontSize } from '@atlaskit/theme';
import {
  akColorB300,
  akColorB400,
  akColorN800,
  akColorN30A,
  akColorR50,
  akColorR500,
  akGridSizeUnitless,
  akFontFamily,
  akFontSizeDefault,
  akBorderRadius,
} from '@atlaskit/util-shared-styles';
import {
  tableSharedStyle,
  columnLayoutSharedStyle,
  editorFontSize,
  blockquoteSharedStyles,
  headingsSharedStyles,
  panelSharedStyles,
  ruleSharedStyles,
  paragraphSharedStyles,
  mediaSingleSharedStyle,
  blockNodesVerticalMargin,
} from '@atlaskit/editor-common';
import { RendererAppearance } from './';

export interface Props {
  appearance?: RendererAppearance;
}

const getLineHeight = ({ appearance }: Props) => {
  return `line-height: ${appearance === 'message' ? 20 : 24}px`;
};

export const Wrapper: ComponentClass<Props & HTMLAttributes<{}>> = styled.div`
  font-size: ${editorFontSize}px;
  ${getLineHeight};
  color: ${akColorN800};
  word-wrap: break-word;

  & span.akActionMark {
    color: ${akColorB400};
    text-decoration: none;

    &:hover {
      color: ${akColorB300};
      text-decoration: underline;
    }
  }

  & span.akActionMark {
    cursor: pointer;
  }

  ${blockquoteSharedStyles};
  ${headingsSharedStyles};
  ${panelSharedStyles};
  ${ruleSharedStyles};
  ${paragraphSharedStyles};

  & .UnknownBlock {
    font-family: ${akFontFamily};
    font-size: ${akFontSizeDefault};
    font-weight: 400;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  & span.date-node {
    background: ${akColorN30A};
    border-radius: ${akBorderRadius};
    color: ${akColorN800};
    padding: 2px 4px;
    margin: 0 1px;
    transition: background 0.3s;
    white-space: nowrap;
  }

  & span.date-node-highlighted {
    background: ${akColorR50};
    color: ${akColorR500};
  }

  & ul {
    list-style-type: disc;

    & ul {
      list-style-type: circle;
    }

    & ul ul {
      list-style-type: square;
    }

    & ul ul ul {
      list-style-type: disc;
    }

    & ul ul ul ul {
      list-style-type: circle;
    }

    & ul ul ul ul ul {
      list-style-type: square;
    }
  }

  & ol {
    list-style-type: decimal;

    & ol {
      list-style-type: lower-alpha;
    }

    & ol ol {
      list-style-type: lower-roman;
    }

    & ol ol ol {
      list-style-type: decimal;
    }

    & ol ol ol ol {
      list-style-type: lower-alpha;
    }

    & ol ol ol ol ol {
      list-style-type: lower-roman;
    }

    & ol ol ol ol ol ol {
      list-style-type: decimal;
    }

    & ol ol ol ol ol ol ol {
      list-style-type: lower-alpha;
    }

    & ol ol ol ol ol ol ol ol {
      list-style-type: lower-roman;
    }
  }

  & .akTaskList > ol,
  & .akDecisionList > ol {
    list-style-type: none;
    font-size: ${fontSize}px;
  }

  & .renderer-image {
    max-width: 100%;
    display: block;
    margin: ${akGridSizeUnitless * 3}px 0;
  }

  & div > .media-wrapped + .media-wrapped + *:not(.media-wrapped) {
    clear: both;
  }

  & .media-wrapped + div:not(.media-wrapped) {
    clear: both;
  }

  & .CodeBlock,
  & blockquote,
  & hr,
  & > div > div:not(.media-wrapped) {
    clear: both;
  }

  & .media-wrapped {
    & + h1,
    & + h2,
    & + h3,
    & + h4,
    & + h5,
    & + h6 {
      margin-top: 8px;
    }
  }

  ${mediaSingleSharedStyle} & .wrap-left + .wrap-right,
  & .wrap-right + .wrap-left {
    margin-left: 0;
    margin-right: 0;
  }

  ${tableSharedStyle} & .table-container {
    transition: all 0.1s linear;
    overflow-x: auto;
    table {
      margin-left: 0;
      margin-right: 0;
    }
  }

  /*
   * We wrap CodeBlock in a grid to prevent it from overflowing the container of the renderer.
   * See ED-4159.
   */
  & .CodeBlock {
    max-width: 100%;
    /* -ms- properties are necessary until MS supports the latest version of the grid spec */
    /* stylelint-disable value-no-vendor-prefix, declaration-block-no-duplicate-properties */
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: auto 1fr;
    /* stylelint-enable */

    grid-template-columns: minmax(0, 1fr);

    & > span {
      /* stylelint-disable value-no-vendor-prefix */
      -ms-grid-row: 1;
      -ms-grid-column: 2;
      /* stylelint-enable */
      grid-column: 1;
    }
  }

  & .ApplicationCard,
  & .MediaGroup,
  & .CodeBlock {
    margin-top: ${blockNodesVerticalMargin};

    &:first-child {
      margin-top: 0;
    }
  }

  & .Extension-wide,
  & .Extension-full-width {
    margin-left: 50%;
    transform: translateX(-50%);
  }

  ${columnLayoutSharedStyle};
  & [data-layout-type] {
    margin-top: ${akGridSizeUnitless * 2.5}px;
    & > div + div {
      margin-left: ${akGridSizeUnitless * 4}px;
    }
  }
`;
