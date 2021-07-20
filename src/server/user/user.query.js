const { getUser } = require('./user.resolvers');
const { User } = require('./user.type');
const graphql = require('graphql');

/**
 * @exports UserQuery
 * @description GraphQL Query Object
 */
module.exports = {
	getUser: {
		type: User,
		resolve: getUser,
		args: {
			id: {
				type: new graphql.GraphQLNonNull(graphql.GraphQLString),
				description: 'Id of the user you want to retrieve',
			},
		},
	},
};
