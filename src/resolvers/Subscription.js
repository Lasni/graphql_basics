const Subscription = {
  comment: {
    subscribe(parent, args, ctx, info) {
      const { postId } = args
      const { pubsub, db } = ctx
      const post = db.posts.find((post) => post.id === postId && post.published)
      if (!post) {
        throw new Error("Post not found")
      }
      return pubsub.asyncIterator(`comment_${postId}`) // "comment_1"
    }
  },
  post: {
    subscribe(parent, args, ctx, info) {
      const { pubsub } = ctx
      return pubsub.asyncIterator("post")
    }
  }
}

export { Subscription as default }