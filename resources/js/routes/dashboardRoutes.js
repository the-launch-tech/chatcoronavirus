import Profile from '../pages/dashboard/Profile'
import WritePost from '../pages/dashboard/WritePost'
import EditPost from '../pages/dashboard/EditPost'
import Archive from '../pages/dashboard/Archive'

export default [
  {
    path: '/dashboard/:user_id',
    exact: true,
    auth: true,
    control: 1,
    redirection: '/login',
    component: Profile,
    page: 'profile',
  },
  {
    path: '/dashboard/:user_id/:format',
    exact: true,
    auth: true,
    control: 1,
    redirection: '/login',
    component: Archive,
    page: 'archive',
  },
  {
    path: '/dashboard/:user_id/:format/write',
    exact: true,
    auth: true,
    control: 1,
    redirection: '/login',
    component: WritePost,
    page: 'writepost',
  },
  {
    path: '/dashboard/:user_id/:format/:slug',
    exact: true,
    auth: true,
    control: 1,
    redirection: '/login',
    component: EditPost,
    page: 'editpost',
  },
]
