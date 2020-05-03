import { html, LitElement } from 'lit-element/lit-element.js';
import { renderHypermediaComponent } from '../../../framework/hypermedia-components.js';
import '../name/d2l-activity-name.js';


class ActivityEditor extends LitElement {
	static get properties() {
		return {
			href: { type: String, reflect: true },
			token: { type: String }
		};
	}
	constructor() {
		super();
	}

	render() {
		return html`
			${renderHypermediaComponent('d2l-activity-name', this.href, this.token)}
		`;
	}
}
customElements.define('d2l-activity-editor', ActivityEditor);
