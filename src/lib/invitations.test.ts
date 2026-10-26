import { describe, expect, it } from "vitest";
import { getDisplayName, getInvitation, invitations, isValidInvitationId, parseInvitations } from "./invitations";

describe("invitation dataset", () => {
  it("resolves each id to its own recipient", () => {
    expect(getInvitation("001")?.recipientName).toBe("Nguyễn Văn Minh");
    expect(getInvitation("002")?.recipientName).toBe("Trần Ngọc An");
    expect(getInvitation("001")?.recipientName).not.toBe(getInvitation("002")?.recipientName);
  });

  it("never falls back to another guest for unknown or malformed ids", () => {
    for (const id of ["999", "", "../001", "001 ", "<script>", "001?x=1", "a".repeat(41)]) {
      expect(getInvitation(id)).toBeUndefined();
    }
  });

  it("keeps Vietnamese diacritics intact (NFC)", () => {
    const decomposed = "Nguyễn Văn Minh"; // NFD form
    const [parsed] = parseInvitations([{ id: "x1", recipientName: decomposed }]);
    expect(parsed.recipientName).toBe("Nguyễn Văn Minh");
    expect(parsed.recipientName.normalize("NFC")).toBe(parsed.recipientName);
  });

  it("treats markup in names as plain text data", () => {
    const [parsed] = parseInvitations([{ id: "x2", recipientName: "<img src=x onerror=alert(1)>" }]);
    expect(parsed.recipientName).toBe("<img src=x onerror=alert(1)>"); // React escapes it on render
  });

  it("derives a display name when none is given", () => {
    expect(getDisplayName({ recipientName: "Lê Hoàng Phương Thảo" })).toBe("Thảo");
    expect(getDisplayName({ recipientName: "Lê Thảo", displayName: "Bé Thảo" })).toBe("Bé Thảo");
  });

  it("rejects duplicate, invalid or nameless records", () => {
    expect(() => parseInvitations([{ id: "1", recipientName: "A" }, { id: "1", recipientName: "B" }])).toThrow(/duplicated/);
    expect(() => parseInvitations([{ id: "a b", recipientName: "A" }])).toThrow(/invalid/);
    expect(() => parseInvitations([{ id: "ok", recipientName: "  " }])).toThrow(/recipientName/);
    expect(() => parseInvitations({})).toThrow(/array/);
  });

  it("ships a valid dataset", () => {
    expect(invitations.length).toBeGreaterThan(0);
    expect(invitations.every((i) => isValidInvitationId(i.id))).toBe(true);
  });
});
