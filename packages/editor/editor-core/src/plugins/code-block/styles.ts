// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import {
  akColorN20,
  akBorderRadius,
  akColorN300,
  akColorN800,
} from '@atlaskit/util-shared-styles';
import { blockNodesVerticalMargin } from '@atlaskit/editor-common';
import { akEditorCodeFontFamily, akEditorCodeBlockPadding } from '../../styles';

export const codeBlockStyles = css`
  .ProseMirror .code-block {
    font-family: ${akEditorCodeFontFamily};
    background: ${akColorN20};
    border-radius: ${akBorderRadius};
    font-size: 14px;
    line-height: 24px;
    margin: ${blockNodesVerticalMargin} 0 0 0;
    counter-reset: line;
    display: flex;

    .line-number-gutter {
      color: ${akColorN300};
      background-color: rgba(9, 30, 66, 0.04);
      text-align: right;
      user-select: none;
      padding: ${akEditorCodeBlockPadding} 8px;
      border-radius: ${akBorderRadius};
      font-size: 12px;
      line-height: 24px;

      span {
        display: block;

        &::before {
          counter-increment: line;
          content: counter(line);
          display: inline-block;
        }
      }
    }

    .code-content {
      padding: ${akEditorCodeBlockPadding} 16px;
      color: ${akColorN800};
      overflow: auto;
      display: flex;
      flex: 1;

      pre {
        width: 100%;
      }
      code {
        display: inline-block;
        min-width: 100%;
        tab-size: 4;
      }
    }

    /* We render this as a basic box in IE11 because it can't handle scrolling */
    &.ie11 {
      display: block;
      .line-number-gutter {
        display: none;
      }
      .code-content {
        display: block;
        overflow: visible;

        pre {
          width: auto;
        }
        code {
          display: inline;
        }
      }
    }
  }
`;
