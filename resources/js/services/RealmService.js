import Http from '../Http'
import actions from '../store/actions'

const { log } = console

export default {
  get: async dispatch => {
    try {
      const { data } = await Http.get('/api/realms')
      dispatch(actions.REALM.getAll(data))
    } catch (err) {
      throw err
    }
  },
}
