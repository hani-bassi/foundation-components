import { html, LitElement } from 'lit-element/lit-element.js';
import './d2l-activity-editor-learning-path.js';
import { HypermediaLitMixin, observableTypes } from '../../../framework/hypermedia-lit-mixin.js';
import { ParentLitMixin } from '../../../framework/parent-lit-mixin.js';


class ActivityEditor extends ParentLitMixin(HypermediaLitMixin(LitElement)) {
	static get properties() {
		return {
			classes: { type: Array, observable: observableTypes.classes }
		};
	}

	static get components() {
		return {
			learningPaths: {
				type: 'learning-path',
				component: ({href, token}) => html`<d2l-activity-editor-learning-path href="${href}" .token="${token}"></d2l-activity-editor-learning-path>`,
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
			${this._renderComponent(this.classes, {href: this.href, token: this.token})}
		`;
	}
}
customElements.define('d2l-activity-editor', ActivityEditor);
