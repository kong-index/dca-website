const test = require("node:test");
const assert = require("node:assert/strict");
const handler = require("./publish");

const makeResponse = () => {
  const result = { statusCode: 0, body: null, headers: {} };
  return {
    result,
    status(code) { result.statusCode = code; return this; },
    json(body) { result.body = body; return this; },
    setHeader(name, value) { result.headers[name] = value; }
  };
};

const withPublishingEnvironment = async (run) => {
  const previous = { ...process.env };
  process.env.DCA_EDITOR_PASSWORD = "private-access";
  process.env.GITHUB_TOKEN = "github-token";
  process.env.GITHUB_OWNER = "kong-index";
  process.env.GITHUB_REPOSITORY = "dca-website";
  process.env.GITHUB_BRANCH = "main";
  try {
    await run();
  } finally {
    process.env = previous;
  }
};

test("publish writes a valid public post to the GitHub content file", { concurrency: false }, async () => {
  await withPublishingEnvironment(async () => {
    const previousFetch = global.fetch;
    const requests = [];
    global.fetch = async (url, options) => {
      requests.push({ url, options });
      if (options.method === "GET") return new Response("Not found", { status: 404 });
      return new Response(JSON.stringify({ content: { sha: "next-sha" } }), { status: 201 });
    };
    try {
      const response = makeResponse();
      await handler({
        method: "POST",
        body: {
          password: "private-access",
          post: {
            id: "first-public-note",
            date: "2026-07-19",
            category: "studio",
            title: "첫 공개 기록",
            summary: "공개 저장을 확인하는 짧은 기록입니다.",
            bodyHtml: "<p>본문입니다.</p>",
            tags: ["studio"]
          }
        }
      }, response);
      assert.equal(response.result.statusCode, 200);
      assert.equal(response.result.body.post.status, "published");
      assert.equal(requests.length, 2);
      const written = JSON.parse(Buffer.from(JSON.parse(requests[1].options.body).content, "base64").toString("utf8"));
      assert.equal(written[0].id, "first-public-note");
    } finally {
      global.fetch = previousFetch;
    }
  });
});

test("publish rejects an incorrect operator password before calling GitHub", { concurrency: false }, async () => {
  await withPublishingEnvironment(async () => {
    const previousFetch = global.fetch;
    let called = false;
    global.fetch = async () => { called = true; throw new Error("GitHub should not be called"); };
    try {
      const response = makeResponse();
      await handler({ method: "POST", body: { password: "wrong", post: {} } }, response);
      assert.equal(response.result.statusCode, 401);
      assert.equal(called, false);
    } finally {
      global.fetch = previousFetch;
    }
  });
});
