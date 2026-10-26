import rawInvitations from "@/content/invitations.json";

export interface Invitation {
  /** URL-safe id used in /invite/<id>. */
  id: string;
  recipientName: string;
  /** Short name used in greetings. Falls back to the last word of recipientName. */
  displayName?: string;
  personalMessage?: string;
  rsvpEnabled?: boolean;
}

/** Letters, digits, dash and underscore only — keeps URLs predictable and safe. */
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
  const seen = new Set<string>();
  return data.map((entry, index) => {
    const where = `invitations.json[${index}]`;
    if (typeof entry !== "object" || entry === null) throw new Error(`${where} must be an object`);
    const record = entry as Record<string, unknown>;
    const id = typeof record.id === "string" ? record.id.trim() : "";
    if (!isValidInvitationId(id)) throw new Error(`${where}.id "${String(record.id)}" is invalid (use letters, digits, - or _)`);
    if (seen.has(id)) throw new Error(`${where}.id "${id}" is duplicated`);
    seen.add(id);
    const recipientName = typeof record.recipientName === "string" ? record.recipientName.trim().normalize("NFC") : "";
    if (!recipientName) throw new Error(`${where}.recipientName is required`);
    const optionalText = (key: string) => {
      const value = record[key];
      if (value === undefined || value === null || value === "") return undefined;
      if (typeof value !== "string") throw new Error(`${where}.${key} must be a string`);
      return value.trim().normalize("NFC") || undefined;
    };
    return {
      id,
      recipientName,
      displayName: optionalText("displayName"),
      personalMessage: optionalText("personalMessage"),
      rsvpEnabled: record.rsvpEnabled === true,
    };
  });
}

export const invitations: Invitation[] = parseInvitations(rawInvitations);

const byId = new Map(invitations.map((invitation) => [invitation.id, invitation]));

export function getInvitation(id: string, list: Invitation[] = invitations): Invitation | undefined {
  if (!isValidInvitationId(id)) return undefined;
  return list === invitations ? byId.get(id) : list.find((invitation) => invitation.id === id);
}

export function getDisplayName(invitation: Pick<Invitation, "recipientName" | "displayName">): string {
  if (invitation.displayName) return invitation.displayName;
  const parts = invitation.recipientName.split(/\s+/).filter(Boolean);
  return parts[parts.length - 1] ?? invitation.recipientName;
}
