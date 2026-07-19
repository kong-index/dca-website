# Deep Couch Archive Website

Public website source for Deep Couch Archive (DCA), a sound studio and archive.

## Purpose

This repository is the client-facing website preview and publishing source. It contains only files needed to render the site:

- `index.html`
- `assets/images/` for web-optimized images
- `assets/identity/` for public identity, share, and favicon assets

Do not add raw photographs, raw video, meeting notes, internal direction, credentials, or private contact details.

## Local preview

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

`127.0.0.1` is a loopback address: the preview is available only on this Mac and is not publicly accessible. The port number can be changed when `4173` is already in use.

## Publishing workflow

1. Make changes locally.
2. Review the local preview.
3. Commit the reviewed change.
4. Push to the `main` branch.
5. Confirm the published preview before sharing it with a client.

The `qa/` folder is intentionally local-only and excluded from Git. Source artwork and raw material are also excluded from this public repository.

## Writing Prototype

- Public writing index: `#writing`
- Public post route: `#writing/<post-id>`
- Local operator editor: `#editor`

The current editor is a static prototype. Its access gate uses the demo code `dca-operator`, and drafted or published posts are stored only in the current browser's `localStorage`. It is useful for reviewing the writing flow, but it is not a secure administrator system and does not publish a post for other visitors.

The editor supports heading levels, bold, italic, lists, quotes, small/normal/large body text, image attachment or drag and drop with alt text and caption, external link URL with a visible label, and code blocks with a language label. Attached images are limited to 2 MB and stored as local browser data, so they do not upload, host, or publish anywhere. The editor accepts safe `http(s)` links and DCA's local `assets/` paths used in seeded examples, then sanitizes the saved body to a limited set of semantic HTML elements.

Before public operation, connect server-side authentication and a shared content store such as Supabase, Firebase, or a CMS. Do not treat a client-side code or an unlinked route as access control.
