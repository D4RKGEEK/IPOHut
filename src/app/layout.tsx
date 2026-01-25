import './globals.css';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

import { getAdminSettings } from "@/lib/server-config";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
    const settings = getAdminSettings();
    const site = settings.site;

    return {
        title: {
            default: site.branding.siteName,
            template: `%s${site.defaultSeo.titleSuffix}`,
        },
        description: site.defaultSeo.defaultDescription,
        // keywords: site.defaultSeo.defaultKeywords, // Type might be missing, checking later
        openGraph: {
            title: {
                default: site.branding.siteName,
                template: `%s${site.defaultSeo.titleSuffix}`,
            },
            description: site.defaultSeo.defaultDescription,
            siteName: site.branding.siteName,
            images: site.defaultSeo.ogImage ? [site.defaultSeo.ogImage] : [],
            type: "website",
        },
        icons: {
            icon: site.branding.logoUrl || "/favicon.ico",
            apple: site.branding.logoUrl || "/favicon.ico",
            shortcut: site.branding.logoUrl || "/favicon.ico",
        },
        twitter: {
            card: "summary_large_image",
            title: {
                default: site.branding.siteName,
                template: `%s${site.defaultSeo.titleSuffix}`,
            },
            description: site.defaultSeo.defaultDescription,
            site: site.defaultSeo.twitterHandle,
            creator: site.defaultSeo.twitterHandle,
        },
    };
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = getAdminSettings();

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                {settings.site.scripts.headerScripts && (
                    <Script
                        id="header-scripts"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{ __html: settings.site.scripts.headerScripts }}
                    />
                )}

                {/* Google Analytics */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${settings.site.analytics.googleAnalyticsId || 'G-4NKZT0DTZX'}`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${settings.site.analytics.googleAnalyticsId || 'G-4NKZT0DTZX'}', {
                            page_path: window.location.pathname,
                        });
                    `}
                </Script>
                <Providers initialAdminSettings={settings}>{children}</Providers>
            </body>
        </html>
    );
}
