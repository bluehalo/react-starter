/**
 * @class User
 * @description Model for our users
 */
class User {
	constructor(props) {
		// Assign some reasonable values for a default user
		Object.assign(this, {
			roles: []
		}, props);
	}

	get id() {
		return this._id;
	}

	set id(id) {
		this._id = id.toLowerCase();
	}

	getEnumerableProperties() {
		let descriptors = Object.getOwnPropertyDescriptors(User.prototype);
		let names = Object.getOwnPropertyNames(this);

		return Array.prototype.concat(
			Object.keys(descriptors).filter((key) => typeof descriptors[key].get === 'function'),
			names.filter((name) => !name.startsWith('_')),
		);
	}

	toJSON() {
		return this.getEnumerableProperties().reduce((json, prop) => {
			json[prop] = this[prop];
			return json;
		}, {});
	}
}

module.exports = {
	User,
};
