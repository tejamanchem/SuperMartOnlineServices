import { AuthChecker } from "type-graphql";
import { rule, shield } from "graphql-shield";
import { AuthenticationError } from "apollo-server-express";
import { logger as log } from "./../logger/logger";
import { RedisConnector } from "../redis/RedisConnector";
import jwt from "jsonwebtoken";
// const customAuthChecker: AuthChecker<any> = async (
//   { root, args, context, info },
//   roles
// ) => {
//   /**
//    * here we can read the user from context
//    * and check his permission in the firebase
//    * that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
//    */
//   if (
//     (await getCacheValue("SKIP_TOKEN_AUTHENTICATION")) ||
//     process.env.SKIP_TOKEN_AUTHENTICATION == "true"
//   ) {
//     log.info(
//       "customAuthChecker-isAuthenticated : Ignoring APIKey Authorization as SKIP_TOKEN_AUTHENTICATION - true"
//     );
//     return true;
//   }
//   const apiKey: string = context.req.headers.apikey;
//   if (
//     apiKey == process.env.MYACCOUNT_API_KEY ||
//     apiKey == process.env.MYZIPLY_API_KEY
//   ) {
//     return true;
//   }
//   log.error(
//     `customAuthChecker-customAuthChecker : Invalid API key ${apiKey} provided`
//   );
//   throw new AuthenticationError(
//     "Access denied! You need to be authorized to perform this action!"
//   );
// };

// async function checkWithLatestAccountNumbers(
//   contactId: string,
//   accountNumber: string
// ): Promise<any> {
//   let cxpContactService = new CxpContactService();
//   return await cxpContactService.checkWithLatestAccountNumbers(
//     contactId,
//     accountNumber
//   );
// }

const isAuthenticated = rule({ cache: "strict" })(
  async (parent, args, context) => {
    let skipAuthentication =
      (await RedisConnector.getInstance().getKey(
        "SKIP_TOKEN_AUTHENTICATION"
      )) || process.env.SKIP_TOKEN_AUTHENTICATION;

    if (skipAuthentication == "true") {
      log.info(
        `customAuthChecker-isAuthenticated : Ignoring token Authorization as SKIP_TOKEN_AUTHENTICATION - ${skipAuthentication}`
      );
      return true;
    }
    if (process.env.TYPE_OF_AUTHENTICATION == "token") {
      let token = context.req.headers.authorization
        ? context.req.headers.authorization.replace("Bearer", "").trim()
        : null;
      if (!token) {
        throw new AuthenticationError(
          "Access denied! You need to be authorized to perform this action!"
        );
      }

      let tokenResponse: any = { error: false };
      if (tokenResponse.error) {
        log.error(
          "customAuthChecker-isAuthenticated : Invalid Authentication Token Recieved"
        );
        throw new AuthenticationError(
          "Access denied! You need to be authorized to perform this action!"
        );
      }
      return true;
    } else if (process.env.TYPE_OF_AUTHENTICATION == "key") {
      if (
        context.req.headers["approvalkey"] &&
        process.env.APPROVAL_KEY == context.req.headers["approvalkey"]
      ) {
        return true;
      } else {
        log.error(
          "customAuthChecker-isAuthenticated : Invalid Authentication Token Recieved"
        );
        throw new AuthenticationError(
          "Access denied! You need to be authorized to perform this action!"
        );
      }
    }
    throw new AuthenticationError(
      "Access denied! You need to be authorized to perform this action!"
    );
  }
);

const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, context, info) => {
    try {
      let skipAuthentication =
        (await RedisConnector.getInstance().getKey(
          "SKIP_TOKEN_AUTHENTICATION"
        )) || process.env.SKIP_TOKEN_AUTHENTICATION;
      if (skipAuthentication == "false") {
        log.info(
          `customAuthChecker-isAdmin : Ignoring token Authorization as SKIP_TOKEN_AUTHENTICATION - ${skipAuthentication}`
        );
        return true;
      }
      // let token = context.req.headers.authorization
      //   ? context.req.headers.authorization.replace("Bearer", "").trim()
      //   : null;
      // if (!token) {
      //   throw new AuthenticationError(
      //     "Access denied! You need to be authorized to perform this action!"
      //   );
      // }

      let secondToken = context.req.headers.authorization;
      if (!secondToken) {
        throw new AuthenticationError(
          "Access denied! You need to be authorized to perform this action!"
        );
      }
      const decoded = jwt.verify(secondToken, process.env.JWT_SECRECT_KEY);
      console.log("decoded ", decoded);
      if (!decoded) {
        log.error(
          `customAuthChecker-isAdmin : Invalid Authentication Token Recieved`
        );
        throw new AuthenticationError(
          "Access denied! You need to be authorized to perform this action!"
        );
      }
      return true;
    } catch (error: any) {
      throw new AuthenticationError(
        "Access denied! You need to be authorized to perform this action!"
      );
    }
  }
);

export { isAuthenticated, isAdmin };
