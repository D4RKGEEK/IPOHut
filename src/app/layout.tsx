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
    const siteName = site.branding.siteName;
    const defaultImage = site.defaultSeo.ogImage || "/og-image.png";

    return {
        metadataBase: new URL('https://ipohut.com'),
        title: {
            default: siteName,
            template: `%s${site.defaultSeo.titleSuffix}`,
        },
        description: site.defaultSeo.defaultDescription,
        alternates: {
            canonical: "/",
        },
        openGraph: {
            title: {
                default: siteName,
                template: `%s${site.defaultSeo.titleSuffix}`,
            },
            description: site.defaultSeo.defaultDescription,
            siteName: siteName,
            images: [
                {
                    url: defaultImage,
                    width: 1200,
                    height: 630,
                    alt: siteName,
                }
            ],
            type: "website",
        },
        icons: {
            icon: site.branding.logoUrl || "/favicon.svg",
            apple: site.branding.logoUrl || "/favicon.svg",
            shortcut: site.branding.logoUrl || "/favicon.svg",
        },
        twitter: {
            card: "summary_large_image",
            title: {
                default: siteName,
                template: `%s${site.defaultSeo.titleSuffix}`,
            },
            description: site.defaultSeo.defaultDescription,
            site: site.defaultSeo.twitterHandle,
            creator: site.defaultSeo.twitterHandle,
            images: [defaultImage],
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
            <head>
                <link rel="preconnect" href="https://ipo-api-production.up.railway.app" />
                <link rel="preconnect" href="https://i.ibb.co" />
                <link rel="preconnect" href="https://images.weserv.nl" />
                <link rel="dns-prefetch" href="https://ipo-api-production.up.railway.app" />
            </head>
            <body className={inter.className}>
                {settings.site.scripts.headerScripts && (
                    <Script
                        id="header-scripts"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{ __html: settings.site.scripts.headerScripts }}
                    />
                )}

                {/* Google Analytics - Loaded after idle to improve PageSpeed */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${settings.site.analytics.googleAnalyticsId || 'G-4NKZT0DTZX'}`}
                    strategy="lazyOnload"
                />
                <Script id="google-analytics" strategy="lazyOnload">
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
