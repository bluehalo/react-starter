import logger from './dev.logger.middleware';

let init = (next = jest.fn(), getState = jest.fn(() => ({}))) => {
	let store = { getState };
	let invoke = (action) => logger(store)(next)(action);

	return { store, next, invoke };
};

let log;

describe('Development Logger Tests', () => {
	beforeAll(() => {
		log = console.log;
	});

	beforeEach(() => {
		console.log = jest.fn();
	});

	afterAll(() => {
		console.log = log;
	});

	test('should pass the action through to next', () => {
		let action = { type: 'TESTING' };
		let { next, invoke } = init();

		invoke(action);
		expect(next).toHaveBeenCalledWith(action);
	});

	test('should return the result of passing the action through next', () => {
		let next = jest.fn(() => 'RESULTS');
		let action = { type: 'TESTING' };
		let { invoke } = init(next);

		let result = invoke(action);
		expect(next).toHaveBeenCalledWith(action);
		expect(result).toEqual('RESULTS');
	});

	test('should log the results along with the action information', () => {
		let expected = 'RESULTS';
		let next = jest.fn(() => expected);
		let getState = jest.fn(() => expected);
		let action = { type: 'TESTING' };
		let { invoke } = init(next, getState);

		let result = invoke(action);
		expect(next).toHaveBeenCalledWith(action);
		expect(result).toEqual('RESULTS');
		// Check the logs
		expect(console.log).toHaveBeenCalledTimes(2);
		expect(console.log.mock.calls[0][0]).toContain(action.type);
		expect(console.log.mock.calls[0][2]).toBe(action);
		expect(console.log.mock.calls[1][2]).toContain(expected);
	});
});
