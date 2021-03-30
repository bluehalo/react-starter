# Client side development best practices

## Error handling in React Components
There is a component called `ErrorBoundary.js` in `src/client/components` that you can use to catch errors in your render method. You can think of it as a try/catch block around your render. However, it will not catch everything, specifically it does not catch errors inside events handlers. You should read https://reactjs.org/docs/error-boundaries.html to find out more about how they work.

Our error boundary component is generic and can be useful for wrapping individual pieces of your application, or even whole routes. It accepts an Explanation prop which is the UI you want to render in the event of an error. See example below.


## Example
Let's assume you want to render a chart that requires some data from an API. If the API call fails, or changes, or something in the chart breaks unexpectedly, you would not want the app to break or show a blank square in place of the chart.
Instead, you should have some sort of fallback UI. This shows how to wrap the Chart component with an error boundary and render the details to the user. In a real world application, you probably would not want the error message and stack trace to go to them, but you could show something.

```jsx harmony
function ExplanationComponent (props) {
    return (
        <details>
            <summary>Oops, something went wrong</summary>
            <p>{props.error.toString()}</p>
            <p>{props.errorInfo.componentStack}</p>
        </details>
    );
}

// Somewhere in your UI
<ErrorBoundary Explanation={ExplanationComponent}>
    <Chart />
</ErrorBoundary>
```

### TODO
Currently the ErrorBoundary component just renders the Explanation component when there is an error. That information should probably be sent to persistent storage somewhere and/or trigger a notification.
