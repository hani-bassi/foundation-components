import { html, LitElement } from 'lit-element/lit-element.js';
import { HypermediaLitMixin, observableTypes } from '../../../framework/hypermedia-lit-mixin.js';
import { ParentLitMixin } from '../../../framework/parent-lit-mixin.js';


class ActivityType extends ParentLitMixin(HypermediaLitMixin(LitElement)) {
	static get properties() {
		return {
			classes: { type: Array, observable: observableTypes.classes }
		};
	}

	static get components() {
		return {
			learningPaths: {
				type: 'learning-path',
				component: () => html`Learning Path`
			},
			course: {
				type: 'course-offering',
				component: () => html`Course`
			},
			default: {
				component: () => html`Activity`,
				default: true
			}
		};
	}

	constructor() {
		super();
		this.classes = [];
	}

	render() {
		return html`
			${this._renderComponent(this.classes)}
		`;
	}
}
customElements.define('d2l-activity-type', ActivityType);
