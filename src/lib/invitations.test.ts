import { describe, expect, it } from "vitest";
import { getDisplayName, getInvitation, getInvitationBySlug, invitationPath, invitations, parseInvitations } from "./invitations";
import { isValidSlug, slugify } from "./slug";

describe("slugify", () => {
  it("turns Vietnamese names into readable URL segments", () => {
    expect(slugify("Em bé Thư Kỳ")).toBe("em-be-thu-ky");
    expect(slugify("Đạt Tới")).toBe("dat-toi");
    expect(slugify("Nguyễn Văn Minh")).toBe("nguyen-van-minh");
    expect(slugify("Lê Hoàng Phương Thảo")).toBe("le-hoang-phuong-thao");
    expect(slugify("  BThi (K17)!! ")).toBe("bthi-k17");
  });

  it("handles decomposed (NFD) input the same as composed text", () => {
    expect(slugify("Nguyễn")).toBe(slugify("Nguyễn"));
  });

  it("returns an invalid slug for names with no usable characters", () => {
    expect(isValidSlug(slugify("🎓✨"))).toBe(false);
  });
});

describe("parseInvitations", () => {
  const [minh, an] = parseInvitations([
    { id: "001", recipientName: "Nguyễn Văn Minh", displayName: "Minh" },
    { id: "002", recipientName: "Trần Ngọc An", slug: "an-xinh" },
  ]);

  it("derives the URL from the name, or uses an explicit slug", () => {
    expect(minh.slug).toBe("nguyen-van-minh");
    expect(an.slug).toBe("an-xinh");
    expect(invitationPath(minh)).toBe("/invite/nguyen-van-minh");
  });

  it("refuses two guests that would share a URL", () => {
    expect(() =>
      parseInvitations([
        { id: "1", recipientName: "Minh" },
        { id: "2", recipientName: "Mính" },
      ]),
    ).toThrow(/already used/);
  });

  it("refuses an id that equals another guest's URL (old-link redirects would clash)", () => {
    expect(() =>
      parseInvitations([
        { id: "tho", recipientName: "An" },
        { id: "2", recipientName: "Thọ" },
      ]),
    ).toThrow(/equals the URL/);
  });

  it("rejects bad explicit slugs and names that can't become a URL", () => {
    expect(() => parseInvitations([{ id: "1", recipientName: "A", slug: "Có Dấu" }])).toThrow(/slug/);
    expect(() => parseInvitations([{ id: "1", recipientName: "🎓" }])).toThrow(/add a "slug"/);
  });

  it("keeps Vietnamese diacritics intact (NFC) and treats markup as plain text", () => {
    const [nfd] = parseInvitations([{ id: "x1", recipientName: "Nguyễn Văn Minh" }]);
    expect(nfd.recipientName).toBe("Nguyễn Văn Minh");
    const [html] = parseInvitations([{ id: "x2", recipientName: "<img src=x onerror=alert(1)>", slug: "x2" }]);
    expect(html.recipientName).toBe("<img src=x onerror=alert(1)>"); // React escapes it on render
  });

  it("rejects duplicate ids, invalid ids or nameless records", () => {
    expect(() => parseInvitations([{ id: "1", recipientName: "A" }, { id: "1", recipientName: "B" }])).toThrow(/duplicated/);
    expect(() => parseInvitations([{ id: "a b", recipientName: "A" }])).toThrow(/invalid/);
    expect(() => parseInvitations([{ id: "ok", recipientName: "  " }])).toThrow(/recipientName/);
    expect(() => parseInvitations({})).toThrow(/array/);
  });

  it("derives a display name when none is given", () => {
    expect(getDisplayName({ recipientName: "Lê Hoàng Phương Thảo" })).toBe("Thảo");
    expect(getDisplayName({ recipientName: "Lê Thảo", displayName: "Bé Thảo" })).toBe("Bé Thảo");
  });
});

describe("shipped guest list", () => {
  it("is valid and every guest resolves by both slug and id", () => {
    expect(invitations.length).toBeGreaterThan(0);
    for (const invitation of invitations) {
      expect(getInvitationBySlug(invitation.slug)).toBe(invitation);
      expect(getInvitation(invitation.id)).toBe(invitation);
    }
  });

  it("never falls back to another guest for unknown or malformed URLs", () => {
    for (const slug of ["khong-ton-tai", "", "../tho", "Tho", "thọ", "<script>", "a".repeat(61)]) {
      expect(getInvitationBySlug(slug)).toBeUndefined();
    }
  });
});
