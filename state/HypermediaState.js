import { sirenComponentBasicInfo, sirenComponentFactory } from './sirenComponents/sirenComponentFactory.js';
import { refreshToken } from './token.js';

export const observableTypes = Object.freeze({
	property: 1,
	link: 2,
	classes: 3,
	subEntities: 4,
	entity: 5
});

/**
 *
 * @export
 * @class HypermediaState
 */
export class HypermediaState {
	constructor(entityId, token) {
		this._entityId = entityId;
		this._token = token;

		this._decodedEntity = new Map();
	}

	get entityId() {
		return this._entityId;
	}

	get token() {
		return this._token;
	}

	addObservables(component, observables) {
		Object.keys(observables).forEach((name) => {
			const propertyInfo = observables[name];
			propertyInfo.name = name;

			const sirenComponent = this._getSirenComponent(propertyInfo);
			sirenComponent.addComponent(component, name);
		});
	}

	dispose(component) {
		this._decodedEntity.forEach(typeMap => {
			typeMap.forEach(sirenComponent => {
				sirenComponent.deleteComponent(component);
			});
		});
	}

	refreshToken() {
		return refreshToken(this.token);
	}

	onServerResponse(entity, error) {
		if (!entity) throw error;
		this.setSirenEntity(entity);
	}

	hasServerResponseCached() {
		return !!this._entity;
	}

	setSirenEntity(entity) {
		this._entity = entity;
		this._decodedEntity.forEach(typeMap => {
			typeMap.forEach(sirenComponent => {
				sirenComponent.setSirenEntity(entity, typeMap);
			});
		});
	}

	_getMap(map, identifier) {
		if (map.has(identifier)) {
			return map.get(identifier);
		}

		map.set(identifier, new Map());
		return map.get(identifier);
	}

	_getSirenComponent(propertyInfo) {
		const basicInfo = sirenComponentBasicInfo(propertyInfo);
		const typeMap = this._getMap(this._decodedEntity, basicInfo.type);
		if (typeMap.has(basicInfo.id)) return typeMap.get(basicInfo.id);

		const sirenComponent = sirenComponentFactory(basicInfo);
		typeMap.set(basicInfo.id, sirenComponent);
		this._entity && sirenComponent.setSirenEntity(this._entity, typeMap);

		return sirenComponent;
	}
}
