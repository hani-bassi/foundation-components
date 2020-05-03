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
			'learning-path': html`Learning Path`,
			'course-offering': html`Course`,
			default: html`Activity`
		};
	}

	constructor() {
		super();
		this.classes = [];
	}

	render() {
		let type = ActivityType.components.default;
		this.classes.some(hmClass => {
			if (!ActivityType.components[hmClass]) return;
			type = ActivityType.components[hmClass];
			return true;
		})
		return html`
			${type}
		`;
	}
}
customElements.define('d2l-activity-type', ActivityType);
