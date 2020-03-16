export default {
  articles: item => {
    return {
      title: item ? item.title : '',
      content: item ? item.content : '',
      featured_image: item ? item.featured_image : '',
      excerpt: item ? item.excerpt : '',
      topics: item && item.topics ? item.topics.map(topic => topic.slug) : [],
      realms: item && item.realms ? item.realms.map(realm => realm.slug) : [],
    }
  },
  threads: item => {
    return {
      title: item ? item.title : '',
      content: item ? item.content : '',
      topics: item && item.topics ? item.topics.map(topic => topic.slug) : [],
      realms: item && item.realms ? item.realms.map(realm => realm.slug) : [],
    }
  },
  resources: item => {
    return {
      title: item ? item.title : '',
      content: item ? item.content : '',
      topics: item && item.topics ? item.topics.map(topic => topic.slug) : [],
      realms: item && item.realms ? item.realms.map(realm => realm.slug) : [],
      youtube_video_id: item ? item.youtube_video_id : '',
      external_url: item ? item.external_url : '',
      other_external_video_url: item ? item.other_external_video_url : '',
    }
  },
}
