const test = require("node:test");
const assert = require("node:assert/strict");
const handler = require("./auth");

const makeResponse = () => {
  const result = { statusCode: 0, body: null, headers: {} };
  return {
    result,
    status(code) { result.statusCode = code; return this; },
    json(body) { result.body = body; return this; },
    setHeader(name, value) { result.headers[name] = value; }
  };
};

test("auth rejects a request with an incorrect password", () => {
  const previous = process.env.DCA_EDITOR_PASSWORD;
  process.env.DCA_EDITOR_PASSWORD = "private-access";
  const response = makeResponse();
  handler({ method: "POST", body: { password: "wrong" } }, response);
  assert.equal(response.result.statusCode, 401);
  assert.equal(response.result.body.ok, undefined);
  process.env.DCA_EDITOR_PASSWORD = previous;
});

test("auth accepts a request with the configured password", () => {
  const previous = process.env.DCA_EDITOR_PASSWORD;
  process.env.DCA_EDITOR_PASSWORD = "private-access";
  const response = makeResponse();
  handler({ method: "POST", body: { password: "private-access" } }, response);
  assert.equal(response.result.statusCode, 200);
  assert.equal(response.result.body.ok, true);
  process.env.DCA_EDITOR_PASSWORD = previous;
});
