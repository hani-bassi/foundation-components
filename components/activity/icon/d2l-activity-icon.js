import { html, LitElement } from 'lit-element/lit-element.js';
import { HypermediaLitMixin, observableTypes } from '../../../framework/hypermedia-lit-mixin.js';
import { ParentLitMixin } from '../../../framework/parent-lit-mixin.js';
import '@brightspace-ui/core/components/icons/icon.js';

class ActivityIcon extends ParentLitMixin(HypermediaLitMixin(LitElement)) {
	static get properties() {
		return {
			classes: { type: Array, observable: observableTypes.classes }
		};
	}

	static get components() {
		return {
			learningPaths: {
				type: 'learning-path',
				component: () => html`<d2l-icon icon="tier1:exemption-add"></d2l-icon>`
			},
			course: {
				type: 'course-offering',
				component: () => html`<d2l-icon icon="tier1:course"></d2l-icon>`
			},
			default: {
				component: () => html`<d2l-icon icon="tier1:quizing"></d2l-icon>`,
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
customElements.define('d2l-activity-icon', ActivityIcon);
