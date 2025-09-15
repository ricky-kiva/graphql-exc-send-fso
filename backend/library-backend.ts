import { ApolloServer } from '@apollo/server';
import typeDefs from './graphql/schemas';
import resolvers from './graphql/resolvers';
import connectToMongoDB from './db/connect';
import jwt from 'jsonwebtoken';
import User from './db/schemas/User';
import { JwtPayload } from './jwt/types/JwtPayload';
import { Context } from './graphql/types/Context';
import express from 'express';
import http from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import { expressMiddleware } from '@as-integrations/express5';
import { useServer } from 'graphql-ws/use/ws';
import { WebSocketServer } from 'ws';

async function startServer() {
  const PORT = 4000;

  await connectToMongoDB();

  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        serverWillStart() {
          return Promise.resolve({
            async drainServer() {
              await serverCleanup.dispose();
            },
          });
        }
      }
    ]
  });

  await server.start();

  app.use('/', cors(), express.json(), expressMiddleware(server, {
    context: async ({ req }): Promise<Context> => {
      const auth = req.headers.authorization || null;

      if (auth?.startsWith("Bearer ")) {
        try {
          const decodedToken = jwt.verify(
            auth.substring(7), 
            process.env.JWT_SECRET as string
          ) as JwtPayload;

          const currentUser = await User.findById(decodedToken.id);

          return { currentUser } as Context;
        } catch (e) {
          console.error(`Invalid token: ${e}`);
        }
      }

      return { currentUser: null } as Context;
    }
  }));

  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
  });
}

startServer().catch((e) => {
  console.error(e);
});
