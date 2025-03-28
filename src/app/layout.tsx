// src/app/layout.tsx
import "./globals.css";
import { BackendHealthProvider } from "@/components/providers/BackendHealthProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <BackendHealthProvider>
            <NotificationProvider>
              <NavbarWrapper>
                <main className="flex-grow bg-gray-50 dark:bg-black">
                  {children}
                </main>
              </NavbarWrapper>
              <Footer />
            </NotificationProvider>
          </BackendHealthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
