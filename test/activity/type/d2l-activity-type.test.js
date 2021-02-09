import '../../../components/activity/type/d2l-activity-type.js';
import { assert, fixture, html, waitUntil } from '@open-wc/testing';
import { learningPathExisting, learningPathNew } from '../../data.js';
import { clearStore } from '@brightspace-hmc/foundation-engine/state/HypermediaState.js';
import { mockLink } from '../../fetchMocks.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

async function _createType(path)
{
	const element = await fixture(html`<d2l-activity-type href="${path}" token="test-token"></d2l-activity-type>`);
	await waitUntil(() => element._loaded === true);
	return element;
}

describe('d2l-activity-type', () => {

	beforeEach(() => {
		clearStore();
	});

	afterEach(() => {
		mockLink.resetHistory();
	});

	it('should construct d2l-activity-type', () => {
		runConstructor('d2l-activity-type');
	});

	it('should construct d2l-activity-type-editor-assignment', () => {
		runConstructor('d2l-activity-type-editor-assignment');
	});

	it('should construct a component and check fields', async() => {
		const element = await _createType('/learning-path/new/object');

		assert.isTrue(mockLink.called('path:/learning-path/new/object'), '/learing-path/new was not called');

		assert.isTrue(element._loaded, 'should be loaded after creation');
		assert.deepEqual(element.classes, learningPathNew.class, 'should have no classes when created');
	});

	it('should construct a component and check fields', async() => {
		const element = await _createType('/learning-path/existing/object');

		assert.isTrue(mockLink.called('path:/learning-path/existing/object'), '/learning-path/existing was not called');

		assert.isTrue(element._loaded, 'should be loaded after creation');
		assert.deepEqual(element.classes, learningPathExisting.class, 'should have no classes when created');
	});
});
