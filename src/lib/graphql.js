const { graphqlHTTP } = require('express-graphql');
const config = require('../config/config');
const graphql = require('graphql');

/**
 * @function setupExpressGraphQL
 * @description Generate our root schemas and mutations and build the GraphQL server object
 */
function setupExpressGraphQL(context = {}) {
	// Find all of our query objects and add them to what will be the root schema
	let queryFields = config.files.queries.reduce((schema, pathToQuery) => {
		return Object.assign(schema, require(pathToQuery));
	}, {});

	// Find all of our mutation objects and add them to the root mutation schema
	let mutationFields = config.files.mutations.reduce((schema, pathToMutation) => {
		return Object.assign(schema, require(pathToMutation));
	}, {});

	// Combine them into our root schema
	let root = new graphql.GraphQLSchema({
		query: new graphql.GraphQLObjectType({
			name: 'Query',
			description: 'Query options for the application',
			fields: queryFields,
		}),
		mutation: new graphql.GraphQLObjectType({
			name: 'Mutation',
			description: 'Mutation options for the application',
			fields: mutationFields,
		}),
	});

	// Return a function we can use for our express route
	return graphqlHTTP((req, res) => {
		// Return the configuration object for the server
		return {
			context: Object.assign({ req, res }, context),
			graphiql: true,
			schema: root,
		};
	});
}

module.exports = {
	setupExpressGraphQL,
};
