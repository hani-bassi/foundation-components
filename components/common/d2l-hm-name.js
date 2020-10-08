import { css, LitElement } from 'lit-element/lit-element.js';
import { HypermediaLitMixin, observableTypes } from 'foundation-engine/framework/hypermedia-lit-mixin.js';
import { html } from 'foundation-engine/framework/hypermedia-components.js';

class HmName extends HypermediaLitMixin(LitElement) {
	static get properties() {
		return {
			name: { type: String, observable: observableTypes.property }
		};
	}

	static get styles() {
		return [ css`` ];
	}

	render() {
		return html`
			${this.name}
		`;
	}

}
customElements.define('d2l-hm-name', HmName);
