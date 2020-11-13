import { Classes, Rels } from 'siren-sdk/src/hypermedia-constants';
import { css, LitElement } from 'lit-element/lit-element.js';
import { customHypermediaElement, html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { ifDefined } from 'lit-html/directives/if-defined';

class ActivityDueDate extends HypermediaStateMixin(LitElement) {
	static get properties() {
		return {
			dates: {
				type: Array,
				observable: observableTypes.subEntities,
				rel: Rels.date
			},
			//format: { type: String, attribute: 'format' },
			//includeTime: { type: Boolean, attribute: 'include-time' }
			// items: { type: Array, observable: observableTypes.subEntities, rel: rels.item, route: [{observable: observableTypes.link, rel: rels.collection}] }
		};
	}

	static get styles() {
		return [ css`` ];
	}

	constructor() {
		super();
		this.dates = [];
		this.format = undefined;
		this.includeTime = false;
	}

	render() {
		console.log(this.dates);
		return html`
		${this.dates}
		`;
	}
}

customElements.define('d2l-activity-due-date', ActivityDueDate);
