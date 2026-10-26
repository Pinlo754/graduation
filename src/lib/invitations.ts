// Relative imports (no "@/" alias): next.config.ts loads this module to build redirects.
import rawInvitations from "../content/invitations.json";
import { isValidSlug, slugify } from "./slug";

export interface Invitation {
  /** Stable record id (shown as "No. 001" on the ticket, sent with RSVPs). */
  id: string;
  /** URL segment: /invite/<slug>. Derived from recipientName unless set explicitly. */
  slug: string;
  recipientName: string;
  /** Short name used in greetings. Falls back to the last word of recipientName. */
  displayName?: string;
  personalMessage?: string;
  rsvpEnabled?: boolean;
}

/** Letters, digits, dash and underscore only. */
export const INVITATION_ID_PATTERN = /^[A-Za-z0-9_-]{1,40}$/;

export function isValidInvitationId(id: unknown): id is string {
  return typeof id === "string" && INVITATION_ID_PATTERN.test(id);
}

/**
 * Validates the raw dataset once at load time so a typo in the JSON file
 * fails the build loudly instead of shipping a broken invitation.
 */
export function parseInvitations(data: unknown): Invitation[] {
  if (!Array.isArray(data)) throw new Error("invitations.json must contain an array");
  const seenIds = new Set<string>();
  const seenSlugs = new Map<string, string>();
  const parsed = data.map((entry, index) => {
    const where = `invitations.json[${index}]`;
    if (typeof entry !== "object" || entry === null) throw new Error(`${where} must be an object`);
    const record = entry as Record<string, unknown>;
    const id = typeof record.id === "string" ? record.id.trim() : "";
    if (!isValidInvitationId(id)) throw new Error(`${where}.id "${String(record.id)}" is invalid (use letters, digits, - or _)`);
    if (seenIds.has(id)) throw new Error(`${where}.id "${id}" is duplicated`);
    seenIds.add(id);
    const recipientName = typeof record.recipientName === "string" ? record.recipientName.trim().normalize("NFC") : "";
    if (!recipientName) throw new Error(`${where}.recipientName is required`);
    const optionalText = (key: string) => {
      const value = record[key];
      if (value === undefined || value === null || value === "") return undefined;
      if (typeof value !== "string") throw new Error(`${where}.${key} must be a string`);
      return value.trim().normalize("NFC") || undefined;
    };

    const explicitSlug = optionalText("slug");
    const slug = explicitSlug ?? slugify(recipientName);
    if (!isValidSlug(slug)) {
      throw new Error(
        explicitSlug
          ? `${where}.slug "${explicitSlug}" is invalid (lowercase letters, digits and dashes, e.g. "nguyen-van-minh")`
          : `${where}: can't build a URL from "${recipientName}" — add a "slug" field`,
      );
    }
    const clash = seenSlugs.get(slug);
    if (clash) throw new Error(`${where}: URL "/invite/${slug}" is already used by "${clash}" — give one of them a different "slug"`);
    seenSlugs.set(slug, recipientName);

    return {
      id,
      slug,
      recipientName,
      displayName: optionalText("displayName"),
      personalMessage: optionalText("personalMessage"),
      rsvpEnabled: record.rsvpEnabled === true,
    };
  });

  // Old /invite/<id> links redirect to the slug, so an id must never look like someone else's slug.
  for (const invitation of parsed) {
    const owner = seenSlugs.get(invitation.id);
    if (owner && owner !== invitation.recipientName) {
      throw new Error(`id "${invitation.id}" of "${invitation.recipientName}" equals the URL of "${owner}" — change one of them`);
    }
  }
  return parsed;
}

export const invitations: Invitation[] = parseInvitations(rawInvitations);

const byId = new Map(invitations.map((invitation) => [invitation.id, invitation]));
const bySlug = new Map(invitations.map((invitation) => [invitation.slug, invitation]));

/** Lookup by record id (RSVP API). */
export function getInvitation(id: string): Invitation | undefined {
  return isValidInvitationId(id) ? byId.get(id) : undefined;
}

/** Lookup by URL segment (/invite/<slug>). */
export function getInvitationBySlug(slug: string): Invitation | undefined {
  return isValidSlug(slug) ? bySlug.get(slug) : undefined;
}

export function invitationPath(invitation: Pick<Invitation, "slug">): string {
  return `/invite/${invitation.slug}`;
}

export function getDisplayName(invitation: Pick<Invitation, "recipientName" | "displayName">): string {
  if (invitation.displayName) return invitation.displayName;
  const parts = invitation.recipientName.split(/\s+/).filter(Boolean);
  return parts[parts.length - 1] ?? invitation.recipientName;
}
