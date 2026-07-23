const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("home navigation opens the established section views without a lower operator index", () => {
  assert.match(html, /<a class="brand" href="#home"/);
  assert.match(html, /data-view="home"/);
  assert.match(html, /data-view="artist"/);
  assert.match(html, /const viewOrder = \["dca", "projects", "artist", "studio", "writing", "contact"\]/);

  for (const route of ["dca", "projects", "artist", "studio", "writing", "contact"]) {
    assert.match(html, new RegExp(`data-view-trigger="${route}"`));
  }

  assert.doesNotMatch(html, /class="home-admin/);
  assert.doesNotMatch(html, /data-home-admin-index/);
  assert.match(html, /id="searchTrigger"/);
  assert.match(html, /class="icon-button header-search"/);
  assert.match(html, /\.site-nav__link \{[\s\S]*?font-weight: 500;/);
  assert.match(html, /\.site-nav \{[\s\S]*?gap: var\(--space-6\);/);
  assert.match(html, /\[data-theme="light"\] \{[\s\S]*?--home-canvas: #FAF9F7;/);
  assert.doesNotMatch(html, /id="headerSearchInput"/);
  assert.doesNotMatch(html, /id="themeLabel"/);
  assert.doesNotMatch(html, /<footer class="site-footer">/);
  assert.doesNotMatch(html, /DCA \/ FIELD OBJECT/);
  assert.doesNotMatch(html, /home-landing__caption/);
  assert.doesNotMatch(html, /Designed from archive evidence/);
});
