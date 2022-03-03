import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import './app.scss';
import { defaultAppState } from './config';
import Body from './core/Body';
import store from './store';



/**
 * Material UI Theme
 */
let theme = createMuiTheme({
	palette: {
		type: 'light',
		primary: blue,
		secondary: pink,
		error: red,
		tonalOffset: 0.2,
	},
	typography: {
		useNextVariants: true,
	},
});

/**
 * @function App
 * @description Root application component
 */
export default function App() {
	// Setup our default state
	let [state, setState] = useState(defaultAppState);

	// Use this hook to run on mount and unmount only
	useEffect(() => {
		// Subscribe to state changes
		let unsubscribe = store.subscribe(() => setState(store.getState()));

		// Unsubscribe before unmount
		return unsubscribe;
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<header className="header">Default Settings</header>
			<Body {...state} />
			<footer className="footer">Default Settings</footer>
		</ThemeProvider>
	);
}
