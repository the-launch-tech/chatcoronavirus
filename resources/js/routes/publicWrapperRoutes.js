import React from 'react'
import { Redirect } from 'react-router-dom'
import Public from '../pages/Public'
import publicRoutes from './publicRoutes'
import Routes from './Routes'

export default [
  {
    path: '/',
    exact: false,
    auth: false,
    component: props => <Routes routes={publicRoutes} childGroup={Public} />,
    page: 'public',
  },
]
