import React from 'react';
import { Redirect, Route } from 'react-router-dom';

/**
 * @function SecureRoute
 * @description Redirect users trying to access pages that are visible in
 * the UI but they do not have permission to view it
 * @param {*} props
 */
export default function SecureRoute(props) {
	let { path, exact, render, user, requiredRoles, ...rest } = props;

	return (
		<Route
			{...rest}
			path={path}
			exact={exact}
			render={(routerProps) => {
				let roles = user.data.roles
				// Only render the target page if the user has the required roles
				if (requiredRoles.every((role) => roles.includes(role))) {
					return render(routerProps);
				}
				// Redirect to the homepage when the incorrect page is accessed
				else {
					let to = { pathname: '/', state: { from: routerProps.location } };
					return <Redirect to={to} />;
				}
			}}
		/>
	);
}
