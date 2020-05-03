import { css, html, LitElement } from 'lit-element/lit-element.js';
import { HypermediaLitMixin, observableTypes } from '../../../framework/hypermedia-lit-mixin.js';
import { customHypermediaElement } from '../../../framework/hypermedia-components.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import '../../common/d2l-hm-name.js'

const rels = Object.freeze({
	specialization: 'https://api.brightspace.com/rels/specialization'
});

class ActivityNameLearningPath extends HypermediaLitMixin(LitElement) {
	static get properties() {
		return {
			_specalizationHref: { type: String, observable: observableTypes.link, rel: rels.specialization }
		};
	}

	static get styles() {
		return [ css`` ];
	}

	render() {
		return html`
			<d2l-hm-name href="${ifDefined(this._specalizationHref)}" .token="${this.token}"></d2l-hm-name>
		`;
	}

}

customHypermediaElement('d2l-activity-name-learning-path', ActivityNameLearningPath, 'd2l-activity-name', [['activity-usage', 'learning-path']]);
