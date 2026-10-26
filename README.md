# 🎓 Thiệp mời tốt nghiệp — FPT University · Software Engineering

Thiệp mời online cá nhân hoá: mỗi khách có một link riêng (`/invite/001`, `/invite/002`, …), mở ra là phong bì có sáp niêm phong, bấm vào thì thiệp bay lên, sparkle bung ra, nhạc nền bật, rồi dẫn vào trang thiệp mang chất IT (code editor, git log, vé sự kiện, đếm ngược “deploy in…”).

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · CSS thuần (không thêm thư viện UI/animation). Mọi trang khách mời được build sẵn thành HTML tĩnh (SSG).

---

## ✅ Việc cần làm trước khi gửi link

Khi chạy `npm run dev`, góc trái dưới có badge **⚠ N placeholder**, liệt kê các giá trị mẫu chưa thay (badge này không xuất hiện khi deploy).

1. Sửa **`src/config/site.ts`**: tên bạn, ngày giờ, hội trường, địa chỉ, link Google Maps, hành trình (journey), lời cảm ơn, hạn RSVP, link liên hệ. Mọi dòng có `⚠️ PLACEHOLDER` đều là dữ liệu mẫu.
2. Thay danh sách khách mời trong **`src/content/invitations.json`**.
3. Thêm ảnh vào **`public/photos/`** và khai báo trong `gallery` (+ `graduate.portrait`).
4. (Tuỳ chọn) Thêm nhạc **`public/audio/background-music.mp3`**.
5. (Tuỳ chọn) Bật RSVP — xem [docs/RSVP.md](docs/RSVP.md).
6. Đặt `NEXT_PUBLIC_SITE_URL` là domain thật rồi chạy `npm run guests:links` để lấy link gửi cho từng người.

---

## 🚀 Chạy local

```bash
npm install
npm run dev          # http://localhost:3000  → trang chủ (dev) liệt kê sẵn link từng khách
```

Kiểm tra chất lượng:

```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm test             # Unit test (vitest)
npm run build        # Build production
npm start            # Chạy bản production đã build
```

---

## 👥 Thêm / sửa / xoá khách mời

File duy nhất: **`src/content/invitations.json`**

```json
{
  "id": "004",
  "recipientName": "Phạm Thị Hồng",
  "displayName": "Hồng",
  "personalMessage": "Nhớ đến nha!",
  "rsvpEnabled": true
}
```

| Trường | Bắt buộc | Ghi chú |
|---|---|---|
| `id` | ✔ | Chỉ chữ, số, `-`, `_` (tối đa 40 ký tự). Thành URL `/invite/<id>`. Không được trùng. |
| `recipientName` | ✔ | Tên đầy đủ, có dấu thoải mái. Hiện trên phong bì và vé. |
| `displayName` | | Tên gọi thân mật trong lời chào. Bỏ trống → lấy chữ cuối của tên. |
| `personalMessage` | | Lời nhắn riêng cho người đó. |
| `rsvpEnabled` | | `true` để người này xác nhận tham dự online. |

Dữ liệu được kiểm tra lúc build: thiếu tên, trùng id hay id sai định dạng sẽ làm **build báo lỗi** chứ không lặng lẽ deploy thiệp hỏng. ID không tồn tại → trang “Không tìm thấy thiệp mời” (404), không bao giờ hiện nhầm thiệp người khác.

**Dùng Excel / Google Sheets:**

```bash
npm run guests:export -- guests.csv   # xuất danh sách ra CSV (mở được bằng Excel, giữ dấu tiếng Việt)
npm run guests:import -- guests.csv   # nhập CSV, GHI ĐÈ invitations.json
npm run guests:links                  # in link của từng khách để copy gửi đi
```

Cột CSV: `id, recipientName, displayName, personalMessage, rsvpEnabled`.

---

## 📸 Thêm ảnh

1. Copy ảnh vào `public/photos/` (JPG/PNG/WebP; nên resize cạnh dài ~2000px — Next.js tự tối ưu sang AVIF/WebP và lazy-load).
2. Khai báo trong `src/config/site.ts`:

```ts
graduate: { portrait: "/photos/portrait.jpg", ... },

gallery: [
  { src: "/photos/campus.jpg", alt: "Mình và lớp SE trước toà Alpha", caption: "Ngày đầu nhập học", date: "09/2022", shape: "landscape" },
  { src: "/photos/team.jpg",   alt: "Team capstone sau buổi bảo vệ",  caption: "Bảo vệ đồ án",      shape: "portrait" },
],
```

`shape` = `portrait` | `landscape` | `square` (quyết định kích thước ô trong lưới). Khi chưa có ảnh, trang hiển thị các ô placeholder “loading memories…”. Ảnh lỗi/thiếu file sẽ hiện ô 404 thay vì làm vỡ trang. Bấm ảnh để mở lightbox (← → / Esc / vuốt trên điện thoại).

---

## 🎵 Nhạc nền

- Đặt file tại **`public/audio/background-music.mp3`** (hoặc đổi `music.src` trong `site.ts`). Âm lượng mặc định `music.volume = 0.35`.
- Trình duyệt chặn tự phát nhạc có tiếng, nên nhạc bắt đầu **khi khách bấm mở phong bì** (cử chỉ người dùng hợp lệ). Nút đĩa than góc phải dưới (và đĩa than ở hero) để bật/tắt; đã tắt thì không tự bật lại.
- **Chưa có file nhạc?** Trang tự phát một giai điệu “music box” lo-fi tổng hợp bằng Web Audio (`music.synthFallback: true`). Đặt `false` để tắt.
- Chỉ dùng bài hát bạn có quyền sử dụng.

---

## 🗓️ Cấu hình buổi lễ

Trong `src/config/site.ts` → `event`:

```ts
startsAt: "2026-12-20T08:00:00+07:00",   // luôn kèm +07:00
endsAt:   "2026-12-20T11:30:00+07:00",   // tuỳ chọn
venue, address, dressCode, mapsUrl, note // tuỳ chọn — để undefined là tự ẩn
```

Thứ trong tuần, định dạng ngày, đếm ngược, link Google Calendar và file `.ics` đều được tính tự động theo giờ Việt Nam (`Asia/Ho_Chi_Minh`). Không có `mapsUrl` thì nút Maps tự tìm theo `venue + address`.

---

## ☁️ Deploy

Project chạy được trên mọi host hỗ trợ Next.js. Đơn giản nhất là **Vercel**:

1. Đưa code lên GitHub → Import project trên vercel.com (framework tự nhận Next.js).
2. Environment Variables: `NEXT_PUBLIC_SITE_URL` (domain của bạn) và — nếu bật RSVP — `RSVP_WEBHOOK_URL`, `RSVP_WEBHOOK_SECRET`.
3. Deploy. Mỗi lần sửa `site.ts` / `invitations.json` / env thì cần **deploy lại** (trang được build sẵn).

Hoặc tự host: `npm run build && npm start` (Node 18.18+).

---

## 🔒 Quyền riêng tư — nên biết

- Link `/invite/001` **không phải mật khẩu**. Ai đoán được ID cũng xem được thiệp đó, và danh sách khách nằm trong source của server. Đừng đưa thông tin nhạy cảm (SĐT, địa chỉ nhà riêng của khách) vào thiệp. Muốn khó đoán hơn, dùng ID ngẫu nhiên như `"minh-7f3k"`.
- Mỗi trang chỉ gửi xuống trình duyệt dữ liệu của đúng khách đó. Trang có `noindex` để không lên Google. Không có tracking.
- Tên khách luôn được hiển thị dưới dạng văn bản (React tự escape), không bao giờ chạy như HTML.
- Ảnh xem trước khi share link (Open Graph) là ảnh chung, không chứa tên khách; tiêu đề tab và tiêu đề preview thì có tên người đó (“Minh ơi, bạn được mời!”).

---

## 🗂️ Cấu trúc chính

```
src/
  config/site.ts              ← TOÀN BỘ nội dung & thông tin buổi lễ
  content/invitations.json    ← danh sách khách mời
  app/
    invite/[id]/page.tsx      ← trang thiệp (SSG, metadata cá nhân hoá)
    api/rsvp/route.ts         ← nhận RSVP, chuyển tiếp tới webhook
    page.tsx / not-found.tsx  ← trang chủ & 404
    globals.css               ← design system + toàn bộ style/animation
  components/
    InvitationShell.tsx       ← điều phối mở phong bì, scroll-reveal, khoá cuộn
    EnvelopeIntro.tsx         ← màn phong bì
    sections/*                ← Welcome · Story · Details · Gallery · Letter · Finale
    music/*                   ← trình phát nhạc + nút đĩa than
  lib/                        ← dữ liệu khách, ngày giờ, lịch, RSVP, synth
scripts/guests.mjs            ← links / import / export CSV
docs/RSVP.md                  ← hướng dẫn bật RSVP với Google Sheets
```
