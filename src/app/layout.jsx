import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://diarynity.com"),

  title: {
    default: "DIARYNITY | Private Life Archive",
    template: "%s | DIARYNITY",
  },

  description:
    "DIARYNITY, hayat hikâyelerini, anıları ve kişisel mirası güvenli, zarif ve uzun ömürlü şekilde saklamak için tasarlanmış premium dijital yaşam arşividir.",

  keywords: [
    "DIARYNITY",
    "digital memory archive",
    "private life archive",
    "life story archive",
    "anı arşivi",
    "dijital hatıra",
    "kişisel miras",
    "yaşam hikayesi",
    "hatıra saklama",
  ],

  authors: [{ name: "DIARYNITY" }],
  creator: "DIARYNITY",
  publisher: "DIARYNITY",

  openGraph: {
    title: "DIARYNITY | Private Life Archive",
    description:
      "Hayatını kaydet. Hatıranı yaşat. DIARYNITY, kişisel anılar ve yaşam hikâyeleri için premium dijital arşiv platformudur.",
    url: "https://diarynity.com",
    siteName: "DIARYNITY",
    images: [
      {
        url: "/images/diarynity-og.jpg",
        width: 1200,
        height: 630,
        alt: "DIARYNITY Private Life Archive",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "DIARYNITY | Private Life Archive",
    description:
      "Hayatını kaydet. Hatıranı yaşat. Premium dijital yaşam arşivi.",
    images: ["/images/diarynity-og.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}