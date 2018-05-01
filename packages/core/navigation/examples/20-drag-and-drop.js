// @flow

import React, { Component } from 'react';
import styled, { injectGlobal } from 'styled-components';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';

import Navigation, { AkNavigationItem } from '../src';

const Container = styled.div`
  display: flex;
`;

// flowlint-next-line unclear-type:off
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  // make a shallow copy so we do not modify the original array
  // flowlint-next-line unclear-type:off
  const result: any[] = Array.from(list);

  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const isDraggingClassName = 'isdragging';

type Item = {|
  id: string,
  content: string,
|};

const getItems = (count: number): Item[] =>
  Array.from({ length: count }, (v, k) => k).map((val: number): Item => ({
    id: `${val}`,
    content: `item ${val}`,
  }));

type State = {
  items: Item[],
};

export default class NavigationWithDragAndDrop extends Component<void, State> {
  state = {
    items: getItems(10),
  };

  componentDidMount() {
    // eslint-disable-next-line no-unused-expressions
    injectGlobal`
      body.${isDraggingClassName} {
        cursor: grabbing;
        user-select: none;
      }
    `;
  }

  onDragStart = () => {
    if (document.body) {
      document.body.classList.add(isDraggingClassName);
    }
  };

  // flowlint-next-line unclear-type:off
  onDragEnd = (result: Object) => {
    if (document.body) {
      document.body.classList.remove(isDraggingClassName);
    }

    const source = result.source;
    const destination = result.destination;

    if (destination == null) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      console.error('unsupported use case');
      return;
    }

    const items: Item[] = reorder(
      this.state.items,
      source.index,
      destination.index,
    );

    this.setState({
      items,
    });
  };

  renderContainerItems = () => {
    return this.state.items.map((item: Item, index) => (
      <Draggable draggableId={item.id} index={index} key={item.id}>
        {(provided, snapshot) => (
          <div>
            <AkNavigationItem
              isDragging={snapshot.isDragging}
              onClick={() => console.log(`clicking on ${item.content}`)}
              text={item.content}
              dnd={provided}
            />
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    ));
  };

  renderContainerContent = () => {
    const containerItems = this.renderContainerItems();
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="list">
          {dropProvided => (
            <div ref={dropProvided.innerRef}>{containerItems}</div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  render() {
    return (
      <Container>
        <Navigation>{this.renderContainerContent()}</Navigation>
      </Container>
    );
  }
}
