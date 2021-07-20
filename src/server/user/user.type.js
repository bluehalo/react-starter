const graphql = require('graphql');

/**
 * @type User
 * @description Query model for our users
 */
module.exports.User = new graphql.GraphQLObjectType({
	name: 'User',
	fields: {
		id: {
			type: graphql.GraphQLString,
			description: 'Unique ID for the user',
		},
		roles: {
			type: new graphql.GraphQLList(graphql.GraphQLString),
			description: 'List of roles associated with the user',
		},
	},
});

/**
 * @type UserInput
 * @description Input model for our users
 */
module.exports.UserInput = new graphql.GraphQLInputObjectType({
	name: 'UserInput',
	fields: {
		roles: {
			type: new graphql.GraphQLList(graphql.GraphQLString),
			description: 'List of roles associated with the user',
		},
	},
});
