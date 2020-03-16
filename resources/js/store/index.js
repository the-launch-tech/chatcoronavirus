import { applyMiddleware, createStore, compose } from 'redux'
import RootReducer from './reducers'
import ReduxThunk from 'redux-thunk'

const store = createStore(RootReducer, compose(applyMiddleware(ReduxThunk)))

export default store
