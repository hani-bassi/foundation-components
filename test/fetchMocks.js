import { learningPathExisting, learningPathNew, learningPathUpdated } from './data.js';
import fetchMock from 'fetch-mock/esm/client.js';

/*
	HMC engine makes a call to the Component link and then fetches the href to get the object.
	Method handles this interaction by supplying the desired endpoint.
	(ex. comp with href="/learning-path/new" creates a link to /learning-path/new/object)
*/
function GenerateComponentLink(linkPath) {
	return {
		links:[
			{
				href: linkPath,
				rel: ['https://api.brightspace.com/rels/organization', 'https://api.brightspace.com/rels/specialization']
			}
		]
	};
}

export const mockLink = fetchMock.mock('path:/learning-path/new', () => {
	return GenerateComponentLink('/learning-path/new/object');
})
	.mock('path:/learning-path/new/object', () => {
		return learningPathNew;
	})
	.mock('path:/learning-path/existing', () => {
		console.log('called /lp/e/');
		return GenerateComponentLink('/learning-path/existing/object');
	})

	.mock('path:/learning-path/existing/object', () => {
		console.log('called /lp/e/o');
		return learningPathExisting;
	})
	.mock('path:/description/update', () => {
		console.log('called /d/u');
		return learningPathUpdated;
	});
