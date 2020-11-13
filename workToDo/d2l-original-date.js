
import { Classes, Rels } from 'siren-sdk/src/hypermedia-constants';
import { css, LitElement } from 'lit-element/lit-element.js';
import { formatDate, formatTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { nothing } from 'lit-html';

class ActivityDueDate extends LocalizeMixin(HypermediaStateMixin(LitElement)) {
	static get properties() {
		return {
			classes: {
				type: Array,
				observable: observableTypes.classes,
				route: [{
					observable: observableTypes.subEntity,
					rel: Rels.date
				}]
			},
			date: {
				type: String,
				observable: observableTypes.property,
				route: [{
					observable: observableTypes.subEntity,
					rel: Rels.date
				}]
			},
			format: { type: String, attribute: 'format' },
			includeTime: { type: Boolean, attribute: 'include-time' }
		};
	}

	static get styles() {
		return [
			css`
				:host {
					display: inline;
				}
				:host([hidden]) {
					display: none;
				}
			`
		];
	}

	static async getLocalizeResources(langs) {
		for await (const lang of langs) {
			let translations;
			switch (lang) {
				case 'en':
					translations = await import('./lang/en');
					break;
			}

			if (translations && translations.val) {
				return {
					language: lang,
					resources: translations.val
				};
			}
		}

		return null;
	}

	constructor() {
		super();
		this.classes = [];
		this.format = 'MMM d';
		this.includeTime = false;
	}

	get date() { return this._date; }

	set date(newVal) {
		const oldVal = this._date;
		this._date = new Date(newVal);
		this.requestUpdate('date', oldVal);
	}

	get _type() {
		if (this.classes.includes(Classes.dates.dueDate)) {
			return this.includeTime
				? 'dueDateTimed'
				: 'dueDate';
		} else if (this.classes.includes(Classes.dates.endDate)) {
			return this.includeTime
				? 'endDateTimed'
				: 'endDate';
		} return null;
	}

	render() {
		if (!this.date || !this._type) return nothing;
		return this.localize(
			this._type,
			'date', formatDate(this.date, { format: this.format }),
			'time', this.includeTime && formatTime(this.date));
	}
}

customElements.define('d2l-activity-due-date', ActivityDueDate, 'd2l-activity-date', [['due-date', 'date']]);
