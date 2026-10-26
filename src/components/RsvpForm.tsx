"use client";

import { useState } from "react";
import { RSVP_NOTE_MAX, type RsvpStatus } from "@/lib/rsvp";

const OPTIONS: { value: RsvpStatus; label: string; hint: string; icon: string }[] = [
  { value: "attending", label: "Mình sẽ đến", hint: "200 OK", icon: "✓" },
  { value: "maybe", label: "Chưa chắc nữa", hint: "102 Processing", icon: "…" },
  { value: "declined", label: "Tiếc quá, không đến được", hint: "503 Busy", icon: "✕" },
];

const THANKS: Record<RsvpStatus, string> = {
  attending: "Tuyệt vời! Mình đã ghi tên bạn — hẹn gặp ở buổi lễ nhé 🎓",
  maybe: "Không sao cả! Khi nào chắc chắn, bạn gửi lại lựa chọn mới giúp mình nhé.",
  declined: "Tiếc thật, nhưng cảm ơn bạn đã báo cho mình. Mình vẫn rất trân trọng!",
};

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; status: RsvpStatus } | { kind: "error"; message: string };

export function RsvpForm({ guestId, guestName }: { guestId: string; guestName: string }) {
  const [choice, setChoice] = useState<RsvpStatus | null>(null);
  const [note, setNote] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!choice) {
      setState({ kind: "error", message: "Bạn chọn một trong ba lựa chọn bên trên giúp mình nhé." });
      return;
    }
    setState({ kind: "sending" });
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: guestId, status: choice, note: note.trim() || undefined }),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Chưa lưu được phản hồi, bạn thử lại nhé.");
      setState({ kind: "done", status: choice });
    } catch (error) {
      const offline = error instanceof TypeError; // fetch() network failure
      setState({
        kind: "error",
        message: offline || !(error instanceof Error) ? "Không kết nối được máy chủ. Bạn kiểm tra mạng rồi thử lại nhé." : error.message,
      });
    }
  };

  if (state.kind === "done") {
    return (
      <div className="rsvp__done" role="status">
        <p className="mono rsvp__done-code">✓ 201 Created</p>
        <p>{THANKS[state.status]}</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setState({ kind: "idle" })}>
          Đổi câu trả lời
        </button>
      </div>
    );
  }

  return (
    <form className="rsvp__form" onSubmit={submit} noValidate>
      <fieldset className="rsvp__options">
        <legend className="sr-only">Lựa chọn tham dự của {guestName}</legend>
        {OPTIONS.map((option) => (
          <label key={option.value} className={`rsvp__option ${choice === option.value ? "is-selected" : ""}`}>
            <input
              type="radio"
              name="status"
              value={option.value}
              checked={choice === option.value}
              onChange={() => {
                setChoice(option.value);
                if (state.kind === "error") setState({ kind: "idle" });
              }}
            />
            <span className="rsvp__option-icon" aria-hidden="true">
              {option.icon}
            </span>
            <span className="rsvp__option-label">{option.label}</span>
            <span className="rsvp__option-hint mono" aria-hidden="true">
              {option.hint}
            </span>
          </label>
        ))}
      </fieldset>
      <label className="rsvp__note">
        <span className="mono">{"// lời nhắn (không bắt buộc)"}</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={RSVP_NOTE_MAX} rows={3} placeholder="Ví dụ: Mình sẽ đến cùng hoa nhé!" />
        <span className="rsvp__count mono" aria-hidden="true">
          {note.length}/{RSVP_NOTE_MAX}
        </span>
      </label>
      {state.kind === "error" && (
        <p className="rsvp__error" role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" className="btn btn--primary rsvp__submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Đang gửi…" : "Gửi phản hồi"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
