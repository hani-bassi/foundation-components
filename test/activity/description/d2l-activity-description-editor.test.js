import '../../../components/activity/description/d2l-activity-description-editor.js';
import { assert,  elementUpdated, expect } from '@open-wc/testing';
import { createComponentAndWait, delayAndAwaitForElement, fireTextareaInputEvent } from '../test-util.js';
import { learningPathExisting, learningPathNew, learningPathUpdated } from '../../data.js';
import { clearStore } from '@brightspace-hmc/foundation-engine/state/HypermediaState.js';
import { mockLink } from '../../fetchMocks.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import sinon from 'sinon/pkg/sinon-esm.js';

// use the learningPathUpdated description as the text when updating textareas
const updatedDescriptionText = learningPathUpdated.properties.description;

async function _createDescriptionEditor(path) {
	return await createComponentAndWait(path);
}

describe('d2l-activity-description-editor', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-activity-description-editor');
		});
	});

	describe('Component', () => {

		beforeEach(async() => {
			clearStore();
		});

		afterEach(() => {
			mockLink.resetHistory();
		});

		it.skip('should initialize using defined path and expected values', async() => {
			const element = await _createDescriptionEditor('/learning-path/new');

			// paths should be followed
			assert.isTrue(mockLink.called('path:/learning-path/new'), '/learing-path/new was not called');
			assert.isTrue(mockLink.called('path:/learning-path/new/object'), '/learing-path/new/object was not called');

			const textarea = element.shadowRoot.querySelector('label textarea');

			// classes are set
			expect(element.shadowRoot.querySelector('label'))
				.to.have.class('d2l-activity-description-editor', 'Label should have d2l-activity-description-editor class');
			expect(element.shadowRoot.querySelector('label span'))
				.to.have.class('d2l-input-label', 'span should have d2l-input-label class');
			expect(textarea)
				.to.have.class('d2l-input', 'textarea should have d2l-input class');

			// verify textarea element
			assert.equal(textarea.getAttribute('placeholder'), 'Write a description', 'Placeholder text does not match');
			assert.equal(textarea.value, learningPathNew.properties.description, 'textarea value does not match');

			assert.equal(element.description, learningPathNew.properties.description, 'description property should match');
		});

		describe.skip('path:/learning-path/existing', () => {
			let element;
			beforeEach(async() => {
				clearStore();
				element = await _createDescriptionEditor('/learning-path/existing');
				assert.equal(element.description, learningPathExisting.properties.description, 'description should match response');
			});

			it('description should be set when one is provided', async() => {
				// new path should be followed
				assert.isTrue(mockLink.called('path:/learning-path/existing'), '/learing-path/exiting was not called');
				assert.isTrue(mockLink.called('path:/learning-path/existing/object'), '/learning-path/existing/object was not called');

				assert.equal(element.shadowRoot.querySelector('label textarea').value,
					learningPathExisting.properties.description, 'textarea value does not match');

				assert.equal(element.description, learningPathExisting.properties.description, 'description property should match');
			});

			it('updating should commit state', async() => {
				const spy = sinon.spy(element.updateDescription);
				await fireTextareaInputEvent(element, updatedDescriptionText);

				assert.equal(element.description, updatedDescriptionText, 'description was updated to match');
				assert.isTrue(spy.commit.called, 'Commit should be called when input event is triggered');
			});

			/* 	These are out of scope, but provided basic mock up for save / cancel
			*	Still need to figure out how to wait for element to be updated after push / reset
			*/
			it('pushing state should save description', async() => {
				await fireTextareaInputEvent(element, updatedDescriptionText);

				element._state.push();
				await delayAndAwaitForElement(element, 100);

				assert.isTrue(mockLink.called('path:/description/update'), 'Updated path was not called');
				assert.equal(element.description, updatedDescriptionText, 'description should be updated after a push');

				let textarea = element.shadowRoot.querySelector('label textarea');
				textarea = element.shadowRoot.querySelector('label textarea');
				assert.equal(textarea.value, updatedDescriptionText, 'textarea value should be updated');
			});

			it('reset state should revert description and textarea', async() => {
				await fireTextareaInputEvent(element, updatedDescriptionText);

				assert.equal(element.description, updatedDescriptionText, 'description should be updated');

				const spy = sinon.spy(element);
				element._state.reset();
				await elementUpdated(element);

				assert.equal(element.description, learningPathExisting.properties.description, 'description should be reset');
				assert.isTrue(spy.render.called);

				const textarea2 = element.shadowRoot.querySelector('label textarea');
				assert.equal(textarea2.value, learningPathExisting.properties.description, 'textarea value should be reset');
			});
		});
	});
});
