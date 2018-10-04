//@flow
import type { Node } from 'react';
import type { ButtonProps, ButtonAppearances } from '@atlaskit/button';

export type NavigatorPropsType = {
  /** React node to render in the button, pass the text you want use to view on pagination button */
  children?: Node,
  /** Is the navigator disabled */
  isDisabled?: boolean,
  /** This function is called with the when user clicks on navigator */
  onClick?: Function,
  /** This will be passed in as ariaLabel to button. This is what screen reader will read */
  ariaLabel?: string,
  styles?: Object,
};

export type PagePropsType = $Diff<
  ButtonProps,
  {
    appearance?: ButtonAppearances,
    autoFocus: boolean,
    isDisabled: boolean,
    isLoading: boolean,
    spacing: 'compact' | 'default' | 'none',
    shouldFitContainer: boolean,
    type: 'button' | 'submit',
  },
>;
