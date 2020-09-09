import './d2l-acitivity-editor-main-lp.js';

import { customHypermediaElement, html } from '../../../framework/hypermedia-components.js';
import { HypermediaLitMixin } from '../../../framework/hypermedia-lit-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';

class ActivityEditorMain extends HypermediaLitMixin(LitElement) {

	render() {
		return html`
			Main
		`;
	}
}

customHypermediaElement('d2l-activity-editor-main', ActivityEditorMain, 'd2l-activity-editor-main');
