import { combineReducers } from 'redux'
import Auth from './Auth'
import Topic from './Topic'
import Realm from './Realm'
import Post from './Post'
import Format from './Format'
import User from './User'
import Aux from './Aux'
import Comment from './Comment'

export default combineReducers({
  Auth,
  Topic,
  Realm,
  Post,
  Format,
  User,
  Aux,
  Comment,
})
