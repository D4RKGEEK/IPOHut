import './globals.css';
import { Providers } from './providers';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

import { defaultAdminSettings } from "@/types/admin";
import Script from "next/script";

export const metadata = {
    title: {
        default: defaultAdminSettings.site.branding.siteName,
        template: `%s${defaultAdminSettings.site.defaultSeo.titleSuffix}`,
    },
    description: defaultAdminSettings.site.defaultSeo.defaultDescription,
    keywords: defaultAdminSettings.site.defaultSeo.defaultKeywords,
    openGraph: {
        title: {
            default: defaultAdminSettings.site.branding.siteName,
            template: `%s${defaultAdminSettings.site.defaultSeo.titleSuffix}`,
        },
        description: defaultAdminSettings.site.defaultSeo.defaultDescription,
        siteName: defaultAdminSettings.site.branding.siteName,
        images: defaultAdminSettings.site.defaultSeo.ogImage ? [defaultAdminSettings.site.defaultSeo.ogImage] : [],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: {
            default: defaultAdminSettings.site.branding.siteName,
            template: `%s${defaultAdminSettings.site.defaultSeo.titleSuffix}`,
        },
        description: defaultAdminSettings.site.defaultSeo.defaultDescription,
        site: defaultAdminSettings.site.defaultSeo.twitterHandle,
        creator: defaultAdminSettings.site.defaultSeo.twitterHandle,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                {defaultAdminSettings.site.scripts.headerScripts && (
                    <Script
                        id="header-scripts"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{ __html: defaultAdminSettings.site.scripts.headerScripts }}
                    />
                )}
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
