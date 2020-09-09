import { fetch, stateFactory } from '../../state/store.js';
import { Component } from './Common.js';
import { shouldAttachToken } from '../token.js';

export class SirenSubEntity {
	constructor({id, token}) {
		this._rel = id;
		this._components = new Component();
		this._routes = new Map();
		this._token = token;
	}

	get entityId() {
		return this._entityId;
	}

	set entityId(entityId) {
		if (!this._entityId !== entityId) {
			this._components.setProperty(entityId);
		}
		this._entityId = entityId;
	}

	get rel() {
		return this._rel;
	}

	get childState() {
		return this._childState;
	}

	addComponent(component, property, route) {
		if (route) {
			this._routes.set(component, route);
			return;
		}
		this._components.add(component, property);
		this._components.setComponentProperty(component, this.entityId);
	}

	deleteComponent(component) {
		if (this._route.has(component)) {
			this._childState.dispose(component);
			this._route.delete(component);
			return;
		}
		this._components.delete(component);
	}

	setSirenEntity(sirenEntity, SubEntityCollectionMap) {
		const subEntity = sirenEntity && sirenEntity.hasSubEntityByRel(this._rel) && sirenEntity.getSubEntityByRel(this._rel);
		if (!this.link) return;

		if (SubEntityCollectionMap && SubEntityCollectionMap instanceof Map) {
			this.link.rel.forEach(rel => {
				if (SubEntityCollectionMap.has(rel)) {
					this._merge(SubEntityCollectionMap.get(rel));
				}
				SubEntityCollectionMap.set(rel, this);
			});
		}

		this._setSubEntity(subEntity);
	}

	async _setSubEntity(subEntity) {
		this.entityId = this._getEntityIdFromSirenEntity(subEntity);

		if (this._token) {
			this._childState = await stateFactory(this.entityId, shouldAttachToken(this._token, subEntity));
			this._routes.forEach((route, component) => {
				this._childState.addObservables(component, route);
			});
			fetch(this._childState);
		}
	}

	_getEntityIdFromSirenEntity(entity) {
		const self = entity.hasLinkByRel && entity.hasLinkByRel('self') && entity.getLinkByRel && entity.getLinkByRel('self');
		return  entity.href || (self && self.href);
	}
}
