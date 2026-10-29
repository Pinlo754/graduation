/**
 * ============================================================================
 *  SITE CONFIG — the ONE place to edit everything about your graduation.
 * ============================================================================
 *
 *  Every value marked  ⚠️ PLACEHOLDER  is sample content. Replace it before
 *  you send links to anyone. While running `npm run dev`, a small badge in the
 *  bottom-left corner lists every placeholder you still haven't replaced.
 *
 *  - Set a field to `undefined` (or delete it) to hide it on the page.
 *  - Guest names live in `src/content/invitations.json`, NOT here.
 *  - Photos go in `public/photos/`, music in `public/audio/`.
 */

export interface JourneyCommit {
  /** Conventional-commit style tag shown before the title. */
  type: "init" | "feat" | "fix" | "chore" | "release";
  title: string;
  /** Free text, e.g. "09/2022" or "Fall 2024". */
  when?: string;
  description?: string;
}

export interface GalleryItem {
  /** Path inside /public, e.g. "/photos/campus.jpg". */
  src: string;
  /** Describe what is in the photo (for screen readers). */
  alt: string;
  caption?: string;
  date?: string;
  /** Controls the tile shape in the grid. */
  shape?: "portrait" | "landscape" | "square";
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  graduate: {
    fullName: string;
    displayName: string;
    university: string;
    field: string;
    major: string;
    studentId?: string;
    classOf: string;
    /** Portrait shown in the hero polaroid. Leave undefined for a designed placeholder. */
    portrait?: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  event: {
    title: string;
    /** ISO 8601 with the +07:00 offset, e.g. "2026-12-20T08:00:00+07:00". */
    startsAt?: string;
    endsAt?: string;
    venue?: string;
    address?: string;
    dressCode?: string;
    mapsUrl?: string;
    note?: string;
  };
  journey: JourneyCommit[];
  gallery: GalleryItem[];
  letter: {
    greeting: string;
    paragraphs: string[];
    signOff: string;
  };
  finale: {
    title: string;
    body: string;
  };
  music: {
    /** Path inside /public. If the file is missing, a soft synth melody plays instead. */
    src: string;
    title: string;
    /** 0–1. Keep it gentle. */
    volume: number;
    /** Play a generated music-box melody when `src` can't be loaded. */
    synthFallback: boolean;
  };
  rsvp: {
    /** Master switch. Also needs RSVP_WEBHOOK_URL on the server — see docs/RSVP.md. */
    enabled: boolean;
    deadline?: string;
  };
  /** Shown next to RSVP so guests can always reach you. */
  contacts: SocialLink[];
  seo: {
    siteName: string;
    description: string;
  };
}

export const siteConfig: SiteConfig = {
  graduate: {
    fullName: "Nguyễn Thanh Phong", // ⚠️ PLACEHOLDER
    displayName: "Pinlo nè ^^", // ⚠️ PLACEHOLDER
    university: "FPT University",
    field: "Information Technology",
    major: "Software Engineering",
    studentId: "SE181770", // e.g. "SE170000"
    classOf: "2026", // ⚠️ PLACEHOLDER
    portrait: "/photos/portrait.jpg", // e.g. "/photos/portrait.jpg"
  },

  hero: {
    eyebrow: "Graduation Ceremony · Class of 2026", // ⚠️ PLACEHOLDER (year)
    title: "You're Invited",
    subtitle:
      "Sau bao nhiêu deadline, bug và những đêm thức trắng, cuối cùng mình cũng đã đến ngày tốt nghiệp. Mình rất mong có bạn ở đó.",
  },

  event: {
    title: "Lễ Tốt Nghiệp — FPT University",
    startsAt: "2026-11-07T10:00:00+07:00", // định dạng: YYYY-MM-DDTHH:mm:ss+07:00 (giờ luôn 2 chữ số)
    endsAt: "2026-11-07T16:00:00+07:00",
    venue: "Hội trường Đại học FPT", // ⚠️ PLACEHOLDER
    address: "7 Đ. D1, Tăng Nhơn Phú, Hồ Chí Minh 700000, Việt Nam", // ⚠️ PLACEHOLDER
    dressCode: "Thoải mái, lịch sự — tông sáng càng đẹp ảnh", // ⚠️ PLACEHOLDER
    mapsUrl: "https://maps.app.goo.gl/L2MXu1z9ep4Rjq2DA", // e.g. "https://maps.app.goo.gl/xxxx"
    note: "Tới nhớ phone cho Phong 0399117806 nhó", // ⚠️ PLACEHOLDER
  },

  // ⚠️ PLACEHOLDER — rewrite with your real milestones (oldest first).
  journey: [
    {
      type: "init",
      title: "Nhập học FPT University",
      when: "2022",
      description: "git init — ngày đầu bước vào campus, mọi thứ đều mới toanh.",
    },
    {
      type: "feat",
      title: "Những môn chuyên ngành đầu tiên",
      when: "2023",
      description: "Học OOP, Data Structures, và ngủ quên đi thi nên rớt môn đầu tiên...",
    },
    {
      type: "fix",
      title: "Vượt qua những kỳ khó nhằn nhất",
      when: "2024",
      description: "Deadline, Code và Coffee.",
    },
    {
      type: "chore",
      title: "Những kì cuối cùng",
      when: "2025",
      description: "Bắt đầu với EXE sau đó là SEP, mình đã thực sự cố gắng và cũng đã gặt hái được quả ngọt rùi hehehehe.",
    },
    {
      type: "release",
      title: "Capstone & Tốt nghiệp — v1.0.0",
      when: "2026",
      description: "Build passed. Tests passed. Ready to ship to the real world.",
    },
  ],

  // Add your photos here (files go in public/photos/). Empty = designed placeholder tiles.
  // Example:
  // { src: "/photos/campus.jpg", alt: "Mình và lớp SE trước toà Alpha", caption: "Ngày đầu nhập học", date: "09/2022", shape: "landscape" },
  gallery: [
    { src: "/photos/hoc-bong.jpg", alt: "học bổng", caption: "Vì tiếc cái học bỏng này mà quyết định bỏ ước mơ bác sĩ đi làm IT ^^", date: "05/2022", shape: "landscape" },
    { src: "/photos/ngay-dau.jpg", alt: "ngày đầu tiên", caption: "Những ngày đầu tiên mặc áo cam FPT", date: "10/2022", shape: "portrait" },
    { src: "/photos/quansu.jpg", alt: "Kì quân sự", caption: "Kì quân sự, mình đã có 1 vai diễn người dẫn truyện trong kì này, khá niche", date: "10/2022", shape: "portrait" },
    { src: "/photos/diday.jpg", alt: "đi dạy", caption: "Công việc đầu tiên, đi dạy tận Q7", date: "10/2022", shape: "portrait" },
    { src: "/photos/lamdong.jpg", alt: "đi Lâm Đồng", caption: "Event 2 ngày 1 đêm đi Lâm Đồng nek", date: "4/2023", shape: "portrait" },
    { src: "/photos/huanchuong.jpg", alt: "Huân chương vàng", caption: "Huân chương vàng đầu tiên với môn cầu lông", date: "5/2023", shape: "portrait" },
    { src: "/photos/ssg.jpg", alt: "Từ thiện", caption: "Đi từ thiện với lớp SSG, nhiều kì niệm lắm hehe", date: "11/2023", shape: "portrait" },
    { src: "/photos/tiengnhat.jpg", alt: "Tiếng Nhật", caption: "OKay bắt đầu hành trình với ngôn ngữ thứ 3", date: "4/2024", shape: "portrait" },
    { src: "/photos/svg.jpg", alt: "Sinh diên dỏi", caption: "Sinh diên dỏi đầu tiên", date: "6/2024", shape: "portrait" },
    { src: "/photos/xe.jpg", alt: "Xe IOT", caption: "Chiến xa IOT", date: "7/2024", shape: "portrait" },
    { src: "/photos/hocdot.jpg", alt: "Học dốt", caption: "Đi học j có 3.75 điểm nè bây ơi bây", date: "10/2024", shape: "portrait" },
    { src: "/photos/qua2011.jpg", alt: "Từ thiện", caption: "Anh giáo lần đầu có quà 20/11 nek, cảm ơn BNgoc nhìu", date: "11/2024", shape: "portrait" },
    { src: "/photos/code2.jpg", alt: "code", caption: "1 ảnh code ngẫu nhiên kaka", date: "12/2024", shape: "portrait" },
    { src: "/photos/random.jpg", alt: "Random", caption: "1 tấm checkin random tại FPTU thui keke", date: "1/2025", shape: "portrait" },
    { src: "/photos/thattinh.jpg", alt: "Thất tình", caption: "Ngày anh thất tình, trời không mưa mà lòng anh bão tố…", date: "11/2024", shape: "portrait" },
    { src: "/photos/em1.jpg", alt: "Từ thiện", caption: "1 kỉ nịm random dới em bé", date: "2/2025", shape: "portrait" },
    { src: "/photos/hoa.jpg", alt: "Hoa", caption: "Bó hoa đầu tiên trong đời tui được nhận, iu nhắm", date: "4/2025", shape: "portrait" },
    { src: "/photos/random1.jpg", alt: "code", caption: "Đi bưng nước quán cà hê", date: "4/2025", shape: "portrait" },
    { src: "/photos/quasinhnhat1.jpg", alt: "code", caption: "MÓn quà sinh nhật đầu tiên của ẻm", date: "5/2026", shape: "portrait" },
    { src: "/photos/lan1phongvan.jpg", alt: "Phỏng vấn đầu tiên", caption: "Lần đầu xin việc nma rớt mất òi", date: "1/2026", shape: "portrait" },
    { src: "/photos/top1.jpg", alt: "Top 1 lòng e", caption: "Tui luôn là top 1 lòng ẻm đó", date: "3/2026", shape: "portrait" },
    { src: "/photos/code.jpg", alt: "code", caption: "1 ảnh code ngẫu nhiên kaka", date: "4/2026", shape: "portrait" },
    { src: "/photos/nauan.jpg", alt: "code", caption: "Thích nấu ăng lắm", date: "4/2026", shape: "portrait" },
    { src: "/photos/graduated.jpg", alt: "Graduated", caption: "yayyyy Graduateddddd!!!!!", date: "5/2026", shape: "portrait" },
    { src: "/photos/muaqua.jpg", alt: "Mua quà", caption: "Mua quà cho thầy hướng dẫn đồ án nè, ảnh có tâm dữ lắm", date: "5/2026", shape: "portrait" },
    { src: "/photos/sinhnhat.jpg", alt: "Sinh nhật", caption: "Cái bánh sinh nhật đầu tiên sau 22 năm", date: "5/2026", shape: "portrait" },
    { src: "/photos/quancafe.jpg", alt: "Từ thiện", caption: "Zai IT ra trường thất nghiệp mở quán cafe...", date: "5/2026", shape: "portrait" },
    { src: "/photos/quancafe2.jpg", alt: "Từ thiện", caption: "Matcha quán tui nha, signature, xún ún liền", date: "5/2026", shape: "portrait" },
    { src: "/photos/xinviec2.jpg", alt: "Đi xin việc", caption: "Đi xin việc lần thứ 2 hehe, đậu luôngg", date: "7/2026", shape: "portrait" },
    { src: "/photos/banmoi1.jpg", alt: "Bạn mới", caption: "Bạn mới hehe, nhưng mà toàn là mấy anh chị lớn hơn mình thui", date: "6/2026  ", shape: "portrait" },
    
    
  ],

  letter: {
    greeting: "Gửi những người bạn của mình,",
    // ⚠️ PLACEHOLDER — write this in your own voice.
    paragraphs: [
      "Bốn năm qua không chỉ là những dòng code hay những bài thi. Đó là những buổi ôn bài tới khuya, những lần cả nhóm cùng debug một lỗi ngớ ngẩn lúc 2 giờ sáng, và những bữa cơm vội giữa hai ca học.",
      "Mình không thể đi đến đây một mình. Cảm ơn bạn đã ở bên, đã nghe mình than thở, đã cười cùng mình và tin mình ngay cả khi chính mình còn nghi ngờ.",
      "Ngày tốt nghiệp sẽ trọn vẹn hơn rất nhiều nếu có bạn ở đó.",
    ],
    signOff: "Thương,",
  },

  finale: {
    title: "Mình đã chạm tới cột mốc này — và mình muốn ăn mừng nó cùng bạn.",
    body: "Hẹn gặp bạn ở lễ tốt nghiệp nhé. Mang theo nụ cười, phần còn lại để mình lo.",
  },

  music: {
    src: "/audio/background-music.mp3",
    title: "Background music",
    volume: 0.35,
    synthFallback: true,
  },

  rsvp: {
    enabled: true,
    deadline: "2026-11-07", // ⚠️ PLACEHOLDER
  },

  // ⚠️ PLACEHOLDER — add your real contact links, or leave the list empty.
  contacts: [
    { label: "Messenger", href: "https://www.facebook.com/PhongPinlo" },
    { label: "Zalo", href: "https://zalo.me/0399117806" },
  ],

  seo: {
    siteName: "Graduation Invitation",
    description: "Thiệp mời lễ tốt nghiệp — FPT University · Software Engineering.",
  },
};

/**
 * Values that still equal the shipped sample content. Used only by the
 * development-mode reminder badge — it never renders in production.
 */
export function listPlaceholders(config: SiteConfig = siteConfig): string[] {
  const left: string[] = [];
  if (config.graduate.fullName === "Nguyễn Văn A") left.push("graduate.fullName");
  if (config.graduate.displayName === "A") left.push("graduate.displayName");
  if (config.event.startsAt === "2026-12-20T08:00:00+07:00") left.push("event.startsAt");
  if (config.event.venue === "Hội trường Đại học FPT") left.push("event.venue");
  if (config.event.address?.includes("thay tại src/config")) left.push("event.address");
  if (config.journey[0]?.description?.startsWith("git init — ngày đầu")) left.push("journey");
  if (config.letter.paragraphs[0]?.startsWith("Bốn năm qua không chỉ")) left.push("letter.paragraphs");
  if (config.rsvp.deadline === "2026-12-10") left.push("rsvp.deadline");
  if (config.gallery.length === 0) left.push("gallery (no photos yet)");
  if (!config.graduate.portrait) left.push("graduate.portrait");
  return left;
}
