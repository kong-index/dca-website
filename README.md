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

## Writing and publishing

- Public writing index: `#writing`
- Public post route: `#writing/<post-id>`
- Local operator editor: `#editor`

The editor supports heading levels, bold, italic, lists, quotes, small/normal/large body text, image attachment from the toolbar or direct drag and drop into the body, and selected-text links. Paste or type a standalone `http(s)` URL and it is converted into a link when the editor loses focus. A post can include up to 8 images, each up to 2 MB, with a combined image size of 3 MB. Drafts remain only in the current browser. Public saves are authenticated by Vercel, stored in GitHub, and included in Vercel's next deployment.

## 운영자 글 공개 설정

Vercel에서만 실제 공개 저장을 사용한다. 운영자 비밀번호와 GitHub 토큰은 절대 저장소나 브라우저 코드에 넣지 않고 Vercel 환경변수로 관리한다.

1. Vercel 프로젝트 `dca-website`의 `Settings` → `Environment Variables`로 이동한다.
2. `Production` 환경에 `DCA_EDITOR_PASSWORD`와 `GITHUB_TOKEN`을 추가한다.
3. `GITHUB_TOKEN`은 GitHub fine-grained personal access token으로 만든다. 대상 저장소는 `kong-index/dca-website`만 선택하고 `Contents: Read and write` 권한만 부여한다.
4. `DCA_EDITOR_PASSWORD`는 `1234` 같은 짧은 번호가 아닌 긴 비공개 비밀번호를 사용한다.
5. 환경변수 저장 뒤 Vercel에서 `Redeploy`한다. `.env.example`의 나머지 값은 기본 설정을 바꿀 때만 추가한다.

공개 저장은 `content/writing-posts.json`을 갱신하고, 본문에 넣은 이미지는 `assets/uploads/writing`에 저장한다. GitHub 커밋이 생성되면 Vercel이 자동으로 새 배포를 만든다.
