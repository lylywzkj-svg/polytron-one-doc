// Reviewed against both versions' feature descriptions. Playback intentionally stays version-specific.
export const sharedV1VisualModules = [
  "overview",
  "home-overview",
  "alarm-trigger",
  "alarm-trigger-alarm-flow",
  "alarm-trigger-video-clip",
  "cameras",
  "cameras-camera-management",
  "cameras-recording-schedule",
  "cameras-alarm-settings",
  "notifications",
  "settings",
  "settings-role-settings",
] as const;

const compatibleModules = new Set<string>(sharedV1VisualModules);

export function visualSourceDocId(docId: string) {
  const legacy = /^(en-)?v1-(.+)$/.exec(docId);
  if (!legacy || !compatibleModules.has(legacy[2])) return docId;
  return `${legacy[1] ?? ""}${legacy[2]}`;
}

export function visualLinkForVersion(route: string, legacy: boolean) {
  return legacy ? route.replace(/^(\/(?:zh|en)\/docs)(?=\/|$)(?!\/v1(?:\/|$))/, "$1/v1") : route;
}
