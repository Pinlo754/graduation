import type { Metadata } from "next";
import { Backdrop } from "@/components/Backdrop";

export const metadata: Metadata = {
  title: "Không tìm thấy thiệp mời",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Backdrop />
      <main className="standalone">
        <div className="standalone__card">
          <p className="standalone__code mono" aria-hidden="true">
            404
          </p>
          <p className="mono standalone__kicker">Error: InvitationNotFoundException</p>
          <h1 className="standalone__title">Không tìm thấy thiệp mời</h1>
          <p className="standalone__text">
            Đường link này có vẻ chưa đúng hoặc đã bị cắt mất một phần. Bạn kiểm tra lại link đã nhận, hoặc nhắn cho người gửi để lấy link mới nhé.
          </p>
          <pre className="standalone__trace mono" aria-hidden="true">
            {"  at openInvitation (invite/[slug])\n  at hint: copy the full link from the message"}
          </pre>
        </div>
      </main>
    </>
  );
}
