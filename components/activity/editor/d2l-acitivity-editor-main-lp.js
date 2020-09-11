import { customHypermediaElement, html } from '../../../framework/hypermedia-components.js';
import { HypermediaLitMixin } from '../../../framework/hypermedia-lit-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';

class ActivityEditorMainLP extends HypermediaLitMixin(LitElement) {

	render() {
		return html`
			ANOTHER MAIN
		`;
	}
}

customHypermediaElement('d2l-activity-editor-main-lp', ActivityEditorMainLP, 'd2l-activity-editor-main', [['learning-path']]);
