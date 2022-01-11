const { User } = require('./user.model');

describe('User Model Tests', () => {

	test('should assign no roles to a default user', () => {
		let john = new User({ id: 'john_doe' });

		expect(Array.isArray(john.roles)).toBeTruthy();
		expect(john.roles).toHaveLength(0);
	});

	test('should not return any underscore or private properties when calling toJSON', () => {
		let john = new User({ id: 'john_doe' });
		let json = john.toJSON();

		// id is stored as `_id`, however toJSON should return it as `id` and not `_id`
		expect(json.id).toBe('john_doe');
		expect(json._id).toBeUndefined();
	});

});
