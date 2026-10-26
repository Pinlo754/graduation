export const RSVP_STATUSES = ["attending", "declined", "maybe"] as const;
export type RsvpStatus = (typeof RSVP_STATUSES)[number];

export const RSVP_NOTE_MAX = 300;

export interface RsvpPayload {
  id: string;
  status: RsvpStatus;
  note?: string;
}

export function isRsvpConfigured(): boolean {
  return Boolean(process.env.RSVP_WEBHOOK_URL?.trim());
}

/** Returns a clean payload or an error message (Vietnamese, shown to the guest). */
export function parseRsvpPayload(input: unknown): { ok: true; value: RsvpPayload } | { ok: false; error: string } {
  if (typeof input !== "object" || input === null) return { ok: false, error: "Dữ liệu không hợp lệ." };
  const body = input as Record<string, unknown>;
  if (typeof body.id !== "string" || !body.id) return { ok: false, error: "Thiếu mã thiệp mời." };
  if (!RSVP_STATUSES.includes(body.status as RsvpStatus)) return { ok: false, error: "Vui lòng chọn một lựa chọn." };
  let note: string | undefined;
  if (body.note !== undefined && body.note !== null) {
    if (typeof body.note !== "string") return { ok: false, error: "Lời nhắn không hợp lệ." };
    note = body.note.trim().normalize("NFC");
    if (note.length > RSVP_NOTE_MAX) return { ok: false, error: `Lời nhắn tối đa ${RSVP_NOTE_MAX} ký tự.` };
    if (!note) note = undefined;
  }
  return { ok: true, value: { id: body.id, status: body.status as RsvpStatus, note } };
}
