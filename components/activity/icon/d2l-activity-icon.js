import '@brightspace-ui/core/components/icons/icon.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { HypermediaLitMixin, observableTypes } from 'foundation-engine/framework/lit/hypermedia-lit-mixin.js';
import { ParentLitMixin } from 'foundation-engine/framework/lit/parent-lit-mixin.js';

class ActivityIcon extends ParentLitMixin(HypermediaLitMixin(LitElement)) {
	static get properties() {
		return {
			classes: { type: Array, observable: observableTypes.classes }
		};
	}

	static get components() {
		return {
			'learning-path': html`<d2l-icon icon="tier1:exemption-add"></d2l-icon>`,
			'course-offering': html`<d2l-icon icon="tier1:course"></d2l-icon>`,
			default: html`<d2l-icon icon="tier1:quizing"></d2l-icon>`
		};
	}

	constructor() {
		super();
		this.classes = [];
	}

	render() {
		let icon = ActivityIcon.components.default;
		this.classes.some(hmClass => {
			if (!ActivityIcon.components[hmClass]) return;
			icon = ActivityIcon.components[hmClass];
			return true;
		});
		return html`
			${icon}
		`;
	}
}
customElements.define('d2l-activity-icon', ActivityIcon);
