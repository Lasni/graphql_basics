import {
  GraphQLServer
} from "graphql-yoga"

import uuidv4 from 'uuid/v4';

// demo data array
let users = [{
  id: '1',
  name: 'Grega',
  email: 'grega@gmail.com',
  age: 32
}, {
  id: '2',
  name: 'Mujko',
  email: 'mujko@gmail.com'
}, {
  id: '3',
  name: 'Scungilli Man',
  email: 'scungilli@gmail.com'
}]

let posts = [{
    id: '1',
    title: 'postTitle1',
    body: 'postBody1',
    published: false,
    author: '1'
  },
  {
    id: '2',
    title: 'postTitle2',
    body: 'postBody2',
    published: true,
    author: '1'
  },
  {
    id: '3',
    title: 'postTitle3',
    body: 'postBody3',
    published: false,
    author: '2'
  }
]

let comments = [{
    id: '1',
    text: 'first comment',
    author: '3',
    post: '1'
  },
  {
    id: '2',
    text: 'second comment',
    author: '1',
    post: '1'
  },
  {
    id: '3',
    text: 'third comment',
    author: '2',
    post: '2'
  },
  {
    id: '4',
    text: 'fourth comment',
    author: '1',
    post: '2'
  }
]

// Type definitions (schema)
const typeDefs = `
  type Query {
    me: User!
    post: Post!
    comments: [Comment!]!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: 'userID',
        name: 'Grega',
        email: 'grega@gmail.com',
        age: 32
      }
    },
    post() {
      return {
        id: 'postID',
        title: 'Title post',
        body: 'This is some post body',
        published: true
      }
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      }
      return posts.filter((post) => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch || isBodyMatch
      })
    },
    comments(parent, args, ctx, info) {
      return comments
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email)
      if (emailTaken) {
        throw new Error("Email taken")
      }
      const user = {
        id: uuidv4(),
        ...args.data
      }
      users.push(user)
      return user
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id)
      if (userIndex === -1) { // no user was found
        throw new Error("User not found")
      }
      // delete user
      const deletedUsers = users.splice(userIndex, 1)

      // delete user's posts
      posts = posts.filter((post) => {
        const match = post.author === args.id

        // delete user's own post comments
        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id)
        }
        return !match
      })

      // delete user's comments on other posts
      comments = comments.filter((comment) => comment.author !== args.id)

      // return deleted user(s)
      return deletedUsers[0]
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author)
      if (!userExists) {
        throw new Error("User does not exist")
      }
      const post = {
        id: uuidv4(),
        ...args.data
      }
      posts.push(post)
      return post
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author)
      const postExists = posts.some((post) => post.id === args.data.post)
      if (!userExists) {
        throw new Error("The user does not exist")
      }
      if (!postExists) {
        throw new Error("The post does not exist")
      }
      const isPublished = posts.find((post) => post.id === args.data.post).published
      if (!isPublished) {
        throw new Error("The post is not published yet")
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      }
      comments.push(comment)
      return comment
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.post)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id)
    }
  }
}

// Server
const server = new GraphQLServer({
  typeDefs,
  resolvers
})
server.start(() => console.log('Server is running on localhost:4000'))