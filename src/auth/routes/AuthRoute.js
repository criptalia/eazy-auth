import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

/**
 * Ensure user logged otherwise redirect them to login
 *
 */
const AuthRoute = ({
  component,
  spinner = null,
  redirectTo = '/login',
  rememberReferrer = true,
  redirectTest,
  auth,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if (auth.authenticatingWithToken || auth.loginLoading) {
        // Show nothing or a cool loading spinner
        return spinner ? React.createElement(spinner) : null
      }
      // User authenticated
      if (auth.user) {
        // Use test function when provided
        if (typeof redirectTest === 'function') {
          const userRedirectTo = redirectTest(auth.user)
          if (userRedirectTo) {
            return (
              <Redirect
                to={{
                  pathname: userRedirectTo,
                }}
              />
            )
          }
        }
        // Render normal component
        return React.createElement(component, props)
      }
      // User not authenticated, redirect to login
      return (
        <Redirect
          to={{
            pathname: redirectTo,
            state: (rememberReferrer && !auth.logoutFromPermission)
              ? { referrer: props.location }
              : undefined,
          }}
        />
      )
    }}
  />
)

export default connect(({ auth }) => ({ auth }))(AuthRoute)
