import { css, html, LitElement } from 'lit-element/lit-element.js';
import { HypermediaLitMixin, observableTypes } from '../../../framework/hypermedia-lit-mixin.js';
import { customHypermediaElement } from '../../../framework/hypermedia-component.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import '../../common/d2l-hm-course-image.js'

const rels = Object.freeze({
	organization: 'https://api.brightspace.com/rels/organization'
});

class ActivityImageCourse extends HypermediaLitMixin(LitElement) {
	static get properties() {
		return {
			_organizationHref: { type: String, observable: observableTypes.link, rel: rels.organization }
		};
	}

	static get styles() {
		return [ css`` ];
	}

	render() {
		return html`
			<d2l-hm-course-image href="${ifDefined(this._organizationHref)}" .token="${this.token}"></d2l-hm-course-image>
		`;
	}

}

customHypermediaElement('d2l-activity-image-course', ActivityImageCourse, 'd2l-activity-name', [['activity-usage', 'course-offering']]);
