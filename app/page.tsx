"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  ExternalLink,
  Landmark,
  Layers3,
  PieChart,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  WalletCards,
  Zap,
} from "lucide-react"
import styles from "./page.module.css"

const moneyFeatures = [
  {
    icon: WalletCards,
    title: "Thu chi trong một nhịp",
    description: "Ghi lại giao dịch nhanh, theo dõi dòng tiền và luôn biết tiền của bạn đang đi đâu.",
  },
  {
    icon: Users,
    title: "Nhiều hồ sơ, một tài khoản",
    description: "Tách riêng tài chính cá nhân, gia đình hoặc nhóm mà không cần tạo thêm tài khoản.",
  },
  {
    icon: PieChart,
    title: "Chi tiêu có chủ đích",
    description: "Phân bổ tiền theo phương pháp 6 chiếc hũ để mỗi khoản đều phục vụ một mục tiêu rõ ràng.",
  },
]

const ecosystemApps = [
  {
    name: "Owwi Money",
    label: "Tài chính cá nhân",
    description: "Quản lý thu chi, khoản vay, danh mục và mục tiêu tài chính trong một không gian gọn gàng.",
    url: "https://owwi.io.vn/",
    logo: "/web-app-manifest-192x192.png",
    accent: "money",
    action: "Mở Owwi Money",
  },
  {
    name: "MadPDF",
    label: "Công cụ PDF",
    description: "Nén PDF theo mức DPI bạn chọn, xử lý ngay trên web và tải xuống tức thì.",
    url: "https://madpdf.owwi.io.vn/",
    logo: "/brands/madpdf.png",
    accent: "pdf",
    action: "Thử MadPDF",
  },
  {
    name: "Nhịp",
    label: "Theo dõi hoạt động",
    description: "Ghi nhanh hoạt động mỗi ngày, nhìn lại tiến độ và giữ nhịp cho những điều quan trọng.",
    url: "https://tracking.owwi.io.vn/",
    logo: "/brands/nhip.png",
    accent: "tracking",
    action: "Mở Nhịp",
  },
] as const

export default function HomePage() {
  return (
    <div className={styles.landing}>
      <a className={styles.skipLink} href="#main-content">Bỏ qua điều hướng</a>
      <header className={styles.header}>
        <div className={styles.container}>
          <nav className={styles.nav} aria-label="Điều hướng chính">
            <Link href="/" className={styles.brand} aria-label="Owwi - Trang chủ">
              <span className={styles.brandIconFrame} aria-hidden="true">
                <Image
                  src="/web-app-manifest-192x192.png"
                  alt=""
                  width={38}
                  height={38}
                  className={styles.brandIcon}
                  priority
                />
              </span>
              <span>owwi</span>
            </Link>

            <div className={styles.navLinks}>
              <a href="#owwi-money">Owwi Money</a>
              <a href="#ecosystem">Hệ sinh thái</a>
              <Link href="/login" className={styles.loginLink}>
                Đăng nhập
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className={styles.hero}>
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <Sparkles size={15} aria-hidden="true" />
                Một hệ sinh thái nhỏ, hữu ích mỗi ngày
              </div>
              <h1>
                Nhẹ đầu chuyện tiền.
                <span> Rảnh tay cho điều quan trọng.</span>
              </h1>
              <p className={styles.heroDescription}>
                Owwi Money giúp bạn biến những con số rời rạc thành một bức tranh tài chính rõ ràng — dễ ghi chép, dễ theo dõi và dễ bắt đầu hơn mỗi ngày.
              </p>
              <div className={styles.heroActions}>
                <Link href="/login" className={styles.primaryButton}>
                  Bắt đầu với Owwi Money
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a href="#ecosystem" className={styles.secondaryButton}>
                  Khám phá hệ sinh thái
                </a>
              </div>
              <div className={styles.trustRow} aria-label="Điểm nổi bật">
                <span><Check size={16} aria-hidden="true" /> Gọn gàng, dễ dùng</span>
                <span><Check size={16} aria-hidden="true" /> Dùng tốt trên mọi thiết bị</span>
              </div>
            </div>

            <div className={styles.heroVisual} role="img" aria-label="Mô phỏng tổng quan tài chính Owwi Money">
              <div className={styles.visualGlow} aria-hidden="true" />
              <div className={styles.dashboardCard}>
                <div className={styles.dashboardTopbar}>
                  <div>
                    <span className={styles.microLabel}>Tổng quan tháng 8</span>
                    <strong>Xin chào, Nghĩa</strong>
                  </div>
                  <span className={styles.avatar}>NN</span>
                </div>

                <div className={styles.balanceCard}>
                  <span>Số dư khả dụng</span>
                  <strong>24.680.000 ₫</strong>
                  <div className={styles.balanceMeta}>
                    <span><Landmark size={15} aria-hidden="true" /> 3 nguồn tiền</span>
                    <span className={styles.positive}>+12,4% tháng này</span>
                  </div>
                </div>

                <div className={styles.dashboardColumns}>
                  <div className={styles.chartCard}>
                    <div className={styles.cardHeading}>
                      <span>Dòng tiền</span>
                      <BarChart3 size={17} aria-hidden="true" />
                    </div>
                    <div className={styles.bars} aria-hidden="true">
                      {[48, 70, 56, 84, 65, 92, 76].map((height, index) => (
                        <span key={index} style={{ height: `${height}%` }} />
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <span><i className={styles.incomeDot} /> Thu nhập</span>
                      <span><i className={styles.expenseDot} /> Chi tiêu</span>
                    </div>
                  </div>

                  <div className={styles.transactionCard}>
                    <div className={styles.cardHeading}>
                      <span>Gần đây</span>
                      <ReceiptText size={17} aria-hidden="true" />
                    </div>
                    <div className={styles.transactionList}>
                      <div><i className={styles.foodIcon}>F</i><span><b>Ăn uống</b><small>Hôm nay</small></span><strong>-85K</strong></div>
                      <div><i className={styles.homeIcon}>H</i><span><b>Nhà ở</b><small>Hôm qua</small></span><strong>-1,2M</strong></div>
                      <div><i className={styles.salaryIcon}>L</i><span><b>Lương</b><small>28/07</small></span><strong className={styles.positive}>+18M</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.floatingJar}>
                <Target size={19} aria-hidden="true" />
                <span><small>Quỹ tự do tài chính</small><strong>72% mục tiêu</strong></span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.principles} aria-label="Giá trị của Owwi">
          <div className={`${styles.container} ${styles.principleGrid}`}>
            <div><Zap size={19} aria-hidden="true" /><span><strong>Nhanh để ghi</strong><small>Không để thói quen bị ngắt quãng</small></span></div>
            <div><Layers3 size={19} aria-hidden="true" /><span><strong>Rõ để hiểu</strong><small>Nhìn đúng điều bạn cần biết</small></span></div>
            <div><ShieldCheck size={19} aria-hidden="true" /><span><strong>Riêng tư để an tâm</strong><small>Dữ liệu của bạn, quyền kiểm soát của bạn</small></span></div>
          </div>
        </section>

        <section id="owwi-money" className={styles.moneySection}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <span className={styles.sectionKicker}>OWWI MONEY</span>
              <h2>Một nơi đủ đơn giản để bạn muốn mở mỗi ngày.</h2>
              <p>
                Không thêm áp lực từ những bảng số phức tạp. Owwi Money giữ mọi thứ vừa đủ để bạn hiểu hiện tại và chủ động cho kế hoạch tiếp theo.
              </p>
            </div>

            <div className={styles.featureGrid}>
              {moneyFeatures.map(({ icon: Icon, title, description }, index) => (
                <article className={styles.featureCard} key={title}>
                  <span className={styles.featureNumber}>0{index + 1}</span>
                  <div className={styles.featureIcon}><Icon size={22} aria-hidden="true" /></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>

            <div className={styles.moneyCta}>
              <div>
                <span>Bắt đầu từ một giao dịch nhỏ</span>
                <strong>Bức tranh tài chính của bạn sẽ rõ dần theo thời gian.</strong>
              </div>
              <Link href="/login" className={styles.lightButton}>
                Vào Owwi Money <ChevronRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section id="ecosystem" className={styles.ecosystemSection}>
          <div className={styles.container}>
            <div className={styles.ecosystemHeading}>
              <div>
                <span className={styles.sectionKicker}>OWWI ECOSYSTEM</span>
                <h2>Mỗi công cụ giải quyết thật tốt một việc.</h2>
              </div>
              <p>
                Từ tiền bạc, tài liệu đến nhịp sống hằng ngày — Owwi xây những sản phẩm nhỏ gọn để giảm bớt việc vụn vặt cho bạn.
              </p>
            </div>

            <div className={styles.appGrid}>
              {ecosystemApps.map(({ name, label, description, url, logo, accent, action }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.appCard} ${styles[accent]}`}
                  aria-label={`${action} (mở trong tab mới)`}
                >
                  <div className={styles.appTopline}>
                    <span className={styles.appLogoFrame}>
                      <Image
                        src={logo}
                        alt={`Logo ${name}`}
                        width={52}
                        height={52}
                        className={styles.appLogo}
                      />
                    </span>
                    <span className={styles.appMeta}>
                      <span className={styles.appStatus}><i aria-hidden="true" />Đang hoạt động</span>
                      <ExternalLink size={18} aria-hidden="true" />
                    </span>
                  </div>
                  <span className={styles.appLabel}>{label}</span>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <span className={styles.appAction}>{action}<ArrowRight size={17} aria-hidden="true" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={`${styles.container} ${styles.finalCtaInner}`}>
            <div>
              <span className={styles.ctaEyebrow}>BẮT ĐẦU NHẸ NHÀNG</span>
              <h2>Tài chính rõ hơn từ hôm nay.</h2>
              <p>Không cần hoàn hảo. Chỉ cần ghi lại giao dịch đầu tiên.</p>
            </div>
            <Link href="/login" className={styles.primaryButton}>
              Khám phá Owwi Money
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <Link href="/" className={styles.brand} aria-label="Owwi - Trang chủ">
            <span className={styles.brandIconFrame} aria-hidden="true">
              <Image
                src="/web-app-manifest-192x192.png"
                alt=""
                width={38}
                height={38}
                className={styles.brandIcon}
              />
            </span>
            <span>owwi</span>
          </Link>
          <p>Những công cụ nhỏ cho cuộc sống nhẹ hơn.</p>
          <span>© {new Date().getFullYear()} Owwi</span>
        </div>
      </footer>
    </div>
  )
}
