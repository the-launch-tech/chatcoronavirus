import React from 'react'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import mapAuth from '../helpers/mapAuth'

const { log } = console

export default connect(mapAuth)(
  ({
    ChildGroup,
    component: Component,
    isAuthenticated,
    access,
    control,
    redirection,
    auth,
    dispatch,
    ...rest
  }) => {
    if (!isAuthenticated || parseInt(access) < control) {
      return (
        <Route
          {...rest}
          render={props => (
            <Redirect
              to={{
                pathname: redirection ? redirection : '/login',
                state: { from: props.location },
              }}
            />
          )}
        />
      )
    } else {
      return (
        <Route
          {...rest}
          render={props => (
            <ChildGroup>
              <Component {...props} {...rest} />
            </ChildGroup>
          )}
        />
      )
    }
  }
)
