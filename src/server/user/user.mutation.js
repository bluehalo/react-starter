const { createUser, updateUser } = require('./user.resolvers');
const { UserInput, User } = require('./user.type');
const graphql = require('graphql');

/**
 * @exports UserQuery
 * @description GraphQL Query Object
 */
module.exports = {
	createUser: {
		type: User,
		resolve: createUser,
		args: {
			user: {
				type: UserInput,
				description: 'User you are creating',
			},
		},
	},
	updateUser: {
		type: User,
		resolve: updateUser,
		args: {
			id: {
				type: new graphql.GraphQLNonNull(graphql.GraphQLString),
				description: 'Id of the user you want to update',
			},
			user: {
				type: UserInput,
				description: 'User instance you are updating',
			},
		},
	},
};
