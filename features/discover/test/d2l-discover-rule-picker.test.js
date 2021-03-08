import '../d2l-discover-rule-picker.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { clearStore } from '@brightspace-hmc/foundation-engine/state/HypermediaState.js';
import { createComponentAndWait } from '../../../test/test-util.js';
import { default as fetchMock } from 'fetch-mock/esm/client.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const selfHref = 'http://rule-1';
const conditionTypesHref = 'http://condition-types';
const entity = {
	entities: [
		{
			rel: ['condition'],
			properties: { type: 'Fruit', value: 'Banana' }
		},
		{
			rel: ['condition'],
			properties: { type: 'Fruit', value: 'Orange' }
		},
		{
			rel: ['condition'],
			properties: { type: 'Entree', value: 'Cake' }
		}
	],
	links: [
		{ rel: ['self'], href: selfHref },
		{ rel: [ 'available-condition-types' ], 'href': conditionTypesHref }
	]
};
const emptyEntityHref = 'http://rule-empty';
const emptyEntity = {
	links: [
		{ rel: ['self'], href: emptyEntityHref },
		{ rel: [ 'available-condition-types' ], 'href': conditionTypesHref }
	]
};
const conditionTypesEntity = {
	entities: [
		{
			rel: ['condition-type'],
			properties: { type: 'Fruit' }
		},
		{
			rel: ['condition-type'],
			properties: { type: 'Entree' }
		}
	],
	links: [
		{ rel: ['self'], href: conditionTypesHref }
	]
};

describe('d2l-discover-rule-picker', () => {
	before(() => {
		fetchMock.mock(selfHref, JSON.stringify(entity))
			.mock(emptyEntityHref, JSON.stringify(emptyEntity))
			.mock(conditionTypesHref, JSON.stringify(conditionTypesEntity));
	});

	describe('constructor', () => {
		it('constructs the rule picker component', () => {
			runConstructor('d2l-discover-rule-picker');
		});
	});

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-discover-rule-picker></d2l-discover-rule-picker>`);
			const elFull = await createComponentAndWait(html`
				<d2l-discover-rule-picker href="${selfHref}" token="cake"></d2l-discover-rule-picker>
			`);
			await expect(el).to.be.accessible();
			await expect(elFull).to.be.accessible();
		});
	});

	describe('rendering', () => {
		beforeEach(() => clearStore());
		afterEach(() => fetchMock.resetHistory());

		it('renders the conditionTypes dropdown data', async() => {

			const el = await createComponentAndWait(html`
				<d2l-discover-rule-picker href="${selfHref}" token="cake"></d2l-discover-rule-picker>
			`);

			const conditionDropdown = el.shadowRoot.querySelector('select');
			const conditionInput = el.shadowRoot.querySelector('d2l-input-text');

			expect(conditionDropdown).to.not.be.null;
			expect(conditionInput).to.not.be.null;
			expect(conditionDropdown.options.length).to.equal(conditionTypesEntity.entities.length);

			expect(Array.from(conditionDropdown.options).map(option => option.value))
				.to.deep.equal(conditionTypesEntity.entities.map(type => type.properties.type));
		});

		it('renders the initialized conditions', async() => {
			const el = await createComponentAndWait(html`
				<d2l-discover-rule-picker href="${selfHref}" token="cake"></d2l-discover-rule-picker>
			`);
			const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
			const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');

			expect(conditionDropdownList.length).to.equal(entity.entities.length);
			expect(conditionInputList.length).to.equal(entity.entities.length);

			//Ensure the data in the fields lines up with the passed data
			for (let i = 0 ; i < conditionDropdownList.options; i++) {
				expect(conditionDropdownList[i].value).to.equal(entity.entities[i].properties.type);
				expect(conditionInputList[i].value).to.equal(entity.entities[i].properties.value);
			}
		});

		it('displays one empty condition by default', async() => {
			const el = await createComponentAndWait(html`
				<d2l-discover-rule-picker href="${emptyEntityHref}" token="cake"></d2l-discover-rule-picker>
			`);

			const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
			const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');

			expect(conditionDropdownList.length).to.equal(1);
			expect(conditionInputList.length).to.equal(1);
		});
	});

	describe('interaction', () => {
		let el;
		beforeEach(async() => el = await createComponentAndWait(html`
			<d2l-discover-rule-picker href="${selfHref}" token="cake"></d2l-discover-rule-picker>
		`));

		it('should add a new condition when the Add Condition button is pressed', async() => {
			const addButton = el.shadowRoot.querySelector('#add-another-condition-button');
			addButton.click();
			await el.updateComplete;

			const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
			const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');
			expect(conditionDropdownList.length).to.equal(4);
			expect(conditionInputList.length).to.equal(4);
		});

		it('updates the condition information when the combo is modified and loses focus', async() => {
			const conditionD2LInput = el.shadowRoot.querySelector('d2l-input-text');
			await conditionD2LInput.updateComplete;
			const conditionInput = conditionD2LInput.shadowRoot.querySelector('input');

			const listener = oneEvent(conditionInput, 'blur');
			conditionInput.focus();
			conditionD2LInput.value = 'Zebra';
			conditionInput.blur();

			await listener;

			expect(el.conditions[0].properties.value).to.equal('Zebra');
		});

		it('updates the condition information when the input field is modified', async() => {
			el = await createComponentAndWait(html`
				<d2l-discover-rule-picker href="${emptyEntityHref}" token="cake"></d2l-discover-rule-picker>
			`);

			const conditionSelect = el.shadowRoot.querySelector('select');
			const newType = 'Entree';
			expect(el.conditions[0].properties.type).does.not.equal(newType);

			const listener = oneEvent(conditionSelect, 'blur');
			conditionSelect.focus();
			conditionSelect.value = newType;
			conditionSelect.blur();

			await listener;

			expect(el.conditions[0].properties.type).to.equal(newType);
		});

		it('displays the condition deletion button only if there is greater than one condition', async() => {
			const emptyEl = await createComponentAndWait(html`
				<d2l-discover-rule-picker href="${emptyEntityHref}" token="cake"></d2l-discover-rule-picker>
			`);
			const deleteButtonListEmpty = emptyEl.shadowRoot.querySelectorAll('.delete-condition-button');
			expect(deleteButtonListEmpty.length).to.be.equal(1);
			expect(deleteButtonListEmpty[0].hasAttribute('hidden')).to.be.true;

			const deleteButtonList = el.shadowRoot.querySelectorAll('.delete-condition-button');
			expect(deleteButtonList.length).to.be.equal(3);
			expect(deleteButtonList[0].hasAttribute('hidden')).to.be.false;
		});

		const deletionTests = [
			{
				description: 'displays the condition information when the first condition has been deleted.',
				index: 0
			},
			{
				description: 'displays the condition information when the last condition has been deleted.',
				index: 2
			},
			{
				description: 'displays the condition information when the middle condition has been deleted.',
				index: 1
			}
		];
		for (const test of deletionTests) {
			it(test.description, async() => {
				const deleteButtonList = el.shadowRoot.querySelectorAll('.delete-condition-button');
				const newConditions = [...el.conditions];
				newConditions.splice(test.index, 1);

				deleteButtonList[test.index].click();
				await el.updateComplete;
				const conditionDropdownList = el.shadowRoot.querySelectorAll('select');
				const conditionInputList = el.shadowRoot.querySelectorAll('d2l-input-text');

				expect(el.conditions.length).to.equal(newConditions.length);
				expect(el.conditions).to.deep.equal(newConditions);
				for (let i = 0 ; i < el.conditions.length; i++) {
					//Ensure user facing data matches expected results
					expect(conditionDropdownList[i].value).to.equal(newConditions[i].properties.type);
					expect(conditionInputList[i].value).to.equal(newConditions[i].properties.value);
				}
			});
		}

	});
});
