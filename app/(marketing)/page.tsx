import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BarChart3, CheckCircle2, Clock3, Globe2, MonitorSmartphone, ShieldCheck, Sparkles, WalletCards } from "lucide-react"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://owwimoney.com"

export const metadata: Metadata = {
  title: "Owwi Money - Ứng dụng web quản lý tài chính cá nhân nhanh gọn",
  description:
    "Owwi Money là ứng dụng web quản lý tài chính cá nhân giúp ghi lại thu nhập, chi tiêu chưa đến 3 giây. Nhanh gọn, tiện lợi, đa nền tảng trên web, Android, iOS và PC.",
  keywords: [
    "ứng dụng web quản lý tài chính cá nhân",
    "ứng dụng quản lý tài chính",
    "quản lý chi tiêu cá nhân",
    "ghi lại thu nhập",
    "ghi chép thu chi",
    "quản lý tiền cá nhân",
    "ứng dụng tài chính đa nền tảng",
    "web quản lý chi tiêu",
    "Owwi Money",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Owwi Money - Quản lý tài chính cá nhân chưa đến 3 giây",
    description: "Ghi thu nhập, chi tiêu nhanh gọn. Theo dõi tài chính mọi lúc trên web, Android, iOS và PC.",
    url: siteUrl,
    siteName: "Owwi Money",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Owwi Money - Ứng dụng quản lý tài chính cá nhân",
    description: "Ghi thu nhập, chi tiêu chưa đến 3 giây. Nhanh gọn, tiện lợi, đa nền tảng.",
  },
}

const features = [
  { icon: Clock3, title: "Ghi thu nhập, chi tiêu chưa đến 3 giây", description: "Mở app, nhập số tiền, chọn danh mục và lưu. Tối ưu cho những lần ghi nhanh trong ngày." },
  { icon: MonitorSmartphone, title: "Đa nền tảng: web, Android, iOS, PC", description: "Dùng trực tiếp trên trình duyệt hoặc cài như PWA để truy cập nhanh ở bất kỳ đâu." },
  { icon: BarChart3, title: "Theo dõi dòng tiền rõ ràng", description: "Xem tổng quan thu nhập, chi tiêu, danh mục và xu hướng để biết tiền đang đi đâu." },
  { icon: WalletCards, title: "Quản lý nhiều profile tài chính", description: "Tách riêng cá nhân, gia đình, dự án hoặc nhóm chi tiêu mà không lẫn dữ liệu." },
  { icon: Globe2, title: "Sử dụng ở bất kỳ đâu", description: "Chỉ cần internet và trình duyệt. Dữ liệu luôn sẵn sàng khi bạn cần kiểm tra hoặc ghi chép." },
  { icon: ShieldCheck, title: "Đăng nhập linh hoạt", description: "Hỗ trợ tài khoản mật khẩu và Google, phù hợp cho thói quen sử dụng hằng ngày." },
]

const steps = [
  "Tạo tài khoản Owwi Money miễn phí",
  "Chọn profile tài chính muốn theo dõi",
  "Ghi thu nhập hoặc chi tiêu trong vài giây",
  "Xem báo cáo để điều chỉnh thói quen dùng tiền",
]

const faqs = [
  { question: "Owwi Money có phải ứng dụng quản lý tài chính cá nhân không?", answer: "Có. Owwi Money tập trung vào ghi chép thu nhập, chi tiêu, phân loại danh mục và theo dõi dòng tiền cá nhân một cách nhanh gọn." },
  { question: "Có dùng được trên điện thoại không?", answer: "Có. Owwi Money chạy trên web và có thể cài như PWA, phù hợp để dùng trên Android, iOS, PC và tablet." },
  { question: "Ghi chi tiêu có nhanh không?", answer: "Có. Luồng nhập được tối ưu để ghi lại thu nhập hoặc chi tiêu thường ngày trong vài giây." },
  { question: "Owwi Money phù hợp với ai?", answer: "Phù hợp với người muốn kiểm soát tiền cá nhân, theo dõi chi tiêu gia đình, freelancer hoặc người cần ghi dòng tiền nhanh mỗi ngày." },
]

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Owwi Money",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web, Android, iOS, Windows, macOS",
    description: "Ứng dụng web quản lý tài chính cá nhân giúp ghi thu nhập, chi tiêu nhanh gọn, tiện lợi và đa nền tảng.",
    url: siteUrl,
    offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <main className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50 px-3 py-4 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.14),transparent_35%)]" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-2">
          <Link href="/" className="text-lg font-bold sm:text-xl text-sky-600 dark:text-sky-400" aria-label="Owwi Money trang chủ">Owwi Money</Link>
          <nav className="flex items-center gap-1 text-xs font-medium min-[360px]:gap-2 sm:gap-3 sm:text-sm">
            <Link href="/login" className="rounded-full px-2.5 py-2 min-[360px]:px-3 sm:px-4 text-slate-700 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-white/10">Đăng nhập</Link>
            <Link href="/register" className="rounded-full bg-slate-950 px-3 py-2.5 min-[360px]:px-4 sm:px-5 text-white shadow-lg hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">Dùng thử</Link>
          </nav>
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 py-10 sm:py-14 lg:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-2 text-xs min-[360px]:text-sm font-medium text-sky-700 shadow-sm dark:border-sky-800 dark:bg-slate-900/80 dark:text-sky-300">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span className="truncate">Ứng dụng web quản lý tài chính cá nhân</span>
            </div>
            <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight min-[360px]:text-4xl text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">Quản lý tài chính cá nhân, ghi thu nhập chi tiêu chưa đến 3 giây</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8 text-slate-600 dark:text-slate-300">Owwi Money giúp bạn ghi lại thu nhập, chi tiêu, phân loại danh mục và theo dõi dòng tiền mỗi ngày. Nhanh gọn, tiện lợi, sử dụng ở bất kỳ đâu trên web, Android, iOS và PC.</p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3.5 text-sm min-[360px]:px-5 sm:px-6 sm:py-4 sm:text-base font-semibold text-white shadow-xl shadow-sky-600/20 hover:bg-sky-700">Bắt đầu quản lý tiền ngay<ArrowRight className="ml-2 h-5 w-5" /></Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm min-[360px]:px-5 sm:px-6 sm:py-4 sm:text-base font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">Tôi đã có tài khoản</Link>
            </div>
            <div className="mt-6 grid gap-3 text-sm sm:mt-8 text-slate-600 dark:text-slate-300 sm:grid-cols-3">
              {["Ghi chép nhanh", "Báo cáo rõ ràng", "Đa nền tảng"].map((item) => (
                <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" />{item}</div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-2.5 min-[360px]:p-3 sm:rounded-[2rem] sm:p-4 shadow-2xl shadow-sky-900/10 dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-[1.25rem] bg-slate-950 p-3 min-[360px]:p-4 sm:rounded-[1.5rem] sm:p-5 text-white">
              <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
                <div><p className="text-sm text-slate-400">Tháng này</p><p className="text-xl font-bold min-[360px]:text-2xl">12.450.000đ</p></div>
                <div className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs min-[360px]:text-sm text-emerald-300">+18%</div>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                {[["Thu nhập", "+8.000.000đ", "bg-emerald-400"], ["Ăn uống", "-1.250.000đ", "bg-orange-400"], ["Di chuyển", "-420.000đ", "bg-sky-400"]].map(([label, amount, color]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-white/10 p-3 text-sm min-[360px]:text-base sm:rounded-2xl sm:p-4"><div className="flex min-w-0 items-center gap-2 min-[360px]:gap-3"><span className={`h-3 w-3 rounded-full ${color}`} /><span className="truncate">{label}</span></div><span className="shrink-0 font-semibold">{amount}</span></div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-sky-500 p-3 sm:mt-5 sm:rounded-2xl sm:p-4"><p className="text-sm text-sky-100">Ghi nhanh</p><p className="mt-1 text-lg font-bold sm:text-xl">Cà phê -45.000đ</p><p className="mt-1 text-sm text-sky-100">Đã lưu trong 2.4 giây</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 py-12 sm:px-6 sm:py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Vì sao nên dùng Owwi Money?</h2>
            <p className="mt-3 text-base leading-7 text-slate-600 sm:mt-4 sm:text-lg dark:text-slate-300">Một ứng dụng quản lý tài chính cá nhân tốt phải đủ nhanh để bạn muốn dùng mỗi ngày, và đủ rõ ràng để bạn hiểu tiền của mình.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-3xl sm:p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 flex h-11 w-11 sm:mb-5 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"><Icon className="h-6 w-6" /></div>
                  <h3 className="text-lg font-semibold sm:text-xl">{feature.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600 sm:mt-3 dark:text-slate-300">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-3 py-12 sm:px-6 sm:py-16 dark:bg-slate-900/60 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:gap-10 lg:grid-cols-2">
          <div><h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Bắt đầu quản lý chi tiêu trong 4 bước</h2><p className="mt-3 text-base leading-7 sm:mt-4 sm:text-lg sm:leading-8 text-slate-600 dark:text-slate-300">Không cần bảng tính phức tạp. Owwi Money giúp bạn ghi chép và xem tình hình tài chính cá nhân theo cách đơn giản hơn.</p></div>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950"><div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 font-bold text-white">{index + 1}</div><p className="pt-1.5 text-sm font-medium sm:pt-2 sm:text-base text-slate-800 dark:text-slate-100">{step}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 py-12 sm:px-6 sm:py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-4xl">Câu hỏi thường gặp</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><summary className="cursor-pointer text-lg font-semibold text-slate-900 dark:text-white">{faq.question}</summary><p className="mt-2 leading-7 text-slate-600 sm:mt-3 dark:text-slate-300">{faq.answer}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 pb-12 sm:px-6 sm:pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[1.5rem] bg-gradient-to-r from-sky-600 to-blue-700 p-5 sm:rounded-[2rem] sm:p-8 text-center text-white shadow-2xl shadow-sky-700/20 sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Sẵn sàng kiểm soát tiền cá nhân tốt hơn?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 sm:mt-4 sm:text-lg text-sky-100">Tạo tài khoản và bắt đầu ghi lại thu nhập, chi tiêu ngay hôm nay. Nhanh gọn, tiện lợi, dùng được ở bất kỳ đâu.</p>
          <Link href="/register" className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3.5 text-sm sm:mt-8 sm:px-6 sm:py-4 sm:text-base font-semibold text-sky-700 hover:bg-sky-50">Dùng Owwi Money miễn phí<ArrowRight className="ml-2 h-5 w-5" /></Link>
        </div>
      </section>
    </main>
  )
}
