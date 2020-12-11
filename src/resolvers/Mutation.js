import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email)
    if (emailTaken) {
      throw new Error("Email taken")
    }
    const user = {
      id: uuidv4(),
      ...args.data
    }
    db.users.push(user)
    return user
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id)
    if (userIndex === -1) { // no user was found
      throw new Error("User not found")
    }
    // delete user
    const deletedUser = db.users.splice(userIndex, 1)
    // delete user's posts
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id
      // delete user's own post comments
      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id)
      }
      return !match
    })
    // delete user's comments on other posts
    db.comments = db.comments.filter((comment) => comment.author !== args.id)
    // return deleted user(s)
    return deletedUser[0]
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args
    const user = db.users.find((user) => user.id === id)
    if (!user) {
      throw new Error("User not found")
    }
    // email update
    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email)
      if (emailTaken) {
        throw new Error("Email in use")
      }
      user.email = data.email
    }
    // name update
    if (typeof data.name === "string") {
      user.name = data.name
    }
    // age update
    if (typeof data.age !== "undefined") {
      user.age = data.age
    }
    return user
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author)
    if (!userExists) {
      throw new Error("User does not exist")
    }
    const post = {
      id: uuidv4(),
      ...args.data
    }
    db.posts.push(post)
    if (args.data.published) {
      pubsub.publish("post", { post })
    }
    return post
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id)
    if (postIndex === -1) {
      throw new Error("Post not found")
    }
    // delete post
    const deletedPost = db.posts.splice(postIndex, 1)
    // delete post comments
    db.comments = db.comments.filter((comment) => comment.post !== args.id)
    // return deleted post
    return deletedPost[0]
  },
  updatePost(parent, args, ctx, info) {
    const { id, data } = args
    const { db } = ctx
    const post = db.posts.find((post) => post.id === id)
    if (!post) {
      throw new Error("Post not found")
    }
    // title update
    if (typeof data.title === "string") {
      post.title = data.title
    }
    // body update
    if (typeof data.body === "string") {
      post.body = data.body
    }
    // published update
    if (typeof data.published === "boolean") {
      post.published = data.published
    }
    return post
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author)
    const postExists = db.posts.some((post) => post.id === args.data.post)
    if (!userExists) {
      throw new Error("The user does not exist")
    }
    if (!postExists) {
      throw new Error("The post does not exist")
    }
    const isPublished = db.posts.find((post) => post.id === args.data.post).published
    if (!isPublished) {
      throw new Error("The post is not published yet")
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    }
    db.comments.push(comment)
    pubsub.publish(`comment_${args.data.post}`, { comment: comment })

    return comment
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
    if (commentIndex === -1) {
      throw new Error("Comment not found")
    }
    const deletedComment = db.comments.splice(commentIndex, 1)
    return deletedComment[0]
  },
  updateComment(parent, args, ctx, info) {
    const { id, data } = args
    const { db } = ctx
    const comment = db.comments.find((comment) => comment.id === id)
    if (!comment) {
      throw new Error("Comment not found")
    }
    // text update
    if (typeof data.text === "string") {
      comment.text = data.text
    }
    return comment
  }
}

export { Mutation as default }