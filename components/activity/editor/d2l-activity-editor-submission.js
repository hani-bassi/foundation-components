import './d2l-activity-editor-type.js';
import '@brightspace-ui-labs/accordion/accordion-collapse.js';
import { bodyCompactStyles, bodySmallStyles, heading3Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { customHypermediaElement, html } from 'foundation-engine/framework/hypermedia-components.js';
import {
	summarizerHeaderStyles,
	summarizerSummaryStyles
} from 'd2l-activities/components/d2l-activity-editor/d2l-activity-assignment-editor/activity-summarizer-styles.js';
import { HypermediaLitMixin } from 'foundation-engine/framework/hypermedia-lit-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';
import { radioStyles } from '@brightspace-ui/core/components/inputs/input-radio-styles.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

class ActivityEditorSubmission extends HypermediaLitMixin(LitElement) {

	static get styles() {
		const styles = [
			bodyCompactStyles,
			bodySmallStyles,
			heading3Styles,
			labelStyles,
			radioStyles,
			selectStyles,
			summarizerHeaderStyles,
			summarizerSummaryStyles];

		super.styles && styles.unshift(super.styles);

		return styles;
	}

	render() {
		return html`
			<d2l-labs-accordion-collapse
				class="accordion"
				flex
				header-border
				?disabled="${this.skeleton}"
				?no-icons="${this.skeleton}">
				<h3 class="d2l-heading-3 d2l-activity-summarizer-header d2l-skeletize" slot="header">
					Submission Completion and Categorization
				</h3>
				<ul class="d2l-body-small d2l-activity-summarizer-summary d2l-skeletize" slot="summary">
					<li>${this._renderTypeSummary()}</li>
				</ul>

				${this._renderType()}
			</d2l-labs-accordion-collapse>
		`;
	}

	_renderTypeSummary() {
		return html`<d2l-activity-type-summary href="${this.href}" .token="${this.token}"></d2l-activity-type-summary>`;
	}

	_renderType() {
		return html`
			<div id="assignment-type-container">
				<label class="d2l-label-text">
					Assignment Type
				</label>
				<d2l-activity-editor-type
					href="${this.href}"
					.token="${this.token}">
				</d2l-activity-editor-type>
			</div>
		`;
	}

}

customHypermediaElement('d2l-activity-editor-submission', ActivityEditorSubmission, null, 'assignment');
