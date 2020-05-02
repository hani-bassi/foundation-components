import { html, LitElement } from 'lit-element/lit-element.js';
import { HypermediaLitMixin, observableTypes } from '../../../framework/hypermedia-lit-mixin.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import './d2l-activity-item-course.js'
import { ParentLitMixin } from '../../../framework/parent-lit-mixin.js';

const rels = Object.freeze({
	activityUsage: 'https://activities.api.brightspace.com/rels/activity-usage'
});

class ActivityItem extends ParentLitMixin(HypermediaLitMixin(LitElement)) {
	static get properties() {
		return {
			classes: { type: Array, observable: observableTypes.classes, route: [{observable: observableTypes.link, rel: rels.activityUsage}]}
		};
	}

	static get components() {
		return {
			course: {
				type: 'course-offering',
				component: ({href, token}) => html`<d2l-activity-item-course href="${href}" .token="${token}"></d2l-activity-item-course>`
			}
		};
	}

	constructor() {
		super();
		this.classes = [];
	}

	render() {
		return html`
			${this._renderComponent(this.classes, {href: this.href, token: this.token})}
		`;
	}
}
customElements.define('d2l-activity-item', ActivityItem);

