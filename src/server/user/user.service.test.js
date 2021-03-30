const service = require('./user.service');

describe('User Service Tests', () => {
	describe('method: sanitizeUserForClient', () => {
		test('should return an empty object if no user is provided', () => {
			let results = service.sanitizeUser();

			expect(results).toEqual({});
		});

		test('should only return the required fields from the user', () => {
			let results = service.sanitizeUser({
				email: 'scooby@mysteryinc.com',
				roles: ['detective', 'dog'],
				id: '123ljkh4blv9',
				real_name: 'Scooby Doo',
			});

			expect(results).toEqual({
				email: 'scooby@mysteryinc.com',
				roles: ['detective', 'dog'],
			});

			expect(results.id).toBeUndefined();
			expect(results.real_name).toBeUndefined();
		});
	});
});
