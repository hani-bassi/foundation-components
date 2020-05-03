import { html, TemplateResult, defaultTemplateProcessor } from 'lit-html';
import { until } from 'lit-html/directives/until.js';
import { dispose, fetch, stateFactory } from '../state/store.js';
import { observableTypes } from '../state/HypermediaState.js';
import { componentStoreFactory } from '../render/componentFactory.js';

export function customHypermediaElement(tag, elementClass, pseudoTag, hypermediaClasses, options) {
	const components = componentStoreFactory(pseudoTag);
	components.register(tag, hypermediaClasses);
	customElements.define(tag, elementClass, options);
}

export function renderHypermediaComponent(pseudoTag, href, token) {
	const observable = {
		classes: { type: Array, observable: observableTypes.classes }
	};
	const resources = { classes: [] }
	const components = componentStoreFactory(pseudoTag);
	if (!href || !token) return html`loading`;
	const statePromise = stateFactory(href, token);
	const fetchedResults  = statePromise.then(async state => {
		state.addObservables(resources, observable);
		await fetch(state);
		return state;
	}).then(state => render(state, components, resources));
	return html`${until(fetchedResults, html`loading`)}`;
}

function render(state, components, resources) {
	const tag = components.componentTag(resources.classes);
	const result = tag ? htmlCustomTag`<${tag} href="${state.entityId}" .token="${state.token.rawToken}"></${tag}>` : null;
	dispose(state);
	return result;
}

const htmlCustomTag = (strings, ...values) => {
	strings = [...strings];
	strings.pop();
	strings.shift();
	const startTag = values.shift();
	const endTag = values.pop();
	strings[0] = `<${startTag}${strings[0]}`;
	strings[strings.length - 1] += (`${endTag}>`);
	return new TemplateResult(strings, values, 'html', defaultTemplateProcessor);
};
