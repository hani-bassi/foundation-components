import '@brightspace-ui/core/components/list/list.js';
import '../../activity/item/d2l-activity-item.js';
import '../../common/d2l-hm-description.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { HypermediaLitMixin, observableTypes} from '../../../framework/hypermedia-lit-mixin.js';

const rels = Object.freeze({
	specialization: 'https://api.brightspace.com/rels/specialization',
	item: 'item'
});

class CollectionEditor extends HypermediaLitMixin(LitElement) {
	static get properties() {
		return {
			items: { type: Array, observable: observableTypes.subEntities, rel: rels.item }
		};
	}

	static get styles() {
		return [ css`` ];
	}

	constructor() {
		super();
		this.items = [];
	}

	render() {
		return html`
			<d2l-list>
				${this.items.map(href => html`<d2l-activity-item href="${href}" .token="${this.token}"></d2l-activity-item>`)}
			</d2l-list>
		`;
	}

}
customElements.define('d2l-activity-collection-editor', CollectionEditor);
