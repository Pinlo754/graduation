# Bật RSVP (lưu vào Google Sheets)

Mặc định RSVP **tắt**: khách thấy dòng “Nhắn trực tiếp cho mình…” cùng các link liên hệ trong `contacts`. Để khách bấm “Mình sẽ đến / Chưa chắc / Không đến được” và bạn xem kết quả trên mọi thiết bị, nối website với một Google Sheet qua Google Apps Script (miễn phí, không cần server riêng).

Luồng dữ liệu: trình duyệt khách → `/api/rsvp` (server Next.js kiểm tra mã thiệp, lựa chọn, độ dài lời nhắn) → Apps Script (kiểm tra secret) → thêm một dòng vào Sheet. Trang **chỉ báo “đã gửi” khi Apps Script xác nhận đã lưu**; nếu lỗi, khách thấy thông báo lỗi và gợi ý nhắn trực tiếp.

## 1. Tạo Sheet + Apps Script

1. Tạo một Google Sheet mới, đặt tên tab là `RSVP`, hàng 1 ghi: `submittedAt | id | recipientName | status | note`.
2. Menu **Extensions → Apps Script**, xoá code mẫu, dán:

```js
const SECRET = "doi-thanh-chuoi-bi-mat-cua-ban"; // phải trùng RSVP_WEBHOOK_SECRET
const VERSION = 4; // tăng số này mỗi lần sửa code, để biết bản deploy mới đã chạy chưa
const HEADERS = ["submittedAt", "id", "recipientName", "status", "note"];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (String(data.secret).trim() !== SECRET.trim()) {
      return json({ ok: false, error: "unauthorized", version: VERSION, secretLength: String(data.secret).length });
    }
    const sheet = getRsvpSheet();
    sheet.appendRow([data.submittedAt, data.id, data.recipientName, data.status, data.note]);
    return json({ ok: true, version: VERSION, sheet: sheet.getName() });
  } catch (err) {
    return json({ ok: false, error: String(err), version: VERSION });
  }
}

/** Tab "RSVP" (không phân biệt hoa/thường, bỏ qua dấu cách); chưa có thì tự tạo kèm tiêu đề. */
function getRsvpSheet() {
  const ss = SpreadsheetApp.getActive();
  const found = ss.getSheets().find((s) => s.getName().trim().toLowerCase() === "rsvp");
  if (found) return found;
  const sheet = ss.insertSheet("RSVP");
  sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy → New deployment → Web app**: *Execute as* = **Me**, *Who has access* = **Anyone**. Copy URL dạng `https://script.google.com/macros/s/…/exec`.

> ⚠️ **Sửa code xong phải deploy lại:** Apps Script chỉ chạy *bản đã deploy*, không phải code bạn vừa Save. Vào **Deploy → Manage deployments → ✏️ → Version: New version → Deploy** (URL giữ nguyên). Quên bước này là nguyên nhân phổ biến nhất của lỗi 502 / `unauthorized`.

> Mỗi lần khách đổi câu trả lời sẽ thêm một dòng mới — lấy dòng mới nhất của mỗi `id` là câu trả lời cuối.

## 2. Cấu hình website

`.env.local` (local) hoặc Environment Variables trên Vercel:

```
RSVP_WEBHOOK_URL=https://script.google.com/macros/s/xxxxxxxx/exec
RSVP_WEBHOOK_SECRET=doi-thanh-chuoi-bi-mat-cua-ban
```

Trong `src/config/site.ts`: `rsvp.enabled: true` (mặc định), và với từng khách trong `invitations.json`: `"rsvpEnabled": true`.

**Build/deploy lại** sau khi đặt biến môi trường — form RSVP chỉ hiện khi lúc build có `RSVP_WEBHOOK_URL`.

## 3. Kiểm tra

Mở một link thiệp, gửi thử một phản hồi → kiểm tra Sheet có dòng mới. Secret không bao giờ được gửi xuống trình duyệt; nó chỉ nằm ở server Next.js và Apps Script.
