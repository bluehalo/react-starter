# State Management

We currently use [Redux](https://redux.js.org/) for the majority of our state management. However, there are times when you may not need/want to use Redux and times when you should. Use the following sections as a guide if your new to the project.

## Local State

If your component is stateful, you should always start by trying to use local state. If that meets your application's needs, then you don't need Redux, Context, or any other state management solutions.

If you find that the state a particular component uses is needed elsewhere in the application, and is not a child that you can simply pass the state to, then you should consider using Context or Redux.

## Context

[Context](https://reactjs.org/docs/context.html) is intended for infrequent updates that are used in numerous components and can be cumbersome to pass throughout the application. If something is likely to update numerous times throughout the life of the application, or is only used in one location, it is probably better to be stored somewhere else. Good examples of things to store in context are themes or preference for locale.

## Redux

Redux is a very simple, functional style, top down solution for state management. It is based on the [Flux](https://facebook.github.io/flux/) design pattern. The concept is that any component can trigger an action, the action will be passed to all the reducers, if the reducer is the intended receiver, it can update some value of state. Once that state is updated, redux will emit a change event that your top level component can subscribe to. In your root component, you will pass any state down your component tree. This makes state management easy and can help in increasing the performance of your application.

### Stores

Stores should attempt to be as flat as possible, but in an attempt to keep things clean and organized, going one level deep is ok. So when creating your root reducer, this is ok:

```javascript
let root = combineReducers({
    foo: {
        bar: reducerFunction,
    },
});
```

but this is not:

```javascript
let root = combineReducers({
    foo: {
        bar: {
            baz: {
                thing: reducerFunction,
            },
        },
    },
});
```

#### Modeling your root store

There are four general categories most shared state will fall into. Use the following sections as a guide for adding state to your root application store.

#### API Calls

Most API calls will be stored in state using the following structure:

```javascript
import { REQUEST } from 'constants/status';

let defaultAppState = {
    // unique name for the API call
    countries: {
        // Available statuses are PENDING, COMPLETE, or FAILED
        status: QUERY.PENDING,
        // Error from the API call
        error: undefined,
        // Raw response from the API
        data: undefined,
    },
};
```

If the API call requires tracking of more than did it work or not, you may need use a different data structure.

API calls stored in the root store should store the raw response, and not a modified version of the response. If you want to store a modified response, that goes in the next section.

##### Derived Information

If you need to store a modified version of an API call response or a subset of the response, do so in this section. It's preferred to always keep the raw response in case we need access to that data in it at some point. Try to keep all derived information in this category.

```javascript
let defaultAppState = {
    // feel free to change this category name
    derived: {
        // Store a unique list of regions in response to the countries API call.
        // This way we do not need to make this transformation in each component
        // every time we re-render
        uniqueRegions: [],
    },
};
```

It is important that the default values here should match the expected data structure of your transformation. This simplifies rendering in the UI before the data resolves.

##### Pages

State that is specific to a page but needs to persist across navigation changes should also be in the root store. If the state should not persist across page changes, it should be in local state. Use the following model for page state:

```javascript
let defaultAppState = {
    // The key should match it's name in the src/client/pages directory
    home: {
        // Add any persistent home state here
    },
};
```

##### Shared Categories

Any shared state should try to fit into a shared category. For example, imagine your application has a shared set of filters that each page needs to incorporate in one way or another. In this case, we would add a top level `filters` category and place all filters in there.

```javascript
let defaultAppState = {
    // Come up with a unique name here
    filters: {
        selectedCountryISO: 'USA',
        countrySortOrder: 'asc',
    },
};
```

### Actions

Actions should return the following structure:

```javascript
let action = {
    // Required, Type of the action
    type: 'string',
    // Optional, Any payload associated with the action
    data: 'object',
    // Optional, the current state
    current: 'object',
};
```

#### Synchronous

Synchronous actions are fairly straight forward, but do not have the capability to access the current state. A sample synchronous action would look something like this:

```javascript
import { USER_LOGOUT, UPDATE_COUNTRY } from 'constants';

// Without any data
export function logout() {
    return { type: USER_LOGOUT };
}
// With data
export function setCountry(country) {
    return { type: UPDATE_COUNTRY, data: country };
}
```

#### Asynchronous

Asynchronous actions have a different signature. They must return a function and that function will have a `dispatcher` and a `getState` method injected into them. If your asynchronous action does not invoke the dispatcher, your store will never update. You must make sure to catch and handle all errors. Here is an example of an asynchronous action:

```javascript
import { FETCH_DATA_SUCCESS, FETCH_DATA_ERROR } from 'constants';
import service from 'services/user.service';

export const fetchUserData (username) {
    // Returning a function here signals to Redux this is async
    return (dispathcer, getState) => {
        // Return the promise, this will be useful for testing
        return service.getUserInfo(username)
            .then((response) => {
                return dispatch({
                    type: FETCH_DATA_SUCCESS,
                    current: getState(),
                    data: response
                });
            })
            .catch((err) => {
                return dispatch({
                    type: FETCH_DATA_ERROR,
                    data: err
                });
            });
    };
};
```

In this example, if the request is successful, we dispatch an action with the response from the API, along with the current state (which is optional). If the request fails, we dispatch a different action indicating a failure along with the error from the API. You can also use this if you need access to shared state when the action is not async, that would look like this:

```javascript
import { UPDATE_INFORMATION } from 'constants';

export function updateInfo(information) {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_INFORMATION,
            data: information,
            current: getState(),
        });
    };
}
```

#### Testing Actions

Synchronous actions are really easy to test and you should do ss for all of them. Asynchronous actions are even more important to test, see `src/client/actions/user.actions.test.js` for an example. When writing async actions, you need to test that the dispatcher is fired in all possible scenarios.

### Reducers

Reducers should always be synchronous and immutable where possible. If your reducers are immutable, it will make it easier to optimize your app later using pure components due to memoization. Reducers in general should look something like this:

```javascript
import { UPDATE_INFORMATION } from 'constants';

export function updateInfo(state = defaultState, action) {
    let { type, data } = action;

    if (type === UPDATE_INFORMATION) {
        // Return a new version of the state if an object or array
        return Object.assign({}, state, data);
    }
    // Always return state
    return state;
}
```

#### Testing Reducers

Reducers at a minimum should test at least three cases. First, that the reducer returns an expected default state when invoked without any state. Second, that the provided state is updated when given the correct action type as expected. Finally, test that the provided state is not updated when invoked with a different action type. You can view `src/client/redcuers/user.reducers.test.js` as an example. Please add more tests if helpful.
