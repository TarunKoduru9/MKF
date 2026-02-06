import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "MKF Trust | Making a Difference",
  description: "Empowering communities through education, healthcare, and social welfare.",
  icons: {
    icon: "/logo.ico",
  },
};

import AuthCheck from "@/components/auth/AuthCheck";
import TanStackProvider from "@/components/providers/TanStackProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${poppins.variable} antialiased`}>
        <TanStackProvider>
          <AuthCheck />
          {children}
          <Toaster />
        </TanStackProvider>
      </body>
    </html>
  );
}
