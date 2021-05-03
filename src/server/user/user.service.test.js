const service = require('./user.service');
const { User } = require('./user.model');

describe('User Service Tests', () => {
	// TODO: Remember to update these based on your authentication
	describe('function: getUser', () => {
		test('should return an instance of a user when calling getUser', () => {
			let results = service.getUser();

			expect(results instanceof User).toBeTruthy();
		});
	});

	describe('function: login', () => {
		test('should return an instance of a user after successfully authenticating them', () => {
			let results = service.login();

			expect(results instanceof User).toBeTruthy();
		});
	});
});
