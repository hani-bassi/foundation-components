import { SirenClasses } from './SirenClasses.js';
import { SirenEntity } from './SirenEntity.js';
import { SirenLink } from './SirenLink.js';
import { SirenProperty } from './SirenProperty.js';
import { SirenSubEntity } from './SirenSubEntity.js';

export const observableTypes = Object.freeze({
	property: 1,
	link: 2,
	classes: 3,
	subEntities: 4,
	entity: 5,
	subEntity: 6
});

const observableClasses = Object.freeze({
	[observableTypes.classes]: SirenClasses,
	[observableTypes.entity]: SirenEntity,
	[observableTypes.link]: SirenLink,
	[observableTypes.property]: SirenProperty,
	[observableTypes.subEntity]: SirenSubEntity
});

function defaultBasicInfo({rel, observable}) {
	return { id: rel, type: observable };
}

export function sirenComponentBasicInfo(componentProperties) {
	const sirenComponentType = componentProperties.observable && observableClasses[componentProperties.observable];
	if (!sirenComponentType) {
		throw new Error('Bad siren component');
	}

	return sirenComponentType.basicInfo ? sirenComponentType.basicInfo(componentProperties) : defaultBasicInfo(componentProperties);
}

export function sirenComponentFactory(componentProperties) {
	const sirenComponentType = componentProperties.type && observableClasses[componentProperties.type];
	if (!sirenComponentType) {
		throw new Error('Bad siren component');
	}

	return new sirenComponentType(componentProperties);
}
