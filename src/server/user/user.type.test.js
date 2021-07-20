const { User: UserModel } = require('./user.model');
const { User, UserInput } = require('./user.type');

/**
 * If you have a model to mimic your type, its good to write simple tests
 * that verify your types have all the fields your model had, and that
 * your inputs have all the fields minus the id, unless your model assumes
 * the client will provide that.
 */

describe('GraphQL User Type Tests', () => {
	test('User type should have all the fields in our user model', () => {
		let fields = Object.keys(User.getFields());
		let props = Object.keys(new UserModel());

		// No guarantee on order, sort the arrays
		expect(fields.sort()).toEqual(props.sort());
	});

	test('UserInput type should have all the fields in our user model except the id', () => {
		let fields = Object.keys(UserInput.getFields());
		let props = Object.keys(new UserModel());

		// Remove the id field from props
		props = props.filter((prop) => prop !== 'id');

		// No guarantee on order, sort the arrays
		expect(fields.sort()).toEqual(props.sort());
	});
});
