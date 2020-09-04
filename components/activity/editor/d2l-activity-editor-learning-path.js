import '../name/d2l-activity-name.js';
import '../description/d2l-activity-description.js';
import '../type/d2l-activity-type.js';
import '../../activity-collection/editor/d2l-activity-collection-editor.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { HypermediaLitMixin, observableTypes } from '../../../framework/hypermedia-lit-mixin.js';
import { customHypermediaElement } from '../../../framework/hypermedia-components.js';
import { ifDefined } from 'lit-html/directives/if-defined';

const rels = Object.freeze({
	collection: 'https://activities.api.brightspace.com/rels/activity-collection'
});

class ActivityEditorLearningPath extends HypermediaLitMixin(LitElement) {
	static get properties() {
		return {
			_activityCollectionHref: { type: String, observable: observableTypes.link, rel: rels.collection }
		};
	}

	static get styles() {
		return [ css`
			* {
				display: block;
			}
		` ];
	}

	render() {
		return html`
			<d2l-activity-name href="${this.href}" .token="${this.token}"></d2l-activity-name>
			<d2l-activity-description href="${this.href}" .token="${this.token}"></d2l-activity-description>
			<d2l-activity-type href="${this.href}" .token="${this.token}"></d2l-activity-type>
			<d2l-activity-collection-editor href="${ifDefined(this._activityCollectionHref)}" .token="${this.token}"></d2l-activity-collection-editor>
		`;
	}

}

customHypermediaElement('d2l-activity-editor-learning-path', ActivityEditorLearningPath, 'd2l-activity-editor', [['activity-usage', 'learning-paths']]);
