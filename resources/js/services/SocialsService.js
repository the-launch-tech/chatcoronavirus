import Http from '../Http'
import * as action from '../store/actions'

const { log } = console

export default {
  increment: async ({ social, authId, itemId, type }) => {
    log('social', social)
    log('authId', authId)
    log('itemId', itemId)
    log('type', type)
    try {
      const { data } = await Http.put(`/api/socials/${social}/${authId}/${type}/${itemId}`)
      return data
    } catch (err) {
      throw err
    }
  },
}
