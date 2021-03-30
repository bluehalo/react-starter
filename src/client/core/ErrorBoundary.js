import React from 'react';

/**
 * @class ErrorBoundary
 * @description Wrapper Component for handling errors and rendering a user
 * friendly Explanation component
 */
export default class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	componentDidCatch(error, errorInfo) {
		// Update state so we can show something user friendly
		this.setState({ error, errorInfo });
		// TODO: Send error and any other useful information to a logging service or Slack
	}

	render() {
		let { error, errorInfo } = this.state;
		let { Explanation } = this.props;

		if (errorInfo) {
			return <Explanation error={error} errorInfo={errorInfo} />;
		}

		return this.props.children;
	}
}
