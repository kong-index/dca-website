const { parseBody, publishPost, sendJson } = require("./lib/publishing");

module.exports = async (request, response) => {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { error: "Method not allowed" });
  }
  const { password, post } = parseBody(request);
  try {
    const publishedPost = await publishPost(post, password);
    return sendJson(response, 200, { ok: true, post: publishedPost });
  } catch (error) {
    const message = error instanceof Error ? error.message : "글을 공개하지 못했습니다.";
    const statusCode = message.includes("권한") ? 401 : message.includes("환경변수") ? 503 : 400;
    return sendJson(response, statusCode, { error: message });
  }
};
