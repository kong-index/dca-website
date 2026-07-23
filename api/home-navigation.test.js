const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("home navigation keeps public routes and the lower information menu clear", () => {
  assert.match(html, /<a class="brand" href="#home"/);
  assert.match(html, /data-view="home"/);
  assert.match(html, /data-view="artist"/);
  assert.match(html, /const viewOrder = \["dca", "projects", "artist", "studio", "writing", "contact"\]/);

  for (const route of ["dca", "projects", "artist", "studio", "writing", "contact"]) {
    assert.match(html, new RegExp(`data-view-trigger="${route}"`));
  }

  for (const item of ["Terms of use", "Press", "Rights &amp; Licensing", "Instagram", "YouTube"]) {
    assert.match(html, new RegExp(item));
  }

  assert.match(html, /id="headerSearchInput"/);
  assert.match(html, /id="themeLabel"/);
  assert.doesNotMatch(html, /<footer class="site-footer">/);
  assert.doesNotMatch(html, /Designed from archive evidence/);
});
