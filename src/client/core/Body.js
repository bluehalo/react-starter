import { getActiveUser } from '../user/user.actions';
import React, { useEffect, useState } from 'react';
import Switch from '../routing/Switch';
import Links from '../routing/Links';
import routes from '../routes';
import Loader from './Loader';
import store from '../store';

/**
 * @function Body
 * @description Main body of our application
 */
export default function Body(props) {
	// Set our default state
	let [isLoading, setIsLoading] = useState(true);

	// Run this effect when the components mounts, only once
	useEffect(() => {
		store.dispatch(getActiveUser()).then(() => setIsLoading(false));
	}, []);

	return (
		<main className="body flex">
			<nav className="navigation">
				<ul className="navigation-menu">
					<Links routes={routes} />
				</ul>
			</nav>
			<div className="main-content">{isLoading ? <Loader /> : <Switch routes={routes} {...props} />}</div>
		</main>
	);
}
