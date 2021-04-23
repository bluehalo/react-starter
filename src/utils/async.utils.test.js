const { wrapper, middleware, regardless } = require('./async.utils');

describe('Async Utils Tests', () => {
	describe('function: wrapper', () => {
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

	describe('function: middleware', () => {
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

	describe('function: regardless', () => {
		test('should resolve when all promises resolve', async () => {
			let results = await regardless([Promise.resolve('tyrion'), Promise.resolve('daenerys')]);

			expect(results).toBeDefined();
			expect(results[0]).toBe('tyrion');
			expect(results[1]).toBe('daenerys');
		});

		test('should resolve when all promises reject', async () => {
			let aegon = () => Promise.reject('aegon');
			let cersei = () => Promise.reject('cersei');

			let results = await regardless([aegon(), cersei()]);

			expect(results).toBeDefined();
			expect(results[0]).toBe('aegon');
			expect(results[1]).toBe('cersei');
		});

		test('should resolve when some resolve and some reject regardless of the failures', async () => {
			let aegon = () => Promise.reject('aegon');
			let cersei = () => Promise.reject('cersei');

			let results = await regardless([aegon(), cersei(), Promise.resolve('tyrion'), Promise.resolve('daenerys')]);

			expect(results).toBeDefined();
			expect(results[0]).toBe('aegon');
			expect(results[1]).toBe('cersei');
			expect(results[2]).toBe('tyrion');
			expect(results[3]).toBe('daenerys');
		});

		test('should allow me to filter errors from a group of promises', async () => {
			let errorOne = () => Promise.reject(new Error('400'));
			let errorTwo = () => Promise.reject(new Error('404'));

			let results = await regardless([errorOne(), errorTwo(), Promise.resolve(12)]);
			let errors = results.filter((result) => result instanceof Error);

			expect(errors).toHaveLength(2);
			expect(errors[0].message).toBe('400');
			expect(errors[1].message).toBe('404');
			expect(results).toHaveLength(3);
			expect(results[2]).toBe(12);
		});
	});
});
