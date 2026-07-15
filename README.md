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
