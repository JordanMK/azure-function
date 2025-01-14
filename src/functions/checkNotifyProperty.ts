import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

// Regular expression to validate email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function checkNotifyProperty(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const body = request.body || {};
  const notifyValue = findProperty(body);

  if (notifyValue && emailRegex.test(notifyValue)) {
    return {
      status: 200,
      body: notifyValue,
    };
  } else if (notifyValue !== undefined) {
    return {
      status: 400,
      body: "The request body contains errors, and we could not send a notification as the 'notify' property is not a valid email address.",
    };
  } else {
    return {
      status: 404,
      body: "The request body contains errors, and we could not send a notification as the 'notify' property is missing.",
    };
  }
}

// Recursive function to find a property in a nested object (case-insensitive)
function findProperty(obj: Object): any {
  if (typeof obj !== "object" || obj === null) return undefined;

  // Loop through all keys in the object to find a case-insensitive match for 'notify'
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase() === "notify") {
      return obj[key];
    }
  }

  // Recursively search in nested values
  for (const value of Object.values(obj)) {
    const result = findProperty(value);
    if (result !== undefined) return result;
  }

  return undefined;
}

app.http("checkNotifyProperty", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: checkNotifyProperty,
});
