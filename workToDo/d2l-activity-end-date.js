import { Classes, Rels } from 'siren-sdk/src/hypermedia-constants';
import { css, LitElement } from 'lit-element/lit-element.js';
import { customHypermediaElement, html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { ifDefined } from 'lit-html/directives/if-defined';

class ActivityEndDate extends HypermediaStateMixin(LitElement) {
	static get properties() {
		return {
			date: {
				type: String,
				observable: observableTypes.property,
				route: [{
					observable: observableTypes.subEntity,
					rel: Rels.date
				}]
			},
			format: { type: String, attribute: 'format' },
			includeTime: { type: Boolean, attribute: 'include-time' }
		};
	}

	static get styles() {
		return [ css`` ];
	}

	constructor() {
		super();
		this.classes = [];
		this.format = undefined;
		this.includeTime = false;
	}

	render() {
		return html`
			<d2l-hm-date
				date="${this.date}"
				format=${ifDefined(this.format)}
				include-time=${(this.includeTime)}>
			</d2l-hm-date>
		`;
	}
}

customHypermediaElement('d2l-activity-end-date', ActivityEndDate, 'd2l-activity-date', [['end-date', 'date']]);
