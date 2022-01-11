import thunk from './async.middleware';

// Mock way to initialize middleware the same way redux does
let init = () => {
	let store = { dispatch: jest.fn(), getState: jest.fn() };
	let next = jest.fn();
	// Setup a way to invoke the middleware
	let invoke = (action) => thunk(store)(next)(action);

	return { store, next, invoke };
};

describe('Async Middleware', () => {
	test('passes non async actions straight through', () => {
		let action = { type: 'TESTING' };
		let { next, invoke } = init();

		invoke(action);
		expect(next).toHaveBeenCalledWith(action);
	});

	test('invokes the provided async function', () => {
		let { invoke } = init();
		let action = jest.fn();

		invoke(action);
		expect(action).toHaveBeenCalled();
	});

	test('injects dispatch into function', () => {
		let { store, invoke } = init();

		invoke((dispatch, getState) => {
			dispatch('TESTING');
			getState('GETTING STATE');
		});

		expect(store.dispatch).toHaveBeenCalledWith('TESTING');
		expect(store.getState).toHaveBeenCalledWith('GETTING STATE');
	});
});
