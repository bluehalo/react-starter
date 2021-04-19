import React, { useEffect, useState } from 'react';

/**
 * @function Loader
 * @description Shows a progress bar or a loading wheel/message
 */
export default function Loader() {
	let [isPastDelay, setIsPastDelay] = useState(false);

	// Use an effect to track mount and unmount
	useEffect(() => {
		// Set a timeout for 200 ms, we dont need to show the loader if
		// the app is only loading something for 20 seconds
		let timeout = setTimeout(() => setIsPastDelay(true), 200);

		// Clear the timeout is this component is unmounted
		return () => clearTimeout(timeout);
	}, []);

	return isPastDelay ? <span className="loading-indicator">Loading ... </span> : null;
}
