const { getUser, createUser, updateUser } = require('./user.resolvers');

describe('GraphQL User Resolver Tests', () => {
	describe('resolver: getUser', () => {
		test('should return a user for the given id', () => {
			// Create a user so we are guaranteed to be able to retrieve a user
			let userJSON = { roles: ['somethingOdd'] };
			let newUser = createUser(null, { user: userJSON });

			// Search for our user
			let user = getUser(null, { id: newUser.id });

			// Test its the same user
			expect(user.id).toEqual(newUser.id);
			expect(user.roles).toEqual(newUser.roles);
		});

		test('should return nothing if there is no user with the given id', () => {
			// Search for our user
			let user = getUser(null, { id: 'somethingFalse' });

			// Test its the same user
			expect(user).toBeUndefined();
		});
	});

	describe('resolver: createUser', () => {
		test('should create a user', () => {
			// Create our new user
			let userJSON = { roles: ['somethingNew'] };
			let newUser = createUser(null, { user: userJSON });

			// Test its the same user
			expect(newUser.id).toBeDefined();
			expect(newUser.roles).toEqual(userJSON.roles);
		});

		test('should give a user no roles by default', () => {
			// Create our new user
			let newUser = createUser(null, { user: {} });

			// Test its the same user, with an empty array for roles as the default
			expect(newUser.id).toBeDefined();
			expect(newUser.roles).toHaveLength(0);
		});
	});

	describe('resolver: updateUser', () => {
		test('should update an existing user', () => {
			// Create our new user to guarantee we have one to update
			let userJSON = { roles: ['somethingOld'] };
			let newUser = createUser(null, { user: userJSON });

			// Update that user
			let newJSON = { roles: ['somethingUpdated'] };
			let updatedUser = updateUser(null, { user: newJSON, id: newUser.id });

			// Verify the changes
			expect(newUser.id).toEqual(updatedUser.id);
			expect(newUser.roles).toEqual(['somethingOld']);
			expect(newUser.roles).not.toEqual(updatedUser.roles);
			expect(updatedUser.roles).toEqual(['somethingUpdated']);
		});

		test('should throw an error if trying to update a non-existent user', () => {
			// Attempt to update a user who does not exist but catch the error
			let userJSON = { roles: ['admin'] };

			expect(() => {
				updateUser(null, { user: userJSON, id: 'somethingFake' });
			}).toThrow();
		});
	});
});
