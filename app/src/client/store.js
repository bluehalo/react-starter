import { applyMiddleware, combineReducers, createStore } from 'redux';
import loggerMiddleware from './middleware/dev.logger.middleware';
import asyncMiddleware from './middleware/async.middleware';
import { getUser } from './user/user.reducers';

// Add the async middleware
const middleware = [asyncMiddleware];

// This logger is ideal for development, but not for production
// It will log all actions and state updates to the console
if (process.env.NODE_ENV !== 'production') {
	middleware.push(loggerMiddleware);
}

// Configure our reducers
const reducers = combineReducers({
	user: getUser,
});

export default createStore(reducers, applyMiddleware(...middleware));
