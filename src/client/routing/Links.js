import { NavLink } from 'react-router-dom';
import React from 'react';

/**
 * @function Links
 * @description Generates a set of navigation links
 */
export default function Links({ routes = [] }) {
	return (
		<React.Fragment>
			{routes.filter((route) => route.path).map(route => (
				<li key={route.path}>
					<NavLink
						className="navigation-link"
						activeClassName="active"
						to={route.path}
						exact={true}>
						<span className="hidden">{route.name}</span>
						<route.icon className="navigation-link__icon" />
					</NavLink>
				</li>
			))}
		</React.Fragment>
	);
}
