import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import IPODetailPage from "@/views/IPODetailPage";
import { fetchIPODetail, fetchIPOMetadata, fetchStatus, parseIPODate } from "@/lib/api";
import { applyTemplate } from "@/types/admin";
import { defaultAdminSettings } from "@/types/admin";
import { getAdminSettings } from "@/lib/server-config";

// 3 Hour Revalidation
export const revalidate = 25200;
export const dynamicParams = false;

export async function generateStaticParams() {
    try {
        const response = await fetchIPOMetadata();
        if (!response.data) return [];

        return response.data.map((ipo) => ({
            slug: ipo.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    try {
        const response = await fetchIPODetail(slug);

        if (!response.data) {
            return {
                title: "IPO Not Found | IPO Hut",
                description: "The requested IPO details could not be found."
            };
        }

        const ipo = response.data;
        const basicInfo = ipo.basic_info;
        const gmpData = ipo.gmp_data;
        const timeline = ipo.ipo_timeline;
        const logo = ipo.logo_about?.logo || "";
        const ipoName = basicInfo["IPO Name"] || slug;

        // SEO content extraction
        const priceBand = basicInfo["Price Band"] || "TBA";
        const lotSize = basicInfo["Lot Size"] || "TBA";
        const gmpValue = gmpData?.current_gmp ?? "TBA";
        const url = `https://ipohut.com/ipo/${slug}/`;

        const title = `${ipoName} Details: Price, GMP Today, Review & Analysis`;
        const description = `Get ${ipoName} details: Price ${priceBand}, Lot ${lotSize} & GMP Today. Read our expert review, listing gain potential and key subscription dates.`;

        const settings = getAdminSettings();
        const siteLogo = settings.site.branding.logoUrl || "/favicon.svg";
        const defaultImage = settings.site.defaultSeo.ogImage || siteLogo;
        const useIpoLogo = settings.site.defaultSeo.useIpoLogoInSeo !== false;

        const logoUrl = (logo && useIpoLogo) ? logo : defaultImage;
        const images = [{
            url: logoUrl,
            width: 1200,
            height: 630,
            alt: settings.site.branding.siteName,
        }];

        return {
            title,
            description,
            alternates: {
                canonical: url,
            },
            openGraph: {
                title,
                description,
                url,
                type: "article",
                images,
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: (logo && useIpoLogo) ? [logo] : [defaultImage],
            },
            keywords: [`${ipoName} IPO`, `${ipoName} GMP`, `${ipoName} Price Band`, `${ipoName} Review`, `${ipoName} Analysis`, `IPO Hut`],
        };
    } catch (error) {
        return {
            title: "IPO Details | IPO Hut",
        };
    }
}

export default async function IPODetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const detailResponse = await fetchIPODetail(slug);

        if (!detailResponse.data) {
            notFound();
        }

        const ipo = detailResponse.data;
        const ipoType = ipo.ipo_type;

        // Fetch related IPOs for internal linking
        let relatedIpos: any[] = [];
        try {
            const metadataResponse = await fetchIPOMetadata();
            if (metadataResponse.data) {
                // In a real scenario, we'd fetch specific status but metadata is lightweight
                // However, metadata doesn't have status/type in this API version
                // Let's use fetchStatus for the current type instead
                const statusResponse = await fetchStatus({
                    status: 'open', // Start with open
                    ipo_type: ipoType,
                    limit: 10
                });

                relatedIpos = statusResponse.data || [];

                // If not enough open, fetch upcoming
                if (relatedIpos.length < 5) {
                    const upcomingResponse = await fetchStatus({
                        status: 'upcoming',
                        ipo_type: ipoType,
                        limit: 10
                    });
                    relatedIpos = [...relatedIpos, ...(upcomingResponse.data || [])];
                }

                // If still not enough, fetch recently listed
                if (relatedIpos.length < 5) {
                    const listedResponse = await fetchStatus({
                        status: 'recently_listed',
                        ipo_type: ipoType,
                        limit: 10
                    });
                    relatedIpos = [...relatedIpos, ...(listedResponse.data || [])];
                }

                // Deduplicate by slug and exclude current
                const seen = new Set([slug]);
                relatedIpos = relatedIpos.filter(item => {
                    if (seen.has(item.slug)) return false;
                    seen.add(item.slug);
                    return true;
                }).slice(0, 5);
            }
        } catch (error) {
            console.error("Error fetching related IPOs:", error);
        }

        const settings = getAdminSettings();
        const pageSettings = settings.pages.ipoDetail;
        const basicInfo = ipo.basic_info;
        const timeline = ipo.ipo_timeline;
        const gmpData = ipo.gmp_data;
        const ipoName = basicInfo["IPO Name"] || slug;

        // Structured Data Logic (SSR)
        const getIssuePrice = (): number => {
            const priceStr = basicInfo["Issue Price"];
            if (priceStr) {
                const price = parseFloat(priceStr.replace(/[^\d.]/g, ""));
                if (price > 0) return price;
            }
            const priceBand = basicInfo["Price Band"];
            if (priceBand) {
                const matches = priceBand.match(/(\d+)\s*to\s*(\d+)/i);
                if (matches && matches[2]) return parseFloat(matches[2]);
                const numbers = priceBand.match(/\d+/g);
                if (numbers && numbers.length > 0) return parseFloat(numbers[numbers.length - 1]);
            }
            return 0;
        };

        const issuePrice = getIssuePrice();
        const now = new Date();
        const openDate = parseIPODate(timeline["IPO Open"]);
        const closeDate = parseIPODate(timeline["IPO Close"]);
        const listingDate = parseIPODate(timeline["Listing"]);

        let status = "upcoming";
        if (listingDate && now > listingDate) status = "listed";
        else if (closeDate && now > closeDate) status = "closed";
        else if (openDate && now >= openDate) status = "open";

        const templateVars = {
            ipo_name: ipoName,
            gmp_value: gmpData?.current_gmp ?? 0,
            listing_date: timeline["Listing"] || "TBA",
        };
        const pageDescription = applyTemplate(pageSettings.descriptionTemplate, templateVars);

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            "name": ipoName,
            "description": ipo.about_company?.about_company || pageDescription,
            "provider": {
                "@type": "Organization",
                "name": ipoName.replace(" IPO", ""),
            },
            "offers": {
                "@type": "Offer",
                "price": issuePrice,
                "priceCurrency": "INR",
                "availability": status === "open" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
        };

        const faqStructuredData = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `What is the GMP of ${ipoName}?`,
                    "acceptedAnswer": { "@type": "Answer", "text": `The current Grey Market Premium (GMP) of ${ipoName} is ₹${gmpData?.current_gmp ?? 0}.` }
                },
                {
                    "@type": "Question",
                    "name": `When is the allotment of ${ipoName}?`,
                    "acceptedAnswer": { "@type": "Answer", "text": `The tentative allotment date for ${ipoName} is ${timeline["Allotment"] || "to be announced"}.` }
                }
            ],
        };

        const breadcrumbStructuredData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ipohut.com/" },
                { "@type": "ListItem", "position": 2, "name": ipoType === "sme" ? "SME IPO" : "Mainboard IPO", "item": `https://ipohut.com/${ipoType === 'sme' ? 'sme' : 'mainboard'}-ipo/` },
                { "@type": "ListItem", "position": 3, "name": ipoName, "item": `https://ipohut.com/ipo/${slug}/` }
            ]
        };

        return (
            <>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />
                <IPODetailPage initialData={ipo} relatedIpos={relatedIpos} />
            </>
        );
    } catch (error) {
        notFound();
    }
}
