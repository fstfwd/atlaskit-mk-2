import * as React from 'react';
import RendererDemo from './helper/RendererDemo';

export default function Example() {
  return (
    <RendererDemo
      withProviders={true}
      disableLargeEmojis={true}
      serializer="react"
    />
  );
}