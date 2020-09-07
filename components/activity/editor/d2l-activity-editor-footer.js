import { html } from '../../../framework/hypermedia-components.js';
import { HypermediaLitMixin } from '../../../framework/hypermedia-lit-mixin.js';
import { css, LitElement } from 'lit-element/lit-element.js';

class ActivityEditorFooter extends HypermediaLitMixin(LitElement) {

	static get styles() {
		return [css`
			:host {
				display: flex;
				justify-content: space-between;
			}
		`];
	}

	render() {
		return html`
			<div>Visibility and buttons</div>
			<div><slot name="save-status">Save status</slot></div>
		`;
	}
}

customElements.define('d2l-activity-editor-footer', ActivityEditorFooter);
