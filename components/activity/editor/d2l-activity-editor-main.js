import { html } from '../../../framework/hypermedia-components.js';
import { HypermediaLitMixin } from '../../../framework/hypermedia-lit-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';

class ActivityEditorMain extends HypermediaLitMixin(LitElement) {

	render() {
		return html`
			Main
		`;
	}
}

customElements.define('d2l-activity-editor-main', ActivityEditorMain);
