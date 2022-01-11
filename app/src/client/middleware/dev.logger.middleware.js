const STYLE = {
	action: 'font-weight:bold;font-size:1.1em',
	state: 'color:blue;',
};

/**
 * @function logger
 * @description Redux Middleware for logging all actions and upcoming state
 * @param store
 * @returns {function}
 */
export default function logger(store) {
	return (next) => {
		return (action) => {
			let result = next(action);
			console.log(`%c ${action.type}:`, STYLE.action, action);
			console.log('%c $next state', STYLE.state, store.getState());
			return result;
		};
	};
}
