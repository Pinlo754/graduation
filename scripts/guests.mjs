#!/usr/bin/env node
/**
 * Guest list helper.
 *
 *   npm run guests:links                 # print every guest's personal link
 *   npm run guests:export -- guests.csv  # write the guest list to a CSV (opens in Excel / Google Sheets)
 *   npm run guests:import -- guests.csv  # replace src/content/invitations.json with a CSV
 *
 * CSV columns: id, recipientName, displayName, personalMessage, rsvpEnabled, slug (optional URL override)
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataFile = resolve(root, "src/content/invitations.json");
const COLUMNS = ["id", "recipientName", "displayName", "personalMessage", "rsvpEnabled", "slug"];
const ID_PATTERN = /^[A-Za-z0-9_-]{1,40}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Copy of slugify() in src/lib/slug.ts — keep the two in sync. */
function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

function loadEnvSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  for (const name of [".env.local", ".env"]) {
    const file = resolve(root, name);
    if (!existsSync(file)) continue;
    const match = readFileSync(file, "utf8").match(/^NEXT_PUBLIC_SITE_URL=(.+)$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  }
  return "http://localhost:3000";
}

/** Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, newlines inside quotes). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

const csvCell = (value) => {
  const text = value === undefined || value === null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function readGuests() {
  return JSON.parse(readFileSync(dataFile, "utf8"));
}

function links() {
  const base = loadEnvSiteUrl().replace(/\/+$/, "");
  for (const guest of readGuests()) {
    const name = guest.displayName || guest.recipientName;
    console.log(`${guest.id}\t${name}\t${base}/invite/${guest.slug || slugify(guest.recipientName)}`);
  }
}

function exportCsv(file) {
  if (!file) throw new Error("Usage: npm run guests:export -- guests.csv");
  const lines = [COLUMNS.join(","), ...readGuests().map((g) => COLUMNS.map((c) => csvCell(g[c])).join(","))];
  // BOM so Excel opens Vietnamese text as UTF-8.
  writeFileSync(resolve(process.cwd(), file), "﻿" + lines.join("\r\n") + "\r\n", "utf8");
  console.log(`Exported ${lines.length - 1} guests → ${file}`);
}

function importCsv(file) {
  if (!file) throw new Error("Usage: npm run guests:import -- guests.csv");
  const text = readFileSync(resolve(process.cwd(), file), "utf8").replace(/^﻿/, "");
  const [header, ...rows] = parseCsv(text);
  if (!header) throw new Error("CSV is empty");
  const index = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  for (const required of ["id", "recipientName"]) {
    if (!(required in index)) throw new Error(`CSV is missing the "${required}" column`);
  }
  const seen = new Set();
  const seenSlugs = new Map();
  const guests = rows.map((cells, n) => {
    const get = (col) => (col in index ? (cells[index[col]] ?? "").trim().normalize("NFC") : "");
    const id = get("id");
    const line = n + 2;
    if (!ID_PATTERN.test(id)) throw new Error(`Line ${line}: invalid id "${id}" (letters, digits, - or _)`);
    if (seen.has(id)) throw new Error(`Line ${line}: duplicated id "${id}"`);
    seen.add(id);
    const recipientName = get("recipientName");
    if (!recipientName) throw new Error(`Line ${line}: recipientName is required`);
    const guest = { id, recipientName };
    if (get("displayName")) guest.displayName = get("displayName");
    if (get("personalMessage")) guest.personalMessage = get("personalMessage");
    const slug = get("slug") || slugify(recipientName);
    if (!SLUG_PATTERN.test(slug)) throw new Error(`Line ${line}: can't make a URL from "${recipientName}" — fill the slug column (e.g. "nguyen-van-a")`);
    if (seenSlugs.has(slug)) throw new Error(`Line ${line}: URL /invite/${slug} is already used by "${seenSlugs.get(slug)}" — fill a different slug`);
    seenSlugs.set(slug, recipientName);
    if (get("slug")) guest.slug = slug;
    guest.rsvpEnabled = /^(true|1|yes|x|có)$/i.test(get("rsvpEnabled") || "true");
    return guest;
  });
  writeFileSync(dataFile, JSON.stringify(guests, null, 2) + "\n", "utf8");
  console.log(`Imported ${guests.length} guests → src/content/invitations.json`);
}

const [command, file] = process.argv.slice(2);
try {
  if (command === "links") links();
  else if (command === "export") exportCsv(file);
  else if (command === "import") importCsv(file);
  else {
    console.log("Commands: links | export <file.csv> | import <file.csv>");
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exitCode = 1;
}
