const { getConfig, isValidPassword, parseBody, sendJson } = require("./lib/publishing");

module.exports = (request, response) => {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { error: "Method not allowed" });
  }
  const { password } = parseBody(request);
  const { password: expectedPassword } = getConfig();
  if (!expectedPassword) return sendJson(response, 503, { error: "Publishing is not configured." });
  if (!isValidPassword(password, expectedPassword)) return sendJson(response, 401, { error: "Invalid operator access." });
  return sendJson(response, 200, { ok: true });
};
