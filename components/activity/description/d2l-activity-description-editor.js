import '../../common/d2l-hc-description.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, LitElement } from 'lit-element/lit-element.js';
import { customHypermediaElement, html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components.js';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';

const rels = Object.freeze({
	specialization: 'https://api.brightspace.com/rels/specialization'
});

class ActivityDescriptionEditor extends HypermediaStateMixin(LitElement) {

	static get properties() {
		return {
			description: { type: String, observable: observableTypes.property, route: [{observable: observableTypes.link, rel: rels.specialization}],
				hasChanged: () => true},
			updateDescription: { type: Object, observable: observableTypes.action, name: 'update-description',
				route: [{observable: observableTypes.link, rel: rels.specialization}]
			}
		};
	}

	static get styles() {
		return [ inputLabelStyles, inputStyles,
			css`
			@media (max-width: 615px) {
				textarea.d2l-input {
					height: 100px;
				}
			}

			textarea.d2l-input {
				resize: none;
			}
			`
		];
	}

	render() {
		return this.updateDescription.has ? html`
		<label>
			<span class="d2l-input-label">Description</span>
			<textarea class="d2l-input"
				@input="${this._onInputDescription}"
				placeholder="Write a description"
				.value="${this.description}"
			>${this.description ? this.description : ''}</textarea>
		</label>
		` : null;
	}

	_onInputDescription(e) {
		if (this.updateDescription.has) {
			this.updateDescription.commit({description: { observable: observableTypes.property, value: e.target.value} });
		}
	}

}

customHypermediaElement('d2l-activity-description-editor', ActivityDescriptionEditor);
