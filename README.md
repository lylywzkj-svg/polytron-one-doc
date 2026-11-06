# POLYTRON ONE Documentation

Bilingual POLYTRON ONE product documentation with a browser-based editor and Vercel serverless publishing API.

## Local development

```bash
npm install
npm run dev
```

- Documentation (English by default): `http://127.0.0.1:5173/`
- English documentation: `http://127.0.0.1:5173/en/docs`
- Chinese documentation: `http://127.0.0.1:5173/zh/docs`
- Editor: `http://127.0.0.1:5173/editor`

## Production build

```bash
npm run build
```

The Vite application is written to `dist/`. Vercel also deploys the functions in `api/` for editor login, publishing, media upload, and status checks.

## Vercel environment variables

Configure the following server-side variables before enabling the online editor:

- `EDITOR_PASSWORD`
- `EDITOR_SESSION_SECRET`
- `GITHUB_TOKEN`
- `GITHUB_REPO=lylywzkj-svg/polytron-one-doc`
- `GITHUB_BRANCH=main`
- `PRODUCTION_DOCS_URL=https://polytron-one-docs.vercel.app/docs`

Do not prefix secrets with `VITE_`. See `.env.example` for the complete configuration template.

## Large media

MP4 assets are tracked with Git LFS. Install Git LFS before cloning or contributing:

```bash
git lfs install
```

## Documentation versions

The public site serves V1.5 in Chinese and English. The version selector is temporarily hidden, and links containing `/docs/v1` open the corresponding V1.5 page while preserving the selected language, query parameters, and section anchor. Unprefixed documentation links default to English.

Future documentation updates apply to V1.5. Its source is `src/data.ts`; the internal version code `v2` still refers to V1.5 for compatibility. The historical V1 source in `src/legacyV1Data.ts` is preserved. The separate batch-2 diagram review drafts are not integrated into this repository.

Before deploying, configure the actual production URL and server-side publishing credentials for this repository. Uploading the source does not deploy a website.
