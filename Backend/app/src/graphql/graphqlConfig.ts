
import { ApolloServer } from "apollo-server-express";
import * as path from "path";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import {
  generateUniqueRequestId,
  getErrorCode,
  getErrorMessage,
} from "./errorHandlings";
import { AgentResolver } from "../controllers/resolvers/agentResolver";
import { EmployeeResolver } from "../controllers/resolvers/employeeResolver";

export async function getGraphQLServer() {
  const schema = await buildSchema({
    resolvers: [AgentResolver,EmployeeResolver],
    emitSchemaFile: path.resolve(__dirname, "./../generated", "schema.gql"),
    validate: { forbidUnknownValues: false },
  });

  const server = new ApolloServer({
    schema: schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    introspection: true,
    cache: "bounded",
    formatError: (error) => ({
      code: getErrorCode(error.message),
      message: getErrorMessage(error.message),
      path: error.path,
    }),
    context: ({ req, res }) => {
      let requestId = generateUniqueRequestId(req);
      const startTime :any= new Date();

      // Extract token from the authorization header
      const token = req?.headers?.authorization;
      if (token) {
        // Uncomment and complete your token decryption logic here
        // const decodedToken: any = jwt.decode(token);
        // if (decodedToken && decodedToken.email) {
        //   requestId = `${requestId} - ${decodedToken.email}`;
        // }
      }

      // Function to log the response time
      const logResponseTime = () => {
        const endTime:any = new Date();
        const elapsedTime = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`Response time: ${elapsedTime} seconds`);
      };

      const context = {
        req,
        res,
        requestId,
        logResponseTime,
      };

      return context;
    },
  });

  await server.start();
  return server;
}
