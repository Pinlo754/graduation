import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";

const PUBLIC_DIR = join(process.cwd(), "public");

/**
 * Exact-case existence check. Windows/macOS treat "Code.jpg" and "code.jpg" as the
 * same file, but production servers run Linux and answer 404 — so compare names
 * against the real directory listing instead of using existsSync.
 */
function existsExactCase(publicPath: string): boolean {
  const relative = publicPath.replace(/^\/+/, "");
  const parts = relative.split("/");
  let dir = PUBLIC_DIR;
  for (const part of parts) {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return false;
    }
    if (!entries.includes(part)) return false;
    dir = join(dir, part);
  }
  return true;
}

function caseHint(publicPath: string): string {
  const relative = publicPath.replace(/^\/+/, "");
  try {
    const name = relative.split("/").pop()!;
    const match = readdirSync(join(PUBLIC_DIR, dirname(relative))).find((entry) => entry.toLowerCase() === name.toLowerCase());
    return match ? ` (file on disk is "${match}" — rename it or fix the path)` : " (file not found)";
  } catch {
    return " (folder not found)";
  }
}

describe("assets referenced in site.ts exist with the exact same casing", () => {
  const paths = [
    ...siteConfig.gallery.map((item) => item.src),
    ...(siteConfig.graduate.portrait ? [siteConfig.graduate.portrait] : []),
  ].filter((src) => src.startsWith("/"));

  it.each(paths)("%s", (src) => {
    expect(existsExactCase(src), `${src}${caseHint(src)}`).toBe(true);
  });
});
