import '../image/d2l-activity-image.js';
import '../name/d2l-activity-name.js';
import { guard } from 'lit-html/directives/guard';
import { html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components.js';
import { HypermediaStateMixin } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { ListItemMixin } from '@brightspace-ui/core/components/list/list-item-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';
import { LocalizeUsageListItem } from './lang/localize-usage.js';

class ActivityUsageListItem extends LocalizeUsageListItem(HypermediaStateMixin(ListItemMixin(LitElement))) {
	static get properties() {
		return {
			alreadyAdded: { type: Boolean, attribute: 'already-added' }
		};
	}

	render() {
		return this._renderListItem({
			illustration: html`${guard([this.href, this.token], () => html`<d2l-activity-image href="${this.href}" .token="${this.token}"></d2l-activity-image>`)}`,
			content: html`${guard([this.href, this.token], () => html`
				<d2l-activity-name href="${this.href}" .token="${this.token}"></d2l-activity-name>
				<div slot="supporting-info">${this.alreadyAdded ? html`${this.localize('alreadyAdded')}` : null}</div>
			`)}`
		});
	}
}
customElements.define('d2l-activity-usage-list-item', ActivityUsageListItem);
