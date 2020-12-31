
import '@brightspace-ui/core/components/list/list.js';
import '../../list/d2l-activity-list-item-accumulator.js';
import './d2l-activity-editor-collection-add.js';

import { css, LitElement } from 'lit-element/lit-element.js';
import { customHypermediaElement, html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components.js';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { repeat } from 'lit-html/directives/repeat';

const rels = Object.freeze({
	collection: 'https://activities.api.brightspace.com/rels/activity-collection',
	item: 'item'
});

class ActivityEditorMainCollection extends HypermediaStateMixin(LitElement) {

	static get properties() {
		return {
			items: { type: Array, observable: observableTypes.subEntities, rel: rels.item, route:
				[{ observable: observableTypes.link, rel: rels.collection }] },
			collectionHref: { observable: observableTypes.link, rel: rels.collection }
		};
	}

	static get styles() {
		return [ css`
			.d2l-activity-collection-body {
				margin: auto;
				max-width: 1230px;
				padding: 0 1.5rem;
			}
			.d2l-activity-collection-body-content {
				max-width: 820px;
				padding: 0 0.35rem;
			}
			.d2l-activity-collection-activities {
				margin: 0 -1.5rem;
				max-width: 881px;
				padding: 0 0.05rem;
			}
			.d2l-activity-collection-list-actions {
				align-items: baseline;
				display: flex;
				justify-content: space-between;
				margin: 0.9rem 0;
				max-width: 820px;
				position: relative;
			}
		`];
	}

	constructor() {
		super();
		this.items = [];
	}

	render() {
		return html`
			<div class="d2l-activity-collection-body">
				<div class="d2l-activity-collection-body-content">
					<div class="d2l-activity-collection-list-actions">
						<d2l-activity-editor-collection-add href="${this.collectionHref}" .token="${this.token}">
						</d2l-activity-editor-collection-add>
						<div class="d2l-body-compact">Activities: ${this.items.length}</div>
					</div>
				</div>
				<div class="d2l-activity-collection-activities">
					<d2l-list @d2l-list-item-position-change="${this._moveItems}">
						${repeat(
							this.items,
							item => item.href || item.properties.actionState,
							item => html`
								<d2l-activity-list-item-accumulator
									href="${item.href || item.activityUsageHref}"
									.token="${this.token}"
									draggable
									key="${item.properties.id || item.properties.actionState}"></d2l-activity-list-item-accumulator>
							`
						)}
					</d2l-list>
				</div>
			</div>
		`;
	}

	_moveItems(e) {
		e.detail.reorder(this.items, { keyFn: (item) => item.properties.id || item.properties.actionState });
		this.requestUpdate('items', []);
	}
}

customHypermediaElement('d2l-activity-editor-main-collection', ActivityEditorMainCollection, 'd2l-activity-editor-main', [['activity-collection'], ['learning-path']]);
