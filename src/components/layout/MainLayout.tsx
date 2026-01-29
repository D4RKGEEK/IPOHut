"use client";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAdmin } from "@/contexts/AdminContext";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function MainLayout({ children, title, description }: MainLayoutProps) {
  const { settings } = useAdmin();

  const pageTitle = title
    ? `${title}${settings.site.defaultSeo.titleSuffix}`
    : settings.site.branding.siteName;

  const pageDescription = description || settings.site.defaultSeo.defaultDescription;

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
