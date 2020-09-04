import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '../name/d2l-activity-name.js';
import '../type/d2l-activity-type.js';
import '../image/d2l-activity-image.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { HypermediaLitMixin, observableTypes } from '../../../framework/hypermedia-lit-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined';

const rels = Object.freeze({
	activityUsage: 'https://activities.api.brightspace.com/rels/activity-usage'
});

class ActivityItem extends HypermediaLitMixin(LitElement) {
	static get properties() {
		return {
			_activityHref: { type: String, observable: observableTypes.link, rel: rels.activityUsage }
		};
	}

	static get styles() {
		return [ css`` ];
	}

	render() {
		return html`
			<d2l-list-item>
				<d2l-activity-image slot="illustration" href="${ifDefined(this._activityHref)}" .token="${this.token}"></d2l-activity-image>
				<d2l-list-item-content> <!-- This would actually be unique to the type -->
					<d2l-activity-name href="${ifDefined(this._activityHref)}" .token="${this.token}"></d2l-activity-name>
					<d2l-activity-type href="${ifDefined(this._activityHref)}" .token="${this.token}" slot="supporting-info"></d2l-activity-type>
				</d2l-list-item-content>
			</d2l-list-item>
		`;
	}
}
customElements.define('d2l-activity-item', ActivityItem);

