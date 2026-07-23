const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("home navigation keeps the lower menu in three clear groups", () => {
  assert.match(html, /<a class="brand" href="#home"/);
  assert.match(html, /data-view="home"/);
  assert.match(html, /data-view="artist"/);
  assert.match(html, /const viewOrder = \["dca", "projects", "artist", "studio", "writing", "contact"\]/);

  for (const route of ["dca", "projects", "artist", "studio", "writing", "contact"]) {
    assert.match(html, new RegExp(`data-view-trigger="${route}"`));
  }

  for (const item of ["Archive", "Design", "Development", "Press", "Terms of use", "Rights &amp; Licensing", "Instagram", "YouTube"]) {
    assert.match(html, new RegExp(item));
  }

  assert.equal((html.match(/class="home-admin__group"/g) || []).length, 3);
  assert.match(html, /id="searchTrigger"/);
  assert.match(html, /class="icon-button header-search"/);
  assert.match(html, /body\.is-home-view \.site-header \{[\s\S]*?position: fixed;/);
  assert.match(html, /body\.is-home-view \.site-nav \{[\s\S]*?font-size: var\(--font-size-lg\);/);
  assert.match(html, /body\.is-home-view \.site-nav \{[\s\S]*?font-weight: 400;/);
  assert.match(html, /body\.is-home-view \.site-nav \{[\s\S]*?line-height: 30px;/);
  assert.match(html, /body\.is-home-view \.site-nav \{[\s\S]*?letter-spacing: 0;/);
  assert.match(html, /\[data-view\]\[hidden\] \{\s*display: none !important;/);
  assert.match(html, /\[data-theme="light"\] \{[\s\S]*?--home-canvas: #FAF9F7;/);
  assert.doesNotMatch(html, /id="headerSearchInput"/);
  assert.doesNotMatch(html, /id="themeLabel"/);
  assert.doesNotMatch(html, /<footer class="site-footer">/);
  assert.doesNotMatch(html, /DCA \/ FIELD OBJECT/);
  assert.doesNotMatch(html, /home-landing__caption/);
  assert.doesNotMatch(html, /Designed from archive evidence/);
});
