/**
 * Responsibility: Main Root Layout for the application.
 * Purpose: Provides the HTML structure, global fonts, context providers (like Auth, Theme), and the common header/footer layouts.
 * What code will eventually live here:
 * - Next.js Metadata for SEO optimization.
 * - Global provider wrappers (e.g., Supabase Auth Provider, React Contexts).
 * - Navigation header and footer components.
 */

import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "CollegeVibeCheck | Mumbai College Reviews & Ratings",
  description: "Check the vibe of Mumbai colleges before taking admission. View real ratings and comments by existing students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
