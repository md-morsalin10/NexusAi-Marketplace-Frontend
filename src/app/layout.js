import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AIChatAssistant from "@/components/AIChatAssistant";
import { Toaster } from "react-hot-toast";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NexusAI Marketplace — Buy & Sell AI Gadgets",
  description: "The premier AI-powered marketplace for gadgets, tools, and smart tech. Buy, sell, and discover the future.",
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {!isDashboard && <Navbar />}
        {children}
        <AIChatAssistant />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#0b0f19', color: '#e5e7eb', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '12px', fontSize: '13px' },
        }} />
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}
