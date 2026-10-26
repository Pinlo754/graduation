import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getDisplayName, invitationPath, invitations } from "@/lib/invitations";
import { Backdrop } from "@/components/Backdrop";
import { WaxSeal } from "@/components/WaxSeal";

export const metadata: Metadata = {
  title: "Thiệp mời tốt nghiệp",
  robots: { index: false },
};

/** The bare domain doesn't belong to any guest — explain that each guest has their own link. */
export default function HomePage() {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <>
      <Backdrop />
      <main className="standalone">
        <div className="standalone__card">
          <span className="standalone__seal" aria-hidden="true">
            <WaxSeal />
          </span>
          <p className="mono standalone__kicker">GET / → 401 Personal invitation required</p>
          <h1 className="standalone__title">Thiệp mời này là dành riêng cho bạn</h1>
          <p className="standalone__text">
            Mỗi khách mời của {siteConfig.graduate.fullName} có một đường link riêng, dạng <code className="mono">/invite/ten-cua-ban</code>. Hãy mở đúng link bạn đã nhận được qua
            tin nhắn nhé.
          </p>
          {isDev && (
            <div className="standalone__dev">
              <p className="mono">{"// dev only — không hiển thị khi deploy"}</p>
              <ul>
                {invitations.map((invitation) => (
                  <li key={invitation.id}>
                    <Link href={invitationPath(invitation)}>
                      {invitationPath(invitation)} — {getDisplayName(invitation)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
