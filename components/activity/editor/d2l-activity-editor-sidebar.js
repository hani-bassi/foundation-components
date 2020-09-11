import { css, LitElement } from 'lit-element/lit-element.js';
import { html } from '../../../framework/hypermedia-components.js';
import { HypermediaLitMixin } from '../../../framework/hypermedia-lit-mixin.js';

class ActivityEditorSidebar extends HypermediaLitMixin(LitElement) {

	static get styles() {
		return css`
			:host {
				background: var(--d2l-color-gypsum);
				display: block;
				height: 100%;
			}
		`;
	}

	render() {
		return html`
			Sidebar
		`;
	}
}

customElements.define('d2l-activity-editor-sidebar', ActivityEditorSidebar);
