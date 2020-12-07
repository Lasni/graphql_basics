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
    id: 'postid1',
    title: 'postTitle1',
    body: 'postBody1',
    published: false
  },
  {
    id: 'postid2',
    title: 'postTitle2',
    body: 'postBody2',
    published: true
  },
  {
    id: 'postid3',
    title: 'postTitle3',
    body: 'postBody3',
    published: false
  }
]

// Type definitions (schema)
const typeDefs = `
  type Query {
    me: User!
    post: Post!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
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
    }
  }
}

// Server
const server = new GraphQLServer({
  typeDefs,
  resolvers
})
server.start(() => console.log('Server is running on localhost:4000'))