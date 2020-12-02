import '../../common/d2l-hc-description.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { customHypermediaElement, html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components.js';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { LitElement } from 'lit-element/lit-element.js';

const rels = Object.freeze({
	specialization: 'https://api.brightspace.com/rels/specialization'
});

class ActivityDescriptionEditor extends HypermediaStateMixin(LitElement) {
	static get properties() {
		return {
			description: { type: String, observable: observableTypes.property },
			updateDescription: { type: Object, observable: observableTypes.action, name: 'update-description',
				route: [{observable: observableTypes.link, rel: rels.specialization}]
			}
		};
	}

	render() {
		return this.updateDescription.has ? html`
			<d2l-input-text
				@input="${this._onInputDescription}"
				label="Description"
				placeholder="Enter a description"
				value="${this.description ? this.description : ''}"
			></d2l-input-text>
		` : null;
	}

	_onInputDescription(e) {
		if (this.updateDescription.has) {
			console.log('input description');
			this.updateDescription.commit({description: { observable: observableTypes.property, value: e.target.value} });
		}
	}

}

customHypermediaElement('d2l-activity-description-editor', ActivityDescriptionEditor);
