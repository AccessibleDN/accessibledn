import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import config from "~/appconfig/config";
import Footer from "~/components/Footer";
import { AuthenticationProvider } from "~/providers/AuthenticationProvider";

const Hind = localFont({
  src: "./fonts/Hind-Regular.ttf",
  variable: "--font-hind",
});

const HindBold = localFont({
  src: "./fonts/Hind-Bold.ttf",
  variable: "--font-hind-bold",
});

const HindLight = localFont({
  src: "./fonts/Hind-Light.ttf",
  variable: "--font-hind-light",
});

const HindMedium = localFont({
  src: "./fonts/Hind-Medium.ttf",
  variable: "--font-hind-medium",
});

const HindSemiBold = localFont({
  src: "./fonts/Hind-SemiBold.ttf",
  variable: "--font-hind-semi-bold",
});

export const metadata: Metadata = {
  title: config.name,
  description: config.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Hind.variable} ${HindBold.variable} ${HindLight.variable} ${HindMedium.variable} ${HindSemiBold.variable} antialiased min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900`}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative">
          {/* Decorative Elements */}
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full filter blur-3xl" />
          </div>
          <AuthenticationProvider>
            {children}
          </AuthenticationProvider>
          <Footer />  
        </div>
      </body>
    </html>
  );
}
