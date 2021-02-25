
import '@brightspace-ui-labs/accordion/accordion-collapse.js';
import './d2l-activity-editor-secondary-card.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { customHypermediaElement } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components.js';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles.js';

class ActivityEditorLearningPathCard extends LitElement {

	static get properties() {
		return {
			titleText: { type: String, attribute: 'title-text' },
			bodyText: { type: String, attribute: 'body-text' },
			collapsable: { type: Boolean }
		};
	}

	static get styles() {
		return [labelStyles, css`
			:host([hidden]) {
				display: none;
			}
		`];
	}

	render() {
		return html`
		<d2l-activity-secondary-card title-text="Additional Identification">
		</d2l-activity-secondary-card>`;
	}
}

customHypermediaElement('d2l-activity-card-learning-path', ActivityEditorLearningPathCard);