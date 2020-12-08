import {
  GraphQLServer
} from "graphql-yoga"

// demo data array
const users = [{
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

const posts = [{
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

const comments = [{
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