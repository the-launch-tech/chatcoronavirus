import Http from '../Http'
import actions from '../store/actions'

const { log } = console

export default {
  getComments: async ({ paged, posts_per_page, post_id, has_children, parent_id, order }) => {
    try {
      const { data } = await Http.get(`/api/comments/${post_id}`, {
        params: { paged, posts_per_page, has_children, parent_id, order },
      })
      return data
    } catch (err) {
      throw err
    }
  },
  save: async ({ parentId, postId, authId, content }) => {
    try {
      const { data } = await Http.post(`/api/comments/${postId}/${authId}`, {
        comment_id: parentId,
        content,
      })
      return data
    } catch (err) {
      throw err
    }
  },
  update: async ({ id, postId, authId, content }) => {
    try {
      const { data } = await Http.put(`/api/comments/${postId}/${authId}/${id}`, { content })
      return data
    } catch (err) {
      throw err
    }
  },
  delete: async ({ id, postId, authId }) => {
    try {
      const { data } = await Http.delete(`/api/comments/${postId}/${authId}/${id}`)
      return data
    } catch (err) {
      throw err
    }
  },
}
