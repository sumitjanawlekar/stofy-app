import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stofy",
  description: "Interactive vertical micro-dramas",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white antialiased m-0 p-0 overflow-x-hidden">
        <div className="w-full max-w-md mx-auto min-h-[100dvh] bg-black relative flex flex-col overflow-hidden shadow-2xl border-x border-neutral-900">
          {children}
        </div>
      </body>
    </html>
  );
}
