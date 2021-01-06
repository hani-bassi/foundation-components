import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-search.js';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import '@brightspace-ui/core/components/list/list.js';
import '../../list/d2l-activity-usage-list-item.js';
import { css, LitElement } from 'lit-element/lit-element.js';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import { LocalizeCollectionAdd } from './lang/localize-collection-add.js';
import { repeat } from 'lit-html/directives/repeat';

const rels = Object.freeze({
	activityUsage: 'https://activities.api.brightspace.com/rels/activity-usage',
	item: 'item'
});

const KEYCODES = Object.freeze({
	space: 32,
	enter: 13
});

class ActivityEditorCollectionAdd extends LocalizeCollectionAdd(HypermediaStateMixin(LitElement)) {
	static get properties() {
		return {
			items: { observable: observableTypes.subEntities, rel: rels.item },
			startAddExisting: { observable: observableTypes.summonAction, name: 'start-add-existing-activity' },
			startAddExistingNext: { observable: observableTypes.summonAction, name: 'next', route: [
				{ observable: observableTypes.summonAction, name: 'start-add-existing-activity' }
			] },
			startAddExistingSearch: { observable: observableTypes.summonAction, name: 'search', route: [
				{ observable: observableTypes.summonAction, name: 'start-add-existing-activity' }
			] },
			_candidates: { type: Array },
			_dialogOpened: { type: Boolean },
			_isLoadingMore: { type: Boolean },
			_selectionCount: { type: Number }
		};
	}

	constructor() {
		super();
		this._currentSelection = {};
		this._dialogOpened = false;
	}

	render() {
		const renderCandidates = () => {
			if (!this._candidates || this._candidates.length <= 0) {
				return html`
					<div class="d2l-activity-collection-no-activity d2l-body-standard">
						${this.localize('list.noActivitiesFound')}
					</div>`;
			}
			return html`
				<d2l-list grid @d2l-list-selection-change="${this._onSelectionChange}">
				${repeat(this._candidates, (candidate) => candidate.activityUsageHref, candidate => html`
					<d2l-activity-usage-list-item
							href="${candidate.activityUsageHref}"
							.token="${this.token}"
							selectable
							?already-added="${candidate.alreadyAdded}"
							?disabled="${candidate.alreadyAdded}"
							?selected="${candidate.alreadyAdded || this._currentSelection[candidate.properties.actionState]}"
							key="${candidate.alreadyAdded ? ifDefined(undefined) : candidate.properties.actionState}"></d2l-activity-usage-list-item>
					`)}
				</d2l-list>`;
		};
		const renderLoadMoreButton = () => {
			if (this._hasAction('startAddExistingNext') && !this._isLoadingMore) {
				return html`<d2l-button @click="${this._onLoadMoreClick}">${this.localize('button.loadMore')}</d2l-button>`;
			} else if (this._isLoadingMore) {
				return html`<d2l-loading-spinner size="85"></d2l-loading-spinner>`;
			}
			return null;
		};

		return html`
			<d2l-button primary @click="${this._onAddActivityClick}">${this.localize('button.addActivity')}</d2l-button>

			<div class="dialog-div">
				<d2l-dialog id="dialog" ?opened="${this._dialogOpened}" title-text="${this.localize('dialog.browseActivityLibrary')}" @d2l-dialog-close="${this._onCloseDialog}">
					<div class="d2l-add-activity-dialog" aria-live="polite" aria-busy="${!this._candidates}">
						<div class="d2l-add-activity-dialog-header">
							<div>
								<d2l-input-search label="${this.localize('label.search')}" placeholder="${this.localize('input.searchPlaceholder')}" @d2l-input-search-searched="${() => {}}"></d2l-input-search>
							</div>
							<div class="d2l-add-activity-dialog-selection-count">${this._selectionCount > 0 ? html`
									${this.localize('dialog.selected', 'count', this._selectionCount)}
									<d2l-link
										tabindex="0"
										role="button"
										@click=${this.clearSelected}
										@keydown="${this._onClearKeydown}">
											${this.localize('dialog.clearSelected')}
									</d2l-link>
								` : null }</div>
						</div>
						${renderCandidates()}
						<div class="d2l-add-activity-dialog-load-more">
							${renderLoadMoreButton()}
						</div>
					</div>
					<d2l-button slot="footer" primary dialog-action="add" @click="${this._onAddActivityCommit}" ?disabled="${!this._selectionCount}">${this.localize('button.add')}</d2l-button>
					<d2l-button slot="footer" dialog-action>${this.localize('button.cancel')}</d2l-button>
				</d2l-dialog>
			</div>
		`;
	}

	//todo: workaround until prime for summonAction is ready
	updated(changedProperties) {
		super.updated(changedProperties);
		if (!this._candidates && this._hasAction('startAddExisting')) {
			this._loadCandidates();
		}
	}

	clearSelected() {
		this._currentSelection = {};
		this._selectionCount = 0;
	}

	_addExtrasToCandidates(candidates) {
		for (const candidate of candidates) {
			candidate.activityUsageHref = candidate.links.find(link => link.rel.includes(rels.activityUsage)).href;
			candidate.alreadyAdded = this.items.findIndex(x => x.href === candidate.href) >= 0;
		}
		return candidates;
	}

	async _loadCandidates() {
		const summoned = await this.startAddExisting.summon();
		this._candidates = this._addExtrasToCandidates(summoned.entities);
	}

	_onAddActivityClick() {
		this._dialogOpened = true;
	}

	_onAddActivityCommit() {
		this.items.push(...this._selectedCandidates);
		this._selectedCandidates.forEach(x => x.alreadyAdded = true);
		this.clearSelected();
		// change the state's list of activities
		this._state.updateProperties({
			items: {
				observable: observableTypes.subEntities,
				rel: rels.item,
				value: this.items
			}
		});
	}
	_onClearKeydown(e) {
		switch (e) {
			case KEYCODES.enter:
			case KEYCODES.space:
				this.clearSelected();
				break;
		}
	}

	_onCloseDialog() {
		this._dialogOpened = false;
	}

	async _onLoadMoreClick() {
		this._isLoadingMore = true;
		const summoned = await this.startAddExistingNext.summon();
		const newCandidates = this._addExtrasToCandidates(summoned.entities);
		this._candidates.push(...newCandidates);
		this._isLoadingMore = false;
	}

	_onSelectionChange(e) {
		this._currentSelection[e.detail.key] = e.detail.selected;
		this._selectionCount = this._selectedCandidates.length;
	}

	get _selectedCandidates() {
		return this._candidates.filter((candidate) => this._currentSelection[candidate.properties.actionState]);
	}
}

customElements.define('d2l-activity-editor-collection-add', ActivityEditorCollectionAdd);
