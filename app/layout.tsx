import type { Metadata } from "next";
import { Geist, Nunito } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lila · Yerel Belge Asistanı",
  description: "Kaynaklara dayalı yerel RAG asistanı arayüz demosu.",
  icons: { icon: "/assistant-icon.png" },
  openGraph: {
    title: "Lila · Yerel Belge Asistanı",
    description: "Çevrimdışı, kaynaklara dayalı belge sohbeti.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${geist.variable} ${nunito.variable}`}>{children}</body>
    </html>
  );
}
