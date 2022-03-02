import React, { useEffect, useState } from 'react';
import routes from '../routes';
import Links from '../routing/Links';
import Switch from '../routing/Switch';
import store from '../store';
import { getActiveUser } from '../user/user.actions';
import Loader from './Loader';

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
			<nav className="navigation" aria-label="Main Menu">
				<ul className="navigation-menu">
					<Links routes={routes} />
				</ul>
			</nav>
			<div className="main-content flex">{isLoading ? <Loader /> : <Switch routes={routes} {...props} />}</div>
		</main>
	);
}
