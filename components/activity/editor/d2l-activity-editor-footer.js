import '@brightspace-ui/core/components/button/button.js';
import { customHypermediaElement } from '../../../framework/hypermedia-components.js';
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
			<div>Visibility editor
				<d2l-button primary>Save</d2l-button>
				<d2l-button>Cancel</d2l-button>
			</div>
			<div><slot name="save-status">Save status</slot></div>
		`;
	}
}

customHypermediaElement('d2l-activity-editor-footer', ActivityEditorFooter);
