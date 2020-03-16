import Http from '../Http'
import * as action from '../store/actions'

const { log } = console

export default {
  get: async dispatch => {
    try {
      const { data } = await Http.get('/api/realms')
      dispatch(action.realmsAll(data))
    } catch (err) {
      throw err
    }
  },
}
