import './d2l-activity-course-name';
import './d2l-activity-due-date';
import './d2l-activity-icon';
import './d2l-activity-name';

import { css, LitElement } from 'lit-element/lit-element.js';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin.js';
import { html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components.js';
import { ListItemMixin } from '@brightspace-ui/core/components/list/list-item-mixin';
import { Rels } from 'siren-sdk/src/hypermedia-constants';

class ActivityListItemBasic extends ListItemMixin(HypermediaStateMixin(LitElement)) {
	static get properties() {
		return {
			name: {
				type: String,
				observable: observableTypes.property,
				route: [{
					observable: observableTypes.link,
					rel: Rels.organization
				}]
			}
		};
	}

	static get styles() {
		return [ css`` ];
	}

	render() {
		return this._renderListItem({
			illustration: html`<d2l-activity-icon href=${this.href} .token=${this.token}></d2l-activity-icon>`,
			content:
				html`
					<d2l-list-item-content id="content">
						<div id="content-top-container">
							<d2l-activity-name href=${this.href} .token=${this.token}></d2l-activity-name>
						</div>
						<div id="content-bottom-container" slot="secondary">
							<d2l-activity-date href=${this.href} .token=${this.token}></d2l-activity-date>
							${separatorTemplate}
							<d2l-activity-course-name href=${this.href} .token=${this.token}></d2l-activity-course-name>
						</div>
					</d2l-list-item-content>
				`
		});
	}

}

customElements.define('d2l-activity-list-item-basic', ActivityListItemBasic);
