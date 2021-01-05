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
import { repeat } from 'lit-html/directives/repeat';

const rels = Object.freeze({
	activityUsage: 'https://activities.api.brightspace.com/rels/activity-usage',
	item: 'item'
});

const KEYCODES = Object.freeze({
	space: 32,
	enter: 13
});

class ActivityEditorCollectionAdd extends HypermediaStateMixin(LitElement) {
	static get properties() {
		return {
			items: { observable: observableTypes.subEntities, rel: rels.item },
			//startAddExisting: { observable: observableTypes.summonAction, name: 'start-add-existing-activity' },
			startAddExistingNext: { observable: observableTypes.action, name: 'next', route: [
				{ observable: observableTypes.summonAction, name: 'start-add-existing-activity' }
			] },
			// startAddExistingSearch: { observable: observableTypes.summonAction, name: 'search', route: [
			// 	{ observable: observableTypes.summonAction, name: 'start-add-existing-activity' }
			// ] },
			_candidates: { type: Array },
			_dialogOpened: { type: Boolean },
			_selectionCount: { type: Number }
		};
	}

	constructor() {
		super();
		this._currentSelection = {};
		this._dialogOpened = false;
	}

	render() {
		console.log('next', this.startAddExistingNext);
		const renderCandidates = () => {
			if (!this._candidates || this._candidates.length <= 0) {
				return html`
					<div class="d2l-activity-collection-no-activity d2l-body-standard">
						${this.localize('noActivitiesFound')}
					</div>`;
			}
			return html`
				<d2l-list grid @d2l-list-selection-change="${this._onSelectionChange}">
				${repeat(this._candidates, (candidate) => candidate.activityUsageHref, candidate => html`
					<d2l-activity-usage-list-item
							href="${candidate.activityUsageHref}"
							.token="${this.token}"
							selectable
							?disabled="${candidate.alreadyAdded}"
							?selected="${candidate.alreadyAdded || this._currentSelection[candidate.properties.actionState]}"
							key="${candidate.alreadyAdded ? ifDefined(undefined) : candidate.properties.actionState}"></d2l-activity-usage-list-item>
					`)}
				</d2l-list>`;
		};
		const loadMore = this.getNextAction && !this._isLoadingMore
			? html`<d2l-button @click="${this.loadMore}">${this.localize('loadMore')}</d2l-button>`
			: this._isLoadingMore
				? html`<d2l-loading-spinner size="85"></d2l-loading-spinner>`
				: null;
		return html`
			<d2l-button primary @click="${this._onAddActivityClick}">${this.localize('addActivity')}</d2l-button>

			<div class="dialog-div">
				<d2l-dialog id="dialog" ?opened="${this._dialogOpened}" title-text="${this.localize('browseActivityLibrary')}" @d2l-dialog-close="${this._onCloseDialog}">
					<div class="d2l-add-activity-dialog" aria-live="polite" aria-busy="${!this._candidates}">
						<div class="d2l-add-activity-dialog-header">
							<div>
								<d2l-input-search label="${this.localize('search')}" placeholder="${this.localize('searchPlaceholder')}" @d2l-input-search-searched="${() => {}}"></d2l-input-search>
							</div>
							<div class="d2l-add-activity-dialog-selection-count">${this._selectionCount > 0 ? html`
									${this.localize('selected', 'count', this._selectionCount)}
									<d2l-link
										tabindex="0"
										role="button"
										@click=${this.clearSelected}
										@keydown="${this._onClearKeydown}">
											${this.localize('clearSelected')}
									</d2l-link>
								` : null }</div>
						</div>
						${renderCandidates()}
						<div class="d2l-add-activity-dialog-load-more">
							loadmore
						</div>
					</div>
					<d2l-button slot="footer" primary dialog-action="add" @click="${this._onAddActivityCommit}" ?disabled="${!this._selectionCount}">${this.localize('add')}</d2l-button>
					<d2l-button slot="footer" dialog-action>${this.localize('cancel')}</d2l-button>
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

	// todo: move to wherever localization makes sense when serge is added
	localize(string) {
		const en = {
			add: "Add", // When adding activities to the learning path, this will bulk add the selected potential activites to the learning path.
			addActivity: "Add Activity", // Add a learning task to a list that are similar.
			alreadyAdded: "Already added", // When seeing a list of activities that can be added to the learning path, these activities have already in the list.
			browseActivityLibrary: "Browse Activity Library", // The title of the dialog box that allows you to browse potential activities to add to the learning path.
			cancel: "Cancel", // When adding activities to the learning path, this will cancel the currently selected potential activities and close the dialog box.
			clearSelected: "Clear Selection", // When adding activities (bulk add) to the learning path this allows you to clear the ones currently selected.
			course: "Course", // A set of material or a plan of study on a particular subject, usually leading learning a new skill.
			deleteSucceeded: "{activityName} was removed.", //alert popup for delete activitie
			editLearningPath: "Edit Learning Path", // Title of the page where the page is to edit a list of related learnings. On the page you can edit the title, description and what learning activities are in the list.
			enterADescription: "Write a description", // Shows where the user should write a description for the learning path.
			loadMore: "Load More", // When adding activities to the learning path, this is on a button that will load more potential activities that can be added that match the current search.
			moveActivity: "Moved {activityName} to position {newPosition} out of {totalNumberOfActivities}.", // When a activity is moved to a new position in the learning path this message is annouced.
			noActivitiesInLearningPath: "There are no activities in this learning path.", // Displayed when the learning path is loaded and contains no activities
			noActivitiesFound: "There were no activities found using your search term.", // Displayed when the learning path has no activities while in the screen that allows you to add them.
			numberOfActivities: "{count, plural, =1 {1 Activity} other {{count} Activities}}", // The number of learning tasks currently in the list.
			removeActivity: "Remove", // An action to remove a learning task from a list of tasks that are related
			removeActivityAria: "Remove {activityName}", // Remove action described for aria with course name
			search: "Search", // When adding activities to the learning path, this is where you can search for potential activities to add.
			searchPlaceholder: "Search...", // Placeholder text for the search input to search the list of potential activities.
			selected: "{count} selected.", // When adding activities (bulk add) to a learning path this is the number of activities that will be added to the list.
			untitledLearningPath: "Untitled Learning Path", // Default name of a learning path before the user has changed it.
		};
		return en[string];
	}

	async _loadCandidates() {
		const summoned = await this.startAddExisting.summon();
		this._candidates = summoned.entities;
		for (const candidate of this._candidates) {
			candidate.activityUsageHref = candidate.links.find(link => link.rel.includes(rels.activityUsage)).href;
			candidate.alreadyAdded = this.items.findIndex(x => x.href === candidate.href) >= 0;
		}
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

	_onSelectionChange(e) {
		this._currentSelection[e.detail.key] = e.detail.selected;
		this._selectionCount = this._selectedCandidates.length;
	}

	get _selectedCandidates() {
		return this._candidates.filter((candidate) => this._currentSelection[candidate.properties.actionState]);
	}
}

customElements.define('d2l-activity-editor-collection-add', ActivityEditorCollectionAdd);
