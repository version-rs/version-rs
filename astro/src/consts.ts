export const SITE_TITLE = "version.rs — Rust Compiler Release Tracker";
export const SITE_DESCRIPTION =
  "Track Rust compiler releases, changelogs, upcoming milestones, and stabilization PRs.";

export const GITHUB_URL = "https://github.com/version-rs/version-rs";
export const SITE_URL = "https://version.rs";

export const DEFAULT_OG_IMAGE = "/og-default.svg";

export const SITE_METADATA = {
  title: {
    default: "version.rs — Rust Compiler Release Tracker",
  },
  description:
    "Track Rust compiler releases, changelogs, upcoming milestones, and stabilization PRs.",
  keywords: [
    "Rust",
    "Rust compiler",
    "Rust releases",
    "Rust toolchain",
    "rust-lang",
    "Rust language",
    "rustup",
    "changelog",
    "stabilization",
    "tracker",
    "version.rs",
  ],
  authors: [{ name: "version-rs", url: SITE_URL }],
  creator: "version-rs",
  publisher: "version-rs",
  robots: { index: true, follow: true },
  language: "en-US",
  locale: "en_US",
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-32x32.ico", sizes: "32x32" },
    ],
    apple: [{ url: "/favicon/favicon.svg" }],
    shortcut: [{ url: "/favicon/favicon.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "version.rs",
    title: "version.rs — Rust Compiler Release Tracker",
    description:
      "Track Rust compiler releases, changelogs, upcoming milestones, and stabilization PRs.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "version.rs — Rust Compiler Release Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@version_rs",
    creator: "@version_rs",
    title: "version.rs — Rust Compiler Release Tracker",
    description:
      "Track Rust compiler releases, changelogs, upcoming milestones, and stabilization PRs.",
    images: [DEFAULT_OG_IMAGE],
  },
  verification: { google: "", yandex: "", bing: "" },
};

export const SOCIAL_LINKS = {
  github: GITHUB_URL,
};

export const COMPANY_INFO = {
  name: "version-rs",
  legalName: "version-rs",
  url: SITE_URL,
  logo: "",
  foundingDate: "2025",
  sameAs: [GITHUB_URL],
};
