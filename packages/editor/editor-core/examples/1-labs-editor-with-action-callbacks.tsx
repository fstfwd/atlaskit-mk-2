import * as React from 'react';
import Editor from './../src/labs/EditorWithActions';
import { EditorContext } from '../src';
import { IntlProvider } from 'react-intl';

export default function Example() {
  return (
    <EditorContext>
      <IntlProvider locale="en">
        <Editor
          appearance="comment"
          quickInsert={true}
          onSave={actions =>
            actions
              .getValue()
              .then(value => alert(JSON.stringify(value, null, 2)))
          }
          onCancel={actions => actions.clear()}
        />
      </IntlProvider>
    </EditorContext>
  );
}
