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
import getScreen from './store/utilities/getScreen'
import getTimelineContent from './store/utilities/getTimelineContent'
import getTheme from './store/utilities/getTheme'
import jwtToken from './store/utilities/token'
import isExpired from './store/utilities/isExpired'
import unsetAuth from './store/utilities/unsetAuth'
import actions from './store/actions'

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

store.dispatch(actions.AUTH.check())

getTheme(store.dispatch)
getTimelineContent(store.dispatch)
getScreen(store.dispatch)
window.addEventListener('resize', e => getScreen(store.dispatch))

Http.defaults.headers.common['Authorization'] = `Bearer ${jwtToken()}`

Http.get('/api/topics', { params: { primary: 1 } })
  .then(({ data }) => store.dispatch(actions.TOPIC.getPrimary(data)))
  .catch(console.error)

Http.get('/api/realms')
  .then(({ data }) => store.dispatch(actions.REALM.getAll(data)))
  .catch(console.error)

Http.get('/api/formats')
  .then(({ data }) => store.dispatch(actions.FORMAT.getAll(data)))
  .catch(console.error)

Http.get('/api/users', { params: { limit: 5, orderby: 'health_points', order: 'DESC' } })
  .then(({ data }) => store.dispatch(actions.USER.getTop(data)))
  .catch(console.error)

Http.get('/api/posts/trending', {
  params: { limit: 5, formats: ['article', 'resource', 'thread'], trending_time: 10 },
})
  .then(({ data }) => store.dispatch(actions.POST.getTrending(data)))
  .catch(console.error)

Http.get('/api/aux/google', { params: { limit: 10 } })
  .then(({ data }) => store.dispatch(actions.AUX.getGoogle(data)))
  .catch(console.error)

if (!!jwtToken() && !isExpired()) {
  Http.get('/api/auth/user')
    .then(({ data }) => store.dispatch(actions.AUTH.get(data.auth)))
    .then(renderApp)
    .catch(err => {
      store.dispatch(actions.AUTH.get(false))
      renderApp()
    })
} else {
  unsetAuth()
  renderApp()
}
