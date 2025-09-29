// functions/[api].js
export async function onRequest(context) {
  const { request } = context;

  // Rewrite the path: remove `/api` prefix
  const url = new URL(request.url);
  url.hostname = "mugiwara-clan.onrender.com"; // Your backend Render domain
  url.protocol = "https:";
  url.port = "";

  url.pathname = url.pathname.replace(/^\/api/, "");

  // Forward request to backend
  return fetch(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
}
