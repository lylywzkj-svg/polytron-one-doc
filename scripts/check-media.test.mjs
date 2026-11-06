import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { checkPublicAssets } from "./check-media.mjs";

function fixture(t) {
  const root = resolve(tmpdir());
  const dir = mkdtempSync(join(root, "polytron-media-check-"));
  t.after(() => {
    assert.equal(dirname(resolve(dir)), root);
    rmSync(dir, { recursive: true });
  });
  return dir;
}

test("accepts binary media and regular assets in nested folders", t => {
  const dir = fixture(t);
  mkdirSync(join(dir, "media"));
  writeFileSync(join(dir, "media", "demo.mp4"), Buffer.from([0, 0, 0, 24, 102, 116, 121, 112]));
  writeFileSync(join(dir, "index.html"), "<!doctype html>");
  assert.deepEqual(checkPublicAssets(dir), { checked: 2, issues: [] });
});

test("rejects a Git LFS pointer masquerading as a video", t => {
  const dir = fixture(t);
  writeFileSync(join(dir, "demo.mp4"), "version https://git-lfs.github.com/spec/v1\noid sha256:" + "a".repeat(64) + "\nsize 41544467\n");
  const result = checkPublicAssets(dir);
  assert.equal(result.issues.length, 1);
  assert.match(result.issues[0], /demo\.mp4.*Git LFS/);
});

test("rejects a file beyond the deployment limit and accepts the boundary", t => {
  const dir = fixture(t);
  writeFileSync(join(dir, "too-large.mp4"), Buffer.alloc(9));
  writeFileSync(join(dir, "boundary.mp4"), Buffer.alloc(8));
  const result = checkPublicAssets(dir, { maxFileSize: 8 });
  assert.equal(result.issues.length, 1);
  assert.match(result.issues[0], /too-large\.mp4.*9 bytes.*8 bytes/);
});

test("reports all broken assets so deployment fixes cover every file", t => {
  const dir = fixture(t);
  writeFileSync(join(dir, "a.mp4"), "version https://git-lfs.github.com/spec/v1\n");
  mkdirSync(join(dir, "nested"));
  writeFileSync(join(dir, "nested", "b.mp4"), "version https://git-lfs.github.com/spec/v1\n");
  assert.equal(checkPublicAssets(dir).issues.length, 2);
});
