import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function checkNotifyProperty(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const body = request.body || {};
  const notifyExists = hasProperty(body, "notify");

  const response = notifyExists
    ? { status: 200, body: "Body contains notify property" }
    : { status: 404, body: "Body is missing notify property" };

  return response;
}

// Recursive function to check if a property exists in a nested object
function hasProperty(obj: Object, key: string): boolean {
  if (typeof obj !== "object" || obj === null) return false;

  if (key in obj) return true;

  return Object.keys(obj).some((k) => hasProperty(obj[k], key));
}

app.http("checkNotifyProperty", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: checkNotifyProperty,
});
