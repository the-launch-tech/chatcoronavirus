import React from 'react'
import { Redirect } from 'react-router-dom'
import Home from '../pages/public/Home'
import User from '../pages/public/User'
import Archive from '../pages/public/Archive'
import Article from '../pages/public/Article'
import Donate from '../pages/public/Donate'
import Resource from '../pages/public/Resource'
import Search from '../pages/public/Search'
import TaxArchive from '../pages/public/TaxArchive'
import Thread from '../pages/public/Thread'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import Dashboard from '../pages/Dashboard'
import NoMatch from '../pages/public/NoMatch'
import dashboardRoutes from './dashboardRoutes'
import Routes from './Routes'

export default [
  {
    path: '/',
    exact: true,
    auth: false,
    component: Home,
    page: 'home',
  },
  {
    path: '/profile/:username',
    exact: false,
    auth: false,
    component: User,
    page: 'public-profile',
    title: 'Profile',
  },
  {
    path: '/articles',
    exact: true,
    auth: false,
    component: Archive,
    page: 'public-archive',
    title: 'Articles',
    type: 'format',
    slug: 'article',
  },
  {
    path: '/articles/:slug',
    exact: true,
    auth: false,
    component: Article,
    page: 'article',
  },
  {
    path: '/resources',
    exact: true,
    auth: false,
    component: Archive,
    page: 'public-archive',
    title: 'Resources',
    type: 'format',
    slug: 'resource',
  },
  {
    path: '/resources/:slug',
    exact: true,
    auth: false,
    component: Resource,
    page: 'resource',
  },
  {
    path: '/threads',
    exact: true,
    auth: false,
    component: Archive,
    page: 'public-archive',
    title: 'Threads',
    type: 'format',
    slug: 'thread',
  },
  {
    path: '/threads/:slug',
    exact: true,
    auth: false,
    component: Thread,
    page: 'thread',
  },
  {
    path: '/realms',
    exact: true,
    auth: false,
    component: props => <Redirect to="/" replace />,
  },
  {
    path: '/realms/:slug',
    exact: true,
    auth: false,
    component: Archive,
    page: 'public-archive',
    title: 'Realm',
    type: 'realm',
  },
  {
    path: '/topics',
    exact: true,
    auth: false,
    component: TaxArchive,
    page: 'public-taxonomy-archive',
    title: 'Topics',
    type: 'topic',
  },
  {
    path: '/topics/:slug',
    exact: true,
    auth: false,
    component: Archive,
    page: 'public-archive',
    title: 'Topic',
    type: 'topic',
  },
  {
    path: '/search',
    exact: true,
    auth: false,
    component: Search,
    page: 'search',
  },
  {
    path: '/donate',
    exact: true,
    auth: false,
    component: Donate,
    page: 'donate',
  },
  {
    path: '/login',
    exact: true,
    auth: false,
    component: Login,
    page: 'login',
  },
  {
    path: '/register',
    exact: true,
    auth: false,
    component: Register,
    page: 'register',
  },
  {
    path: '/forgot-password',
    exact: true,
    auth: false,
    component: ForgotPassword,
    page: 'forgot-password',
  },
  {
    path: '/reset-password',
    exact: true,
    auth: false,
    component: ResetPassword,
    page: 'reset-password',
  },
  {
    path: '/dashboard',
    exact: false,
    auth: true,
    control: 1,
    redirection: '/login',
    component: props => <Routes routes={dashboardRoutes} childGroup={Dashboard} />,
    page: 'dashboard',
  },
  {
    path: '',
    exact: true,
    auth: false,
    component: NoMatch,
    page: 'nomatch',
  },
]
