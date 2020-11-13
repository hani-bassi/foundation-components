import '@brightspace-ui/core/components/icons/icon';
import { css, LitElement } from 'lit-element/lit-element';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin';
import { Classes, Rels } from 'siren-sdk/src/hypermedia-constants';
import { html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components';

class GroundUp extends HypermediaStateMixin(LitElement) {

	static get properties() {
		return {
			dates: { type: Array,
				observable: observableTypes.subEntities,
				rel: Rels.date
			}
			//dates: { type: Array, observable: observableTypes.subEntities, rel: Rels.date },
			// items: { type: Array, observable: observableTypes.subEntities, rel: rels.item, route: [{observable: observableTypes.link, rel: rels.collection}] }

		};
	}

	static get styles() {
		return [ css`` ];
	}

	constructor() {
		super();
		this.dates = [];
	}

	render() {
		console.log(this.dates);
		return html`
			${this.dates}
		`;
	}
}

customElements.define('ground-up', GroundUp);
