import * as React from 'react';
import * as PropTypes from 'prop-types';
import { openHelpCommand } from '../../plugins/help-dialog';
import { analyticsService } from '../../analytics';
import { analyticsEventKey } from '../../analytics';

export default class WithHelpTrigger extends React.Component<any, any> {
  static contextTypes = {
    editorActions: PropTypes.object.isRequired,
  };

  openHelp = () => {
    analyticsService.trackEvent('atlassian.editor.help.button');
    const eventDispatcher = this.context.editorActions._privateGetEventDispatcher();
    if (eventDispatcher) {
      eventDispatcher.emit(analyticsEventKey, {
        action: 'opened',
        actionSubject: 'button',
        actionSubjectId: 'helpButton',
        attributes: { inputMethod: 'toolbar' },
      });
    }

    const editorView = this.context.editorActions._privateGetEditorView();
    if (editorView) {
      openHelpCommand(editorView.state.tr, editorView.dispatch);
    }
  };

  render() {
    return this.props.render(this.openHelp);
  }
}
