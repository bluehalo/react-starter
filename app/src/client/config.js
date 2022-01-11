import { Map, List } from 'immutable';

// Default application state
export const defaultAppState = {
	user: new Map({
		status: 'INCOMPLETE',
		error: undefined,
		data: new Map({
			roles: new List(),
		}),
	}),
};
