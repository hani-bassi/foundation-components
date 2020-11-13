import { css, LitElement } from 'lit-element/lit-element.js';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components.js';
import { Rels } from 'siren-sdk/src/hypermedia-constants';

class ActivityCourseName extends HypermediaStateMixin(LitElement) {
	static get properties() {
		return {
			name: {
				type: String,
				observable: observableTypes.property,
				route: [{
					observable: observableTypes.link,
					rel: Rels.organization
				}]
			}
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

customElements.define('d2l-activity-course-name', ActivityCourseName);
