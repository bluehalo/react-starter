import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './app.js';
import React from 'react';

/**
 * @function launch
 * @description Render the root component when the page is ready
 */
let launch = function () {
	ReactDOM.render(
		<BrowserRouter>
			<App />
		</BrowserRouter>,
		document.getElementById('app-root'),
	);
};

if (document.readyState === 'complete') {
	launch();
} else {
	window.onload = launch;
}

// Enable HMR
if (process.env.NODE_ENV === 'development' && module && module.hot) {
	module.hot.accept('./app.js', () => {
		let HotApp = require('./app.js').default;
		ReactDOM.render(
			<BrowserRouter>
				<HotApp />
			</BrowserRouter>,
			document.getElementById('app-root'),
		);
	});
}
