import superagent from 'superagent';

// Get User Query
let getUserQuery = `query GetUser($id: String!){
	getUser(id: $id){
		id,
		roles
	}
}`;

/**
 * @module UserService
 * @description All requests related to user functionality
 */
export default {
	/**
	 * @function getUser
	 * @description Get information about a user
	 */
	getUser() {
		return superagent.post('/api/graphql').send({
			query: getUserQuery,
			variables: {
				id: '1',
			},
		});
	},
};
