# Documentation scope

- V1.5 is the active documentation version. Unless the user explicitly requests another version, apply future content, layout, diagram, and media changes to V1.5 only.
- Current bilingual documentation lives in `src/data.ts`. The internal code `v2` refers to the public version V1.5; preserve this compatibility unless a migration is explicitly requested.
- Preserve the archived V1 source in `src/legacyV1Data.ts`. Do not synchronize new changes into V1 unless explicitly requested.
- Public documentation links must load V1.5. The version switcher is temporarily hidden; old `/docs/v1` links resolve to the matching current page. Preserve explicit Chinese URLs; default unprefixed links to English.
- Keep changes local unless the user explicitly requests a push or deployment.
