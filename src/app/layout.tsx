import type { Metadata } from "next";
import { Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-sans-hebrew",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Relogate - רילוקיישן לחו״ל? כל אחד יכול!",
  description:
    "Relogate - חברה בינלאומית המסייעת למתעניינים במעבר לחו״ל והופכת את החלום למציאות. קבלו דוח רילוקיישן מותאם אישית תוך 24 שעות!",
  keywords: [
    "רילוקיישן",
    "מעבר לחו״ל",
    "הגירה",
    "ויזה",
    "עבודה בחו״ל",
    "Relogate",
  ],
  authors: [{ name: "Relogate" }],
  openGraph: {
    title: "Relogate - רילוקיישן לחו״ל? כל אחד יכול!",
    description:
      "חברה בינלאומית המסייעת למתעניינים במעבר לחו״ל והופכת את החלום למציאות.",
    type: "website",
    locale: "he_IL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${notoSansHebrew.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
