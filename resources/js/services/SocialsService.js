import Http from '../Http'
import actions from '../store/actions'

const { log } = console

export default {
  increment: async ({ social, authId, itemId, type }) => {
    try {
      const { data } = await Http.put(`/api/socials/${social}/${authId}/${type}/${itemId}`)
      return data
    } catch (err) {
      throw err
    }
  },
}
