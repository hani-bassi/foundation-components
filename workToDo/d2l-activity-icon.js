import '@brightspace-ui/core/components/icons/icon';
import { css, LitElement } from 'lit-element/lit-element';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin';
import { Classes } from 'siren-sdk/src/hypermedia-constants';
import { html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components';

const icons = Object.freeze({
	default: 'assignments',
	[Classes.activities.userAssignmentActivity]: 'assignments',
	[Classes.activities.userChecklistActivity]: 'checklist',
	[Classes.activities.userContentActivity]: 'content',
	[Classes.activities.userCourseOfferingActivity]: 'syllabus',
	[Classes.activities.userDiscussionActivity]: 'discussions',
	[Classes.activities.userQuizActivity]: 'quizzing',
	[Classes.activities.userQuizAttemptActivity]: 'quizzing',
	[Classes.activities.userSurveyActivity]: 'surveys'
});

class ActivityIcon extends HypermediaStateMixin(LitElement) {

	static get properties() {
		return {
			classes: { type: Array, observable: observableTypes.classes },
			tier: { type: String }
		};
	}

	static get styles() {
		return [ css`` ];
	}

	constructor() {
		super();
		this.classes = [];
		this.tier = '2';
	}

	get tier() { return this._tier; }

	set tier(newVal) {
		const oldVal = this._tier;
		this._tier = `tier${newVal}:`;
		this.requestUpdate('tier', oldVal);
	}

	get icon() {
		for (const cur in this.classes) {
			if (this.classes[cur] in icons) {
				return icons[this.classes[cur]];
			}
		}
		return null;
	}

	render() {
		return html`
			<d2l-icon icon=${this.tier + this.icon}></d2l-icon>
		`;
	}
}

customElements.define('d2l-activity-icon', ActivityIcon);
