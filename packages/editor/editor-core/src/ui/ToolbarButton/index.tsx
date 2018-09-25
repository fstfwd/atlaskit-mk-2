import Tooltip from '@atlaskit/tooltip';
import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import { AkButton } from './styles';
import ToolbarContext from '../Toolbar/ToolbarContext';

export interface Props {
  className?: string;
  disabled?: boolean;
  hideTooltip?: boolean;
  href?: string;
  iconAfter?: ReactElement<any>;
  iconBefore?: ReactElement<any>;
  onClick?: (event: Event) => void;
  selected?: boolean;
  spacing?: 'default' | 'compact' | 'none';
  target?: string;
  theme?: 'dark';
  title?: string;
  titlePosition?: string;
  registerButton?: (ToolbarButton) => null;
}

class ToolbarButton extends PureComponent<Props, {}> {
  static defaultProps = {
    className: '',
  };

  private button;

  componentDidMount() {
    const { registerButton } = this.props;
    if (registerButton) {
      registerButton(this);
    }
  }

  render() {
    const button = (
      <ToolbarContext.Consumer>
        {value => (
          <AkButton
            tabIndex="0"
            appearance="subtle"
            ariaHaspopup={true}
            className={this.props.className}
            href={this.props.href}
            iconAfter={this.props.iconAfter}
            iconBefore={this.props.iconBefore}
            isDisabled={this.props.disabled}
            isSelected={this.props.selected}
            onClick={this.handleClick}
            spacing={this.props.spacing || 'default'}
            target={this.props.target}
            theme={this.props.theme}
            shouldFitContainer={true}
            innerRef={input => {
              // if (input !== null && value.selectedButton) {
              //   if (
              //     this.props.title === 'More formatting' &&
              //     value.selectedButtonIndex === 3
              //   ) {
              //     console.log('IN THE MORE FORMATTING');
              //     console.log(
              //       'selectedButtonIndex:',
              //       value.selectedButtonIndex,
              //     );
              //     console.log(
              //       'buttonsMatch:',
              //       buttonsMatch(value.selectedButton, this),
              //     );
              //   }
              // }
              if (
                input !== null &&
                value.selectedButton &&
                buttonsMatch(value.selectedButton, this)
              ) {
                console.log('SelectedButton:', value.selectedButton);
                console.log('this:', this);
                console.log('input:', input);
                console.log('FOCUS THE BUTTON :)');
                // input!.focus();
              }
            }}
          >
            {this.props.children}
          </AkButton>
        )}
      </ToolbarContext.Consumer>
    );

    const buttonsMatch = (button1, button2) =>
      button1.props.title &&
      button2.props.title &&
      button1.props.title === button2.props.title;

    const WrappedButton = (
      <div
        tabIndex={0}
        // onClick={e => console.log('AYYEEE', e)}
      >
        {button}
      </div>
    );

    // const button = (
    //   // <div tabIndex={0}>
    //   <AkButton
    //     // tabIndex="-1"
    //     appearance="subtle"
    //     ariaHaspopup={true}
    //     className={this.props.className}
    //     href={this.props.href}
    //     iconAfter={this.props.iconAfter}
    //     iconBefore={this.props.iconBefore}
    //     isDisabled={this.props.disabled}
    //     isSelected={this.props.selected}
    //     onClick={this.handleClick}
    //     spacing={this.props.spacing || 'default'}
    //     target={this.props.target}
    //     theme={this.props.theme}
    //     shouldFitContainer={true}
    //   >
    //     {this.props.children}
    //   </AkButton>
    //   // </div>
    // );

    const position = this.props.titlePosition || 'top';
    const tooltipContent = !this.props.hideTooltip ? this.props.title : null;

    return this.props.title ? (
      <Tooltip
        content={tooltipContent}
        hideTooltipOnClick={true}
        position={position}
      >
        {button}
        {/* {WrappedButton} */}
      </Tooltip>
    ) : (
      button
    );
  }

  // const MapElement = () => (
  //   <Context.Consumer>
  //     {context =>
  //       <BaseMapElement context={context} />
  //     }
  //   </Context.Consumer>
  // )

  private handleClick = (event: Event) => {
    const { disabled, onClick } = this.props;

    if (!disabled && onClick) {
      onClick(event);
    }
  };
}

export default props => (
  <ToolbarContext.Consumer>
    {value => (
      <ToolbarButton {...props} registerButton={value.registerButton} />
    )}
  </ToolbarContext.Consumer>
);
