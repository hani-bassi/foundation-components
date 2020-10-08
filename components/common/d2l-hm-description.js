import { css, LitElement } from 'lit-element/lit-element.js';
import { HypermediaLitMixin, observableTypes} from 'foundation-engine/framework/hypermedia-lit-mixin.js';
import { html } from 'foundation-engine/framework/hypermedia-components.js';

class HmDescription extends HypermediaLitMixin(LitElement) {
	static get properties() {
		return {
			description: { type: String, observable: observableTypes.property }
		};
	}

	static get styles() {
		return [ css`` ];
	}

	render() {
		return html`
			${this.description}
		`;
	}

}
customElements.define('d2l-hm-description', HmDescription);
