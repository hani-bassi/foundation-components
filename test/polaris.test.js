import '../polaris.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-polaris', () => {

	it('should pass all axe tests', async() => {
		const el = await fixture(html`<d2l-polaris></d2l-polaris>`);
		await expect(el).to.be.accessible();
	});

});
