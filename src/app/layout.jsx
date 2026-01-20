import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "MKF Trust | Making a Difference",
  description: "Empowering communities through education, healthcare, and social welfare.",
};

import AuthCheck from "@/components/auth/AuthCheck";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <AuthCheck />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
