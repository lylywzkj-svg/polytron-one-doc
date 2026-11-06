import { closeSync, openSync, readSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_FILE_SIZE = 1024 ** 3;
const LFS_HEADER = "version https://git-lfs.github.com/spec/v1";

export function checkPublicAssets(directory, { maxFileSize = MAX_FILE_SIZE } = {}) {
  const issues = [];
  let checked = 0;

  function visit(folder) {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const file = join(folder, entry.name);
      if (entry.isDirectory()) {
        visit(file);
        continue;
      }
      if (!entry.isFile()) continue;
      checked += 1;
      const name = relative(directory, file).replaceAll("\\", "/");
      const size = statSync(file).size;
      if (size > maxFileSize) {
        issues.push(`${name}: ${size} bytes exceeds the deployment limit of ${maxFileSize} bytes.`);
      }
      const descriptor = openSync(file, "r");
      const prefix = Buffer.alloc(LFS_HEADER.length);
      try {
        readSync(descriptor, prefix, 0, prefix.length, 0);
      } finally {
        closeSync(descriptor);
      }
      if (prefix.toString("utf8").startsWith(LFS_HEADER)) {
        issues.push(`${name}: unresolved Git LFS pointer; the actual asset has not been downloaded.`);
      }
    }
  }

  visit(directory);
  return { checked, issues };
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  const directory = fileURLToPath(new URL("../public/", import.meta.url));
  const result = checkPublicAssets(directory);
  if (result.issues.length) {
    console.error("Public asset validation failed:\n" + result.issues.join("\n"));
    console.error("Download Git LFS assets before building. On Vercel, enable Settings > Git > Git LFS and redeploy. Keep each public file at or below 1 GiB.");
    process.exitCode = 1;
  } else {
    console.log(`Validated ${result.checked} public assets: no unresolved LFS pointers or oversized files.`);
  }
}
