import React from 'react'
import { Redirect } from 'react-router-dom'
import PublicWrapper from '../pages/PublicWrapper'
import publicWrapperRoutes from './publicWrapperRoutes'
import Routes from './Routes'

export default [
  {
    path: '/',
    exact: false,
    auth: false,
    component: props => <Routes routes={publicWrapperRoutes} childGroup={PublicWrapper} />,
  },
]
