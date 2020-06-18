import { sirenComponentBasicInfo, sirenComponentFactory } from './sirenComponents/sirenComponentFactory.js'
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
			let { id, type } = sirenComponentBasicInfo(propertyInfo);
			id = id || id.replace(/^_+/, name);

			const typeMap = this._getMap(this._decodedEntity, type);

			const sirenComponent = this._getSirenComponent(typeMap, id);
			sirenComponent.addComponent(component, name);
		});
	}

	dispose(component) {
		this._decodedEntity.forEach( typeMap => {
			typeMap.forEach( sirenComponent => {
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
		this._decodedEntity.forEach( typeMap => {
			typeMap.forEach( sirenComponent => {
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

	_getSirenComponent(typeMap, id) {
		if (typeMap.has(id)) return typeMap.get(id);

		const sirenComponent = sirenComponentFactory(propertyInfo);
		typeMap.add(id, sirenComponent);

		return sirenComponent;
	}
}
