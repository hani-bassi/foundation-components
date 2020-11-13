import { css, LitElement } from 'lit-element/lit-element.js';
import { formatDate, formatTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { nothing } from 'lit-html';

class HypermediaDate extends LocalizeMixin(HypermediaStateMixin(LitElement)) {
	static get properties() {
		return {
			date: { type: String, observable: observableTypes.property },
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
		this.format = 'MMM d';
		this.includeTime = false;
	}

	get date() { return this._date; }

	set date(newVal) {
		const oldVal = this._date;
		this._date = new Date(newVal);
		this.requestUpdate('date', oldVal);
	}

	render() {
		if (!this.date || !this.type) return nothing;
		return this.localize(
			this.type,
			'date', formatDate(this.date, { format: this.format }),
			'time', this.includeTime && formatTime(this.date));
	}
}

customElements.define('d2l-hm-date', HypermediaDate);
