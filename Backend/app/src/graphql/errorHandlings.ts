import { GraphQLObjectType, GraphQLSchema } from "graphql";



export const getErrorCode = (message: string): string => {
  if (!message) {
    return "400";
  }
  if (hasErrorCode(message)) {
    let statuscode: any = message.substring(0, 3);
    if (isNaN(statuscode)) {
      statuscode = "400";
    }
    return statuscode;
  }
  const matchResult = message.match(/\d+/);
  if (matchResult) {
    return matchResult[0];
  }
  if (
    message.toLowerCase() ===
    "access denied! you need to be authorized to perform this action!"
  ) {
    return "401";
  }
  if (message.toLowerCase() == "forbidden request") {
    return "403";
  }
  if (message.toLowerCase() == "internal server error") {
    return "500";
  }
  return "400"; // unkown error code
};

export const getErrorMessage = (message: string): string => {
  if (hasErrorCode(message)) {
    return message.slice(5).trim();
  }
  return message;
};

export const hasErrorCode = (error: any): boolean => {
  let message = error;
  if (error.message) {
    message = error.message;
  }
  if (!message) {
    return false;
  }
  const matchResult = message.match(/\d+/);
  if (matchResult) {
    return true;
  } else {
    return false;
  }
};

// export const unAuthorizedErrorPlugin: any = {
//   requestDidStart: () => ({
//     willSendResponse({ errors, response }) {
//       if (response && response.http) {
//         if (errors) {
//           response.data = undefined;
//           response.http.status = getErrorCode(errors[0].message);
//         }
//       }
//     },
//   }),
// };

export function generateUniqueRequestId(req: any) {
  const keyVariations = ["requestid", "requestId", "RequestId", "Requestid"];
  let requestId = null;
  if (req?.headers) {
    for (const variation of keyVariations) {
      if (req.headers[variation]) {
        requestId = req.headers[variation];
        break;
      }
    }
  }
  let date = Date.now().toString(36);
  return requestId
    ? requestId
    : date + Math.random().toString(36).substring(2, 12).padStart(10, date);
}
