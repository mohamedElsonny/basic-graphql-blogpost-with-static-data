import { GraphQLServer, PubSub } from 'graphql-yoga'
import resolvers from './resolvers'

import db from './db'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
    pubsub
  }
})

const port = 4040
server.start({ port }, () => {
  console.log(`the server is up on port ${port}`)
})
