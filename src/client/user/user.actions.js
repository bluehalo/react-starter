import service from './user.service';

/**
 * @function getUser
 * @description Get a user
 */
export function getUser() {
	return (dispatch) => {
		return service
			.getUser()
			.then((response) => dispatch({ type: 'user/get', data: response.body.data }))
			.catch((err) => dispatch({ type: 'user/get-failure', data: err }));
	};
}
