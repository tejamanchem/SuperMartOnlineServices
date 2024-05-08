import { ApolloServer, AuthenticationError } from "apollo-server-express";
import * as path from "path";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import {
  generateUniqueRequestId,
  getErrorCode,
  getErrorMessage,
} from "./errorHandlings";
import { shield } from "graphql-shield";
import { isAdmin, isAuthenticated } from "../authorization/authChecker";
import { RedisConnector } from "../redis/RedisConnector";
import { applyMiddleware } from "graphql-middleware";
import glob from "glob";

async function getResolvers() {
  const resolverFilesPattern = path.join(
    process.cwd(),
    "./src/controllers/resolvers/*Resolver.ts"
  );

  // Use glob to find all resolver files
  const resolverFiles = await new Promise<string[]>((resolve, reject) => {
    glob(resolverFilesPattern, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });

  // Import resolver modules
  const resolvers = await Promise.all(
    resolverFiles.map(async (file) => {
      const module = await import(file);
      return module.default;
    })
  );

  return resolvers;
}
export async function getGraphQLServer() {
  const schema = await buildSchema({
    resolvers:await getResolvers() as any,
    emitSchemaFile: path.resolve(__dirname, "./../generated", "schema.gql"),
    validate: { forbidUnknownValues: false },
  });

  const permissions = shield(
    {
      Query: {
        getAgentDetails: isAdmin,
        getEmployeeDetails: isAuthenticated,
        getAllCustomers: isAdmin,
        getAllProducts: isAuthenticated,
        getProductById: isAuthenticated,
      },
      Mutation: {
        createAgent: isAdmin,
        createEmployee: isAdmin,
        deleteProduct: isAdmin,
        updateProduct: isAdmin,
        createProduct: isAdmin,
      },
    },
    {
      allowExternalErrors: true,
      debug:
        (await RedisConnector.getInstance().getKey("GRAPHQL_DEBUG")) == "true",
      fallbackError: new AuthenticationError("Forbidden Request"),
    }
  );

  const schemaWithPermissions: any = applyMiddleware(
    schema,
    permissions
  ) as any;

  const server = new ApolloServer({
    schema: schemaWithPermissions,
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
      const startTime: any = new Date();

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
        const endTime: any = new Date();
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
