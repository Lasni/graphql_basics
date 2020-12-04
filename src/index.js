import {
  GraphQLServer
} from "graphql-yoga"


// Type definitions (schema)
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return "This is my first query"
    },
    name() {
      return "Grega Lasnibat"
    },
    location() {
      return "Ljubljana, Slovenija"
    },
    bio() {
      return "Keeping my pants high and tight, following proto and feathering it."
    }
  }
}

// Server
const server = new GraphQLServer({
  typeDefs,
  resolvers
})
server.start(() => console.log('Server is running on localhost:4000'))