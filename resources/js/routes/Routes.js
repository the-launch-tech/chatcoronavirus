import React from 'react'
import { Switch } from 'react-router-dom'
import PublicRoute from './Public'
import PrivateRoute from './Private'

const Routes = ({ routes, childGroup }) => (
  <Switch>
    {routes.map((route, i) => {
      if (route.auth) {
        return <PrivateRoute key={i} {...route} ChildGroup={childGroup} />
      } else {
        return <PublicRoute key={i} {...route} ChildGroup={childGroup} />
      }
    })}
  </Switch>
)

export default Routes
