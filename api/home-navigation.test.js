const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
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
  assert.match(html, /assets\/illustrations\/vinyl-dca-home-light\.png/);
  assert.match(html, /assets\/illustrations\/vinyl-dca-home-dark\.png/);
  assert.match(html, /\[data-theme="dark"\] \.home-landing__art--light \{\s*display: none;/);
  assert.match(html, /\[data-theme="dark"\] \.home-landing__art--dark \{\s*display: block;/);
  assert.match(html, /\.home-landing__media img \{[\s\S]*?background: transparent;/);
  assert.match(html, /@media \(max-width: 768px\) \{[\s\S]*?body\.is-home-view \.site-nav \{[\s\S]*?display: flex;/);
  assert.match(html, /body\.is-home-view \.site-nav__link,\n\s+body\.is-home-view \.site-nav__link:hover,\n\s+body\.is-home-view \.site-nav__link\[aria-current="page"\] \{\n\s+min-height: 26px;\n\s+padding: 0;\n\s+white-space: nowrap;/);
  assert.match(html, /\[data-theme="light"\] \{[\s\S]*?--home-canvas: #FAF9F7;/);
  assert.doesNotMatch(html, /id="headerSearchInput"/);
  assert.doesNotMatch(html, /id="themeLabel"/);
  assert.doesNotMatch(html, /<footer class="site-footer">/);
  assert.doesNotMatch(html, /DCA \/ FIELD OBJECT/);
  assert.doesNotMatch(html, /home-landing__caption/);
  assert.doesNotMatch(html, /Designed from archive evidence/);
});

test("dark Home LP gives the cover outline a quieter secondary contrast", () => {
  const script = `
from PIL import Image
image = Image.open("assets/illustrations/vinyl-dca-home-dark.png").convert("RGBA")
assert image.getpixel((500, 280)) == (182, 182, 174, 255), image.getpixel((500, 280))
`;

  assert.doesNotThrow(() => {
    childProcess.execFileSync("python3", ["-c", script], { cwd: path.join(__dirname, "..") });
  });
});

test("light Home LP keeps warm-white grooves on the black record", () => {
  const script = `
from PIL import Image
image = Image.open("assets/illustrations/vinyl-dca-home-light.png").convert("RGBA")
assert image.getpixel((960, 340)) == (16, 16, 16, 255), image.getpixel((960, 340))
assert image.getpixel((1000, 420)) == (244, 244, 241, 255), image.getpixel((1000, 420))
assert image.getpixel((920, 650)) == (250, 249, 247, 255), image.getpixel((920, 650))
`;

  assert.doesNotThrow(() => {
    childProcess.execFileSync("python3", ["-c", script], { cwd: path.join(__dirname, "..") });
  });
});

test("dark Home LP keeps a gray sleeve, record label, and a dark spindle hole", () => {
  const script = `
from PIL import Image
image = Image.open("assets/illustrations/vinyl-dca-home-dark.png").convert("RGBA")
assert image.getpixel((500, 500)) == (101, 101, 101, 255), image.getpixel((500, 500))
assert image.getpixel((920, 650)) == (101, 101, 101, 255), image.getpixel((920, 650))
assert image.getpixel((900, 650)) == (16, 16, 16, 0), image.getpixel((900, 650))
assert image.getpixel((1040, 650)) == (244, 244, 241, 255), image.getpixel((1040, 650))
`;

  assert.doesNotThrow(() => {
    childProcess.execFileSync("python3", ["-c", script], { cwd: path.join(__dirname, "..") });
  });
});
