import { default as React } from 'react';
import { Switch as ReactRouterSwitch } from 'react-router-dom';
import Loader from '../core/Loader';
import SecureRoute from './SecureRoute';

/**
 * @function Routes
 * @description Generates a set of routes for our switch
 */
export default function Switch({ routes = [], ...props }) {
	return (
		<ReactRouterSwitch>
			{routes.map((route, index) => (
				<SecureRoute
					key={index}
					path={route.path}
					exact={route.exact}
					// Params necessary for secure route to determine access
					user={props.user}
					requiredRoles={route.requiredRoles}
					// Render that gets called if the user can access this page
					render={(routerProps) => (
						<React.Suspense fallback={<Loader />}>
							<route.component {...props} router={routerProps} />
						</React.Suspense>
					)}
				/>
			))}
		</ReactRouterSwitch>
	);
}
