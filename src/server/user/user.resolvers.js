const { User } = require('./user.model');

let database = {
	1: new User({
		id: '1',
		roles: ['admin'],
	}),
};

/**
 * @function getUser
 * @description Retrieve the current user
 * @param {object} _root - Previous object, not used in root queries
 * @param {object} args - Any arguments for the GrahpQL Query
 * @param {object} _context - Request context
 * @param {object} _info - Field specific information relative to the query
 */
function getUser(_root, args, _context, _info) {
	return database[args.id];
}

/**
 * @function createUser
 * @description Creates a new user
 * @param {object} _ - Previous object, not used in mutations
 * @param {object} args - Any arguments for the GrahpQL Query
 * @param {object} _context - Request context
 * @param {object} _info - Field specific information relative to the query
 */
function createUser(_, args, _context, _info) {
	let id = require('crypto').randomBytes(10).toString('hex');
	return (database[id] = new User(Object.assign(args.user, { id: id })));
}

/**
 * @function updateUser
 * @description Updates an existing user
 * @param {object} _ - Previous object, not used in mutations
 * @param {object} args - Any arguments for the GrahpQL Query
 * @param {object} _context - Request context
 * @param {object} _info - Field specific information relative to the query
 */
function updateUser(_, args, _context, _info) {
	let user = database[args.id];
	// If we do not have a user, throw an error
	if (!user) {
		throw new Error("User not found for provided 'id'");
	}
	// Update our user
	return (database[args.id] = new User(Object.assign(args.user, { id: args.id })));
}

module.exports = {
	updateUser,
	createUser,
	getUser,
};
