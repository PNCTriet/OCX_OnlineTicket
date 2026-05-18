"use client";

/**
 * Trợ giúp — nội dung quy định Ớt Cay Xè: nhóm theo chủ đề + toàn văn trong một khối.
 */

import { useRef, useState, type ReactNode, type RefObject } from "react";
import { AlertTriangle, Lock } from "lucide-react";
import PageLayout from "@/components/v2/PageLayout";
import Header from "@/components/v2/Header";
import type { HeaderLang } from "@/components/v2/Header";
import V2Footer from "@/components/v2/Footer";

type NavId = "before" | "after" | "venue" | "risk" | "full";

const NAV: { id: NavId; vi: string; en: string }[] = [
  { id: "before", vi: "Trước khi mua vé", en: "Before you buy" },
  { id: "after", vi: "Vé & vào cổng", en: "Tickets & entry" },
  { id: "venue", vi: "Tại địa điểm", en: "At the venue" },
  { id: "risk", vi: "Rủi ro & bất khả kháng", en: "Risks & force majeure" },
  { id: "full", vi: "Toàn văn quy định", en: "Full rules text" },
];

/** Toàn văn 16 điểm — chỉ dùng cho khối cuối (không tách thành nhiều card). */
const FULL_RULES_VI: string[] = [
  "Chương trình dành cho đối tượng khán giả từ 16 tuổi trở lên. Khán giả từ 10–15 tuổi chỉ được tham gia nếu có người giám hộ trên 18 tuổi đi kèm (mỗi người giám hộ chỉ được kèm một trẻ vị thành niên) và hoàn toàn chịu trách nhiệm nếu xảy ra bất kỳ sự cố nào trong sự kiện.",
  "Phụ nữ mang thai và người có vấn đề về sức khỏe cần tự cân nhắc khi tham gia chương trình. Trong mọi trường hợp, BTC không chịu trách nhiệm với các vấn đề sức khỏe phát sinh.",
  "Mỗi vé chỉ dành cho một khán giả, không kèm trẻ em hoặc trẻ vị thành niên. Người giám hộ đi kèm trẻ vị thành niên phải mua vé hợp lệ để vào sự kiện.",
  "Vé đã mua không được đổi/trả dưới bất kỳ hình thức nào. Khán giả có trách nhiệm bảo quản mã vé và thông tin thanh toán. Trong trường hợp trùng mã vé, người check-in đầu tiên sẽ được phép tham gia sự kiện.",
  "Vui lòng kiểm tra kỹ thông tin trước khi đặt, BTC không hỗ trợ đổi vé hoặc hoàn tiền trong trường hợp chọn nhầm số lượng vé.",
  "Chỉ mua vé tại kênh chính thức (ví dụ: https://www.otcayxe.com). BTC từ chối xử lý mọi trường hợp vé giả, vé sai thông tin do mua từ nguồn không chính thống.",
  "Khi tham gia chương trình, khán giả đồng ý cho phép BTC sử dụng hình ảnh, video cá nhân trong hoạt động ghi hình, truyền thông, quảng bá sự kiện.",
  "BTC có quyền kiểm tra giấy tờ tùy thân nếu nghi ngờ sai phạm độ tuổi và có quyền từ chối phục vụ mà không hoàn tiền nếu khán giả không tuân thủ quy định.",
  "BTC có quyền thay đổi line-up mà không cần thông báo trước và không hoàn tiền (nếu nghệ sĩ hủy ngoài ý muốn BTC).",
  "Khán giả tự chịu trách nhiệm về sức khỏe cá nhân trước, trong và sau sự kiện, bao gồm điều kiện thời tiết và di chuyển đến địa điểm. Việc tham dự đồng nghĩa với việc đã chấp nhận các rủi ro tiềm ẩn.",
  "Trong mọi trường hợp, quyết định từ BTC là quyết định cuối cùng.",
  "Danh sách vật dụng bị cấm, nội quy cụ thể sẽ được cập nhật trên fanpage chính thức của chương trình trước ngày diễn ra. Vui lòng theo dõi để đảm bảo tuân thủ.",
  "Không được phép mang theo các vật dụng nguy hiểm, chất cấm, đồ uống bên ngoài, flycam, pháo sáng,… vào khu vực sự kiện. BTC có quyền tịch thu hoặc từ chối cho vào cổng nếu vi phạm.",
  "Mỗi vé chỉ có giá trị cho một lần vào cổng. Khán giả không được ra vào nhiều lần nếu không có re-entry pass từ BTC.",
  "BTC không chịu trách nhiệm cho mọi mất mát tài sản cá nhân xảy ra trong khu vực sự kiện.",
  "Trong trường hợp thời tiết xấu, điều kiện bất khả kháng, BTC có thể hoãn/hủy show vì lý do an toàn, và sẽ thông báo chính sách cụ thể trong từng trường hợp.",
];

const FULL_RULES_EN: string[] = [
  "The show is for audiences aged 16 and over. Guests aged 10–15 may attend only with a guardian aged 18+ (one guardian per minor) who accepts full responsibility for any incident during the event.",
  "Pregnant guests and anyone with health concerns should carefully consider attending. In all cases, the organizer is not liable for health issues that arise.",
  "Each ticket admits one guest only; no bundled children or minors. A guardian accompanying a minor must hold a valid ticket to enter.",
  "Tickets cannot be exchanged or refunded. You are responsible for safeguarding ticket codes and payment details. If codes are duplicated, the first successful check-in will be admitted.",
  "Please verify all details before purchase; the organizer will not exchange tickets or refund if the wrong quantity is selected.",
  "Buy tickets only through official channels (e.g. https://www.otcayxe.com). The organizer will not handle fake tickets or incorrect data from unofficial sources.",
  "By attending, you consent to the organizer using your image and video for recording, communications, and event promotion.",
  "The organizer may check ID if age rules are suspected to be broken and may refuse service without refund if you do not comply.",
  "The lineup may change without prior notice and without refund (including if an artist cancels outside the organizer’s control).",
  "You are responsible for your health before, during, and after the event, including weather and travel. Attending means you accept potential risks.",
  "In all cases, the organizer’s decision is final.",
  "Prohibited items and specific house rules will be posted on the official fanpage before show day—please follow them.",
  "No dangerous items, banned substances, outside drinks, drones, flares, etc. The organizer may confiscate items or deny entry for violations.",
  "Each ticket is valid for a single entry; re-entry is not allowed without an organizer-issued re-entry pass.",
  "The organizer is not liable for loss of personal belongings in the venue.",
  "For severe weather or force majeure, the show may be postponed or cancelled for safety; a specific policy will be announced for each case.",
];

const HELP_BEFORE_VI = [
  "Chương trình dành cho khán giả từ 16 tuổi trở lên; khán giả 10–15 tuổi chỉ được tham gia khi có người giám hộ từ 18 tuổi trở lên đi kèm (một người lớn kèm một trẻ vị thành niên) và chịu trách nhiệm nếu có sự cố.",
  "Phụ nữ mang thai và người có vấn đề sức khỏe nên cân nhắc; BTC không chịu trách nhiệm về sức khỏe phát sinh.",
  "Mỗi vé cho một khán giả; trẻ vị thành niên đi kèm cần người giám hộ có vé hợp lệ.",
  "Kiểm tra kỹ số lượng và thông tin trước khi đặt — chọn nhầm số lượng vé sẽ không được đổi hoặc hoàn tiền.",
  "Chỉ mua tại kênh chính thức (ví dụ https://www.otcayxe.com); vé từ nguồn không chính thống có thể bị từ chối.",
];

const HELP_BEFORE_EN = [
  "The show is for ages 16+. Guests aged 10–15 need a guardian 18+ (one adult per minor) who accepts responsibility for incidents.",
  "Pregnant guests and anyone with health concerns should weigh risks carefully; the organizer is not liable for health issues.",
  "One ticket per guest; minors need a guardian with their own valid ticket.",
  "Double-check quantity and details before paying — wrong quantity is not eligible for exchange or refund.",
  "Purchase only via official channels (e.g. https://www.otcayxe.com); unofficial tickets may be refused.",
];

const HELP_AFTER_VI = [
  "Vé đã mua không đổi, không trả; bạn chịu trách nhiệm giữ mã vé và thông tin thanh toán.",
  "Nếu trùng mã vé, người check-in thành công đầu tiên được vào.",
  "BTC có thể kiểm tra giấy tờ tùy thân; vi phạm quy định có thể bị từ chối vào cổng và không hoàn tiền.",
  "Mỗi vé chỉ vào cổng một lần; ra vào lại cần re-entry pass do BTC cấp.",
];

const HELP_AFTER_EN = [
  "Tickets are non-exchangeable and non-refundable; protect your ticket codes and payment details.",
  "If a code is duplicated, the first successful check-in wins.",
  "ID checks may apply; breaking the rules can mean denied entry without refund.",
  "One entry per ticket; re-entry requires an organizer-issued re-entry pass.",
];

const HELP_VENUE_VI = [
  "Tham dự đồng nghĩa đồng ý để BTC dùng hình ảnh/video của bạn cho ghi hình, truyền thông và quảng bá.",
  "Line-up có thể thay đổi mà không báo trước; không hoàn tiền khi nghệ sĩ hủy ngoài tầm kiểm soát BTC.",
  "Quyết định của BTC là quyết định cuối cùng.",
  "Danh sách đồ cấm và nội quy chi tiết được cập nhật trên fanpage chính thức trước ngày diễn — vui lòng theo dõi.",
  "Cấm mang vật nguy hiểm, chất cấm, đồ uống ngoài, flycam, pháo sáng… BTC có thể tịch thu hoặc từ chối vào cổng.",
];

const HELP_VENUE_EN = [
  "Attending means you agree your image/video may be used for recording, PR, and promotion.",
  "The lineup may change without notice; no refund if an artist cancels outside the organizer’s control.",
  "The organizer’s decision is final in all matters.",
  "Banned items and detailed rules are posted on the official fanpage before show day.",
  "No dangerous items, banned substances, outside drinks, drones, flares, etc. Items may be confiscated or entry denied.",
];

const HELP_RISK_VI = [
  "Bạn tự chịu trách nhiệm sức khỏe trước, trong và sau sự kiện, gồm thời tiết và di chuyển; tham dự là chấp nhận rủi ro.",
  "BTC không chịu trách nhiệm mất mát tài sản cá nhân tại khu vực sự kiện.",
  "Thời tiết xấu hoặc bất khả kháng: BTC có thể hoãn/hủy vì an toàn; chính sách cụ thể sẽ được thông báo theo từng trường hợp.",
];

const HELP_RISK_EN = [
  "You are responsible for your health, travel, and weather; attending means accepting inherent risks.",
  "The organizer is not liable for lost personal property at the venue.",
  "Severe weather or force majeure may cause postponement or cancellation; policies will be announced per case.",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-3 pl-5 text-[15px] leading-[1.6] text-[#A1A1A1] marker:text-[#FF6B1A]">
      {items.map((line, idx) => (
        <li key={idx}>{line}</li>
      ))}
    </ul>
  );
}

function SectionCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 rounded-xl border border-[#262626] bg-[#141414] p-6 md:p-8">
      <h2 className="text-[22px] font-semibold tracking-[-0.3px] text-[#FAFAFA]">{title}</h2>
      {children}
    </section>
  );
}

export default function CommunityPage() {
  const [lang, setLang] = useState<HeaderLang>("vi");
  const [activeNav, setActiveNav] = useState<NavId>("before");
  const t = lang === "vi";

  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const venueRef = useRef<HTMLDivElement>(null);
  const riskRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);

  const scrollNav = (id: NavId) => {
    setActiveNav(id);
    const map: Record<NavId, RefObject<HTMLDivElement | null>> = {
      before: beforeRef,
      after: afterRef,
      venue: venueRef,
      risk: riskRef,
      full: fullRef,
    };
    map[id].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const rules = t ? FULL_RULES_VI : FULL_RULES_EN;

  return (
    <PageLayout>
      <Header
        lang={lang}
        onLangChange={setLang}
        navItems={[
          { href: "/community", label: t ? "Trợ giúp" : "Help", active: true },
          { href: "/profile", label: t ? "Vé của tôi" : "My tickets" },
        ]}
      />

      <main className="mx-auto max-w-[1280px] px-6 pb-20">
        <div className="pt-8">
          <h2 className="mb-2 text-[13px] font-medium uppercase tracking-wide text-[#737373]">
            {t ? "Trợ giúp" : "Help"}
          </h2>
          <h3 className="mb-2 text-[32px] font-semibold leading-[1.15] tracking-[-0.7px] text-[#FAFAFA]">
            {t ? "Quy định & thông tin Ớt Cay Xè" : "Ớt Cay Xè — rules & info"}
          </h3>
          <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-[#A1A1A1]">
            {t
              ? "Nội dung dưới đây được tóm theo quy định mua vé chính thức. Cuối trang có toàn văn đầy đủ để đối chiếu."
              : "Below is a topic-based summary of the official ticket rules. The full text is at the bottom for reference."}
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="flex gap-3 rounded-xl border border-[#FBBF2440] bg-[#FBBF2414] px-4 py-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#FBBF24]" aria-hidden />
            <div>
              <p className="text-sm font-medium text-[#FAFAFA]">
                {t ? "Chỉ mua vé kênh chính thức" : "Official sales only"}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#A1A1A1]">
                {t
                  ? "Ví dụ: https://www.otcayxe.com — vé không hợp lệ từ nguồn khác có thể bị từ chối."
                  : "e.g. https://www.otcayxe.com — unofficial tickets may be refused."}
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl border border-[#F8717140] bg-[#F8717114] px-4 py-3">
            <Lock className="mt-0.5 size-5 shrink-0 text-[#F87171]" aria-hidden />
            <div>
              <p className="text-sm font-medium text-[#FAFAFA]">
                {t ? "Vé không đổi / không trả" : "No exchanges or refunds"}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#A1A1A1]">
                {t
                  ? "Kiểm tra kỹ trước khi thanh toán; bảo quản mã vé — trùng mã thì người check-in trước được vào."
                  : "Verify before paying; keep codes safe — duplicate codes admit the first successful check-in."}
              </p>
            </div>
          </div>
        </div>

        <section className="pb-16">
          <div className="grid grid-cols-1 gap-8 py-6 lg:grid-cols-[280px_1fr]">
            <aside className="flex flex-col gap-1 lg:sticky lg:top-24 lg:self-start">
              <p className="mb-2 px-1 text-[12px] font-medium uppercase tracking-wide text-[#737373]">
                {t ? "Mục lục" : "On this page"}
              </p>
              <nav className="flex flex-col gap-1" aria-label={t ? "Trợ giúp" : "Help"}>
                {NAV.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollNav(item.id)}
                    className={[
                      "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      activeNav === item.id
                        ? "bg-[#1A1A1A] text-[#FAFAFA]"
                        : "text-[#A1A1A1] hover:bg-[#141414] hover:text-[#FAFAFA]",
                    ].join(" ")}
                  >
                    {t ? item.vi : item.en}
                  </button>
                ))}
              </nav>
            </aside>

            <div className="flex min-w-0 flex-col gap-8">
              <div ref={beforeRef}>
                <SectionCard id="help-before" title={t ? "Trước khi mua vé" : "Before you buy"}>
                  <BulletList items={t ? HELP_BEFORE_VI : HELP_BEFORE_EN} />
                </SectionCard>
              </div>

              <div ref={afterRef}>
                <SectionCard id="help-after" title={t ? "Vé & vào cổng" : "Tickets & entry"}>
                  <BulletList items={t ? HELP_AFTER_VI : HELP_AFTER_EN} />
                </SectionCard>
              </div>

              <div ref={venueRef}>
                <SectionCard id="help-venue" title={t ? "Tại địa điểm" : "At the venue"}>
                  <BulletList items={t ? HELP_VENUE_VI : HELP_VENUE_EN} />
                </SectionCard>
              </div>

              <div ref={riskRef}>
                <SectionCard id="help-risk" title={t ? "Rủi ro & bất khả kháng" : "Risks & force majeure"}>
                  <BulletList items={t ? HELP_RISK_VI : HELP_RISK_EN} />
                </SectionCard>
              </div>

              <div ref={fullRef}>
                <SectionCard id="help-full" title={t ? "Toàn văn quy định mua vé Ớt Cay Xè" : "Full ticket purchase rules"}>
                  <p className="mt-2 text-sm text-[#737373]">
                    {t
                      ? "QUY ĐỊNH MUA VÉ ỚT CAY XÈ — bản đầy đủ theo từng điểm."
                      : "Complete rules (numbered for reference only)."}
                  </p>
                  <ol className="mt-6 list-decimal space-y-4 pl-5 text-[15px] leading-[1.65] text-[#A1A1A1] marker:font-medium marker:text-[#FF6B1A]">
                    {rules.map((text, i) => (
                      <li key={i}>{text}</li>
                    ))}
                  </ol>
                </SectionCard>
              </div>
            </div>
          </div>
        </section>
      </main>

      <V2Footer />
    </PageLayout>
  );
}
