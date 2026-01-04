import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAdmin } from "@/contexts/AdminContext";
import { Helmet } from "react-helmet-async";

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
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {settings.site.defaultSeo.ogImage && (
          <meta property="og:image" content={settings.site.defaultSeo.ogImage} />
        )}
        {settings.site.defaultSeo.twitterHandle && (
          <meta name="twitter:site" content={settings.site.defaultSeo.twitterHandle} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Header Scripts */}
        {settings.site.scripts.headerScripts && (
          <script>{settings.site.scripts.headerScripts}</script>
        )}
      </Helmet>

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
