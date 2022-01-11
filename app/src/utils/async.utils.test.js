const { wrapper, middleware } = require('./async.utils');

describe('Async Utils Tests', () => {
	describe('method: wrapper', () => {
		test('should pass data back from a promise', async () => {
			let promise = Promise.resolve('Aegon');
			let [err, results] = await wrapper(promise);
			expect(err).toBeUndefined();
			expect(results).toBe('Aegon');
		});

		test('should pass an error back from a promise', async () => {
			let promise = Promise.reject('Cersei');
			let [err, results] = await wrapper(promise);
			expect(err).toBe('Cersei');
			expect(results).toBeUndefined();
		});

		test('should handle uncaught exceptions in async', async () => {
			let func = async () => {
				throw 'Tyrion';
			};

			let [err, results] = await wrapper(func());
			expect(err).toBe('Tyrion');
			expect(results).toBeUndefined();
		});

		test('should pass data back in an async function', async () => {
			let func = async () => {
				return 'Daenerys';
			};

			let [err, results] = await wrapper(func());
			expect(err).toBeUndefined();
			expect(results).toBe('Daenerys');
		});
	});

	describe('method: middleware', () => {
		test('should allow an async controller to correctly resolve data', async () => {
			async function controller(_req, _res, _next) {
				// Just imagine we are waiting for something
				// like a better ending to the white walkers :(
				return 'data';
			}

			// Dont worry about req, res, we do not need to do anything with
			// them for these tests
			let req = {},
				res = {};
			let next = jest.fn();
			let asyncMiddleware = middleware(controller);
			let results = await asyncMiddleware(req, res, next);

			expect(results).toBe('data');
		});

		test('should catch an expected error from an async controller', async () => {
			async function controller(_req, _res, next) {
				let error = new Error('Fubar');
				next(error);
			}

			let req = {},
				res = {};
			let nextMock = jest.fn();
			let asyncMiddleware = middleware(controller);
			let results = await asyncMiddleware(req, res, nextMock);

			expect(results).toBe(undefined);
			expect(nextMock).toHaveBeenCalledTimes(1);
			expect(nextMock.mock.calls[0][0]).toBeDefined();
			expect(nextMock.mock.calls[0][0].message).toBe('Fubar');
		});

		test('should catch an unexpected error from an async controller', async () => {
			async function controller(_req, _res, _next) {
				throw new Error('Fubar');
			}

			let req = {},
				res = {};
			let nextMock = jest.fn();
			let asyncMiddleware = middleware(controller);
			let results = await asyncMiddleware(req, res, nextMock);

			expect(results).toBe(undefined);
			expect(nextMock).toHaveBeenCalledTimes(1);
			expect(nextMock.mock.calls[0][0]).toBeDefined();
			expect(nextMock.mock.calls[0][0].message).toBe('Fubar');
		});
	});
});
