import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css,  LitElement } from 'lit-element/lit-element.js';
import { customHypermediaElement, html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components.js';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';

const rels = Object.freeze({
	organization: 'https://api.brightspace.com/rels/organization'
});

class ActivityCodeEditorLearningPath extends LocalizeDynamicMixin(HypermediaStateMixin(LitElement)) {

	static get properties() {
		return {
			code: { type: String, observable: observableTypes.property, route: [{observable: observableTypes.link, rel: rels.organization}] },
			updateCode: { type: Object, observable: observableTypes.action, name: 'update-code', route: [{observable: observableTypes.link, rel: rels.organization}] }
		};
	}

	static get styles() {
		return [ inputLabelStyles, css`
			.d2l-activity-code-editor-description {
				font-size: 0.7rem;
				line-height: 1rem;
				font-weight: 400; /* normal */
				letter-spacing: 0.013rem;
				color: var(--d2l-color-tungsten);
				margin-bottom: 0.3rem;
			}
		` ];
	}

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`./lang/${lang}.js`)).default
		};
	}

	constructor() {
		super();
		this.defaultLearningPathCode = 'LP';
	}

	render() {
		return html`
			<div class="d2l-input-label">
				<span aria-hidden="true">${this.localize('label-code-lp')}</span>
				<div class="d2l-activity-code-editor-description" aria-hidden="true">${this.localize('text-code-description-lp')}</div>
			</div>
			<d2l-input-text
				label="textfield ${this.localize('label-code-lp')}"
				description="${this.localize('text-code-description-lp')}"
				label-hidden
				@input="${this._onInputCode}"
				value="${this.code}"
				?skeleton="${!this._loaded}"
				maxlength=50
			></d2l-input-text>
		`;
	}

	_onInputCode(e) {
		if (this._hasAction('updateCode')) {
			const code = e.target.value.trim();
			if (code === '') {
				// use default code value from the action
				this.updateCode.commit();
			}
			this.updateCode.commit({code: { observable: observableTypes.property, value: code} });
		}
	}

}

customHypermediaElement(
	'd2l-activity-code-editor-learning-path',
	ActivityCodeEditorLearningPath,
	'd2l-activity-code-editor',
	[['activity-usage'], ['learning-path']]
);
