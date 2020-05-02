'use strict';
import { refreshToken } from './token.js';
import { dispose, fetch, stateFactory } from '../state/store.js';

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

		this._properties = new Map();
		this._links = new Map();
		this._classes = new Map();
		this._subEntities = new Map();
		this._routesToFollow = new Map();
		this._sendEntityTo = new Map();

		this._childStates = [];
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
			if (!propertyInfo.observable) return;
			if (propertyInfo.route) {
				this.addRoute(component, name, propertyInfo);
			} else if (propertyInfo.observable === observableTypes.property) {
				this.addProperty(component, name, propertyInfo.method);
			} else if (propertyInfo.observable === observableTypes.link && propertyInfo.rel) {
				this.addLink(component, name, propertyInfo.rel);
			} else if (propertyInfo.observable === observableTypes.classes) {
				this.addClasses(component, name);
			} else if (propertyInfo.observable === observableTypes.subEntities && propertyInfo.rel) {
				this.addSubEntities(component, name, propertyInfo.rel);
			} else if (propertyInfo.observable === observableTypes.entity) {
				this.addEntity(component, name, propertyInfo.method);
			}
		});
	}

	dispose() {
		return Promise.all(this._childStates.map(state => dispose(state)));
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
		this._refreshEntity();
		this._refreshClasses();
		this._refreshProperties();
		this._refreshLinks();
		this._refreshSubEntities();
		this._refreshRoute();
	}

	_shouldAttachToken(sirenLink) {
		const rel = sirenLink && sirenLink.rel;
		if (!Array.isArray(rel)) {
			return true;
		}

		const isNoFollow = -1 !== rel.indexOf('nofollow');
		if (isNoFollow) {
			return false;
		}

		return true;
	}

	_getMap(map, identifier) {
		if (map.has(identifier)) {
			return map.get(identifier);
		}

		map.set(identifier, new Map());
		return map.get(identifier);
	}

	// Properties
	addProperty(component, property, method) {
		const propertyObject = this._getMap(this._properties, property);
		if (!propertyObject.has(component)) {
			propertyObject.set(component, null);
		}

		this._setProperty(component, property, method);
	}

	_getPropertyValue(property) {
		return this._entity && this._entity.properties && this._entity.properties[property];
	}

	_refreshProperties() {
		this._properties.forEach( (map, property) => {
			const value = this._getPropertyValue(property);
			map.forEach((method, component) => {
				method = typeof method === 'function' ? method : (value) => value;
				component[property] = method(value);
			});
		});
	}

	_setProperty(component, property, method) {
		const value = this._getPropertyValue(property);
		method = typeof method === 'function' ? method : (value) => value;
		component[property] = method(value);
	}


	// Links
	addLink(component, property, rel) {
		const linkObject = this._getMap(this._links, rel);

		if (!linkObject.has(component)) {
			linkObject.set(component, property);
		}

		this._setLink(component, property, rel);
	}

	_getLinkByRel(rel) {
		return this._entity && this._entity.hasLinkByRel(rel) && this._entity.getLinkByRel(rel);
	}

	_refreshLinks() {
		this._links.forEach((map, rel) => {
			map.forEach((property, component) => {
				this._setLink(component, property, rel)
			});
		});
	}

	_setLink(component, property, rel) {
		const value = this._getLinkByRel(rel);
		component[property] = (value || undefined) && value.href;
	}

	// Classes
	addClasses(component, name) {
		const classesObject = this._getMap(this._classes, name);

		if (!classesObject.has(component)) {
			classesObject.set(component, null);
		}

		this._setClasses(component, name);
	}

	_getClasses() {
		return this._entity && this._entity['class'];
	}

	_refreshClasses() {
		this._classes.forEach((map, name) => {
			map.forEach((_, component) => {
				this._setClasses(component, name)
			});
		});
	}

	_setClasses(component, name) {
		const value = this._getClasses();
		component[name] = value;
	}

	// subEntities
	addSubEntities(component, property, rel) {
		const subEntitiesObject = this._getMap(this._subEntities, rel);

		if (!subEntitiesObject.has(component)) {
			subEntitiesObject.set(component, property);
		}

		this._setSubEntities(component, property, rel);
	}

	_getSubEntitiesByRel(rel) {
		return this._entity && this._entity.getSubEntities(rel);
	}

	_refreshSubEntities() {
		this._subEntities.forEach((map, rel) => {
			map.forEach((property, component) => {
				this._setSubEntities(component, property, rel)
			});
		});
	}

	_setSubEntities(component, property, rel) {
		let entities = this._getSubEntitiesByRel(rel);
		if (!entities) return;

		entities = entities.map(entity => {
			const self = entity.hasLinkByRel && entity.hasLinkByRel('self') && entity.getLinkByRel && entity.getLinkByRel('self');
			const href = entity.href || (self && self.href);
			return href;
		}).filter(href => href);

		component[property] = entities;
	}

	// Route
	addRoute(component, name, propertyInfo) {
		const firstRoute = propertyInfo.route.shift();
		if (propertyInfo.route.length === 0) {
			propertyInfo.route = null;
		}

		const type = firstRoute.observable;
		const rel = firstRoute.rel;
		const routesToFollow = this._getMap(this._routesToFollow, type);

		if (!routesToFollow.has(component)) {
			routesToFollow.set(rel, {component, name, propertyInfo});
		}

		this._setRoute(type, rel, component, name, propertyInfo);
	}

	_getRouteHref(type, rel) {
		if (type === observableTypes.link) {
			const link = this._getLinkByRel(rel);
			if (!link) return;
			return link.href;

		} else if (type === observableTypes.subEntities) {
			let entities = this._getSubEntitiesByRel(rel);
			if (!entities) return;
			entities = entities.map(entity => {
				const self = entity.hasLinkByRel && entity.hasLinkByRel('self') && entity.getLinkByRel && entity.getLinkByRel('self');
				const href = entity.href || (self && self.href);
				return href;
			}).filter(href => href);
			return entities.shift();
		}
	}

	_refreshRoute() {
		this._routesToFollow.forEach((map, type) => {
			map.forEach((info, rel) => {
				this._setRoute(type, rel, info.component, info.name, info.propertyInfo) ;
			});
		});
	}

	async _setRoute(type, rel, component, name, propertyInfo) {
		if (!this._entity) return;
		const sendToken = type === observableTypes.link || this._shouldAttachToken(this._entity.getSubEntity(rel));
		const href = this._getRouteHref(type, rel);
		if (!href) return;

		const token = sendToken ? this._token.rawToken : -1;
		const state = await stateFactory(href, token);

		this._childStates.push(state);
		state.addObservables(component, { [name]: propertyInfo });
		return fetch(state);
	}

	// Entity
	addEntity(component, name, method) {
		const entityObject = this._getMap(this._sendEntityTo, component);
		if (!entityObject.has(component)) {
			entityObject.set(name, method);
		}

		this._setEntity(component, name, method);
	}

	_refreshEntity() {
		this._sendEntityTo.forEach( (map, component) => {
			map.forEach((method, name) => {
				this._setEntity(component, name, method);
			});
		});
	}

	_setEntity(component, name, method) {
		method = typeof method === 'function' ? method : (value) => value;
		component[name] = method(this._entity);
	}
}
