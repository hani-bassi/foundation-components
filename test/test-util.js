import { aTimeout, elementUpdated, fixture } from '@open-wc/testing';

export async function createComponentAndWait(componentHtml)
{
	const element = await fixture(componentHtml);
	await element.updateComplete;
	await element._state.allFetchesComplete();
	await element.updateComplete;
	return element;
}

// using a delay to wait for fetchMock to be called
// would prefer a better way
export async function delayAndAwaitForElement(element, delayMs) {
	return aTimeout(delayMs).then(async() => {
		await elementUpdated(element);
	});
}

// Handle updating the component textarea with a new value and await the update
export async function fireTextareaInputEvent(element, label, updatedDescriptionText) {
	const textarea = element.shadowRoot.querySelector(label);
	textarea.value = updatedDescriptionText;
	const inputEvent = new Event('input');
	textarea.dispatchEvent(inputEvent);

	// A render happens after events, we needed this extra await
	// wait for element to be updated from the input event
	await elementUpdated(element);
}
