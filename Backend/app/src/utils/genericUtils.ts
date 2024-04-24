export function getTypeErrorMessage(error: any): any {
  if (error instanceof Error) {
    return error.message;
  } else if (error["message"] && error["error"]) {
    return error.message;
  } else if (typeof error == "string") {
    return error;
  }
  return JSON.stringify(error);
}
