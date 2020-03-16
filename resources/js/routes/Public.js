import React from 'react'
import { Route } from 'react-router'

export default ({ component: Component, ChildGroup, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        <ChildGroup>
          <Component {...rest} {...props} />
        </ChildGroup>
      )}
    />
  )
}
