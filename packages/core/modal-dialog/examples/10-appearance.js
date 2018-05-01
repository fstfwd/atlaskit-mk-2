// @flow
import React, { PureComponent } from 'react';
import Lorem from 'react-lorem-component';
import Button, { ButtonGroup } from '@atlaskit/button';
import Modal from '../src';

const appearances = ['warning', 'danger'];

export default class ExampleBasic extends PureComponent<
  {},
  { isOpen: string | null },
> {
  state = { isOpen: null };
  open = (isOpen: string) => this.setState({ isOpen });
  close = (isOpen: string) => this.setState({ isOpen });
  // flowlint-next-line unclear-type:off
  secondaryAction = ({ target }: Object) => console.log(target.innerText);

  render() {
    const { isOpen } = this.state;
    const actions = [
      { text: 'Close', onClick: this.close },
      { text: 'Secondary Action', onClick: this.secondaryAction },
    ];

    return (
      <div>
        <ButtonGroup>
          {appearances.map(name => (
            <Button onClick={() => this.open(name)}>Open: {name}</Button>
          ))}
        </ButtonGroup>

        {appearances.filter(a => a === isOpen).map(name => (
          <Modal
            actions={actions}
            appearance={name}
            onClose={this.close}
            heading={`Modal: ${name}`}
          >
            <Lorem count={2} />
          </Modal>
        ))}
      </div>
    );
  }
}
