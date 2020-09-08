import '../name/d2l-activity-name.js';
import '../description/d2l-activity-description.js';
import '../type/d2l-activity-type.js';
import { html } from '../../../framework/hypermedia-components.js';
import { LitElement } from 'lit-element/lit-element.js';

class ActivityEditor extends LitElement {
	static get properties() {
		return {
			href: { type: String, reflect: true },
			token: { type: String }
		};
	}

	render() {
		return html`
			<div style="border: 1px solid black"><d2l-activity-name href="${this.href}" .token="${this.token}"></d2l-activity-name></div>
			<d2l-activity-name href="${this.href}" .token="${this.token}"></d2l-activity-name>
			<d2l-activity-name href="${this.href}" .token="${this.token}"></d2l-activity-name>
			<d2l-activity-description href="${this.href}" .token="${this.token}"></d2l-activity-description>
			<d2l-activity-type href="${this.href}" .token="${this.token}"></d2l-activity-type>
		`;
	}
}
customElements.define('d2l-activity-editor', ActivityEditor);
