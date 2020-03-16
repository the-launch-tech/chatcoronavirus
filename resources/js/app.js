import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router } from 'react-router-dom'
import axios from 'axios'
import store from './store'
import Routes from './routes/Routes'
import Main from './Main'
import mainRoutes from './routes/main'
import Http from './Http'
import jwtToken from './store/utilities/token'
import isExpired from './store/utilities/isExpired'
import unsetAuth from './store/utilities/unsetAuth'
import * as action from './store/actions'

const renderApp = () => {
  render(
    <Provider store={store}>
      <Router>
        <Routes routes={mainRoutes} childGroup={Main} />
      </Router>
    </Provider>,
    document.getElementById('chatcoronavirus')
  )
}

window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
const token = document.head.querySelector('meta[name="csrf-token"]')
if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
}

store.dispatch(action.authCheck())

console.log('app theme', localStorage.getItem('theme'))

if (localStorage.getItem('theme')) {
  store.dispatch(action.auxTheme(localStorage.getItem('theme')))
} else {
  store.dispatch(action.auxTheme('nighttime'))
}

Http.defaults.headers.common['Authorization'] = `Bearer ${jwtToken()}`

Http.get('/api/topics', { params: { primary: 1 } })
  .then(({ data }) => store.dispatch(action.topicsPrimary(data)))
  .catch(console.error)

Http.get('/api/realms')
  .then(({ data }) => store.dispatch(action.realmsAll(data)))
  .catch(console.error)

Http.get('/api/formats')
  .then(({ data }) => store.dispatch(action.formatsAll(data)))
  .catch(console.error)

Http.get('/api/users', { params: { limit: 5, orderby: 'health_points', order: 'DESC' } })
  .then(({ data }) => store.dispatch(action.usersTop(data)))
  .catch(console.error)

Http.get('/api/posts/trending', {
  params: { limit: 5, formats: ['article', 'resource', 'thread'], trending_time: 10 },
})
  .then(({ data }) => store.dispatch(action.postsTrending(data)))
  .catch(console.error)

Http.get('/api/aux/google', { params: { limit: 10 } })
  .then(({ data }) => store.dispatch(action.auxGoogle(data)))
  .catch(console.error)

if (!!jwtToken() && !isExpired()) {
  Http.get('/api/auth/user')
    .then(({ data }) => store.dispatch(action.authGet(data.auth)))
    .then(renderApp)
    .catch(err => {
      store.dispatch(action.authGet(false))
      renderApp()
    })
} else {
  unsetAuth()
  renderApp()
}
