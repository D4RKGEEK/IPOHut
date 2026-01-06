import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import IPODetailPage from "@/views/IPODetailPage";
import { fetchIPODetail, fetchIPOMetadata } from "@/lib/api";
import { applyTemplate } from "@/types/admin";
import { defaultAdminSettings } from "@/types/admin";
import { getAdminSettings } from "@/lib/server-config";

// 3 Hour Revalidation
export const revalidate = 10800;

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
        const subscription = ipo.subscription_status;

        // Parse issue price with fallback to price band
        const getIssuePrice = (): number => {
            const issuePriceStr = basicInfo["Issue Price"];
            if (issuePriceStr) {
                const price = parseFloat(issuePriceStr.replace(/[^\d.]/g, ""));
                if (price > 0) return price;
            }

            // Fallback to extracting upper price from Price Band
            const priceBand = basicInfo["Price Band"];
            if (priceBand) {
                const matches = priceBand.match(/(\d+)\s*to\s*(\d+)/i);
                if (matches && matches[2]) {
                    return parseFloat(matches[2]);
                }
                const numbers = priceBand.match(/\d+/g);
                if (numbers && numbers.length > 0) {
                    return parseFloat(numbers[numbers.length - 1]);
                }
            }

            return 0;
        };

        const issuePrice = getIssuePrice();

        // Fetch dynamic admin settings
        const settings = await getAdminSettings();
        const pageSettings = settings.pages.ipoDetail;

        const templateVars = {
            ipo_name: basicInfo["IPO Name"] || slug,
            company_name: basicInfo["IPO Name"] || slug,
            gmp_value: gmpData?.current_gmp ?? 0,
            gmp_percent: gmpData?.current_gmp && issuePrice ? ((gmpData.current_gmp / issuePrice) * 100).toFixed(2) : "0",
            listing_date: timeline["Tentative Listing Date"] || "TBA",
            open_date: timeline["IPO Open Date"] || "",
            close_date: timeline["IPO Close Date"] || "",
            issue_price: issuePrice,
            subscription_times: subscription?.SubscriptionTable?.[0]?.subscription_times ?? 0,
        };

        const title = applyTemplate(pageSettings.titleTemplate, templateVars);
        const description = applyTemplate(pageSettings.descriptionTemplate, templateVars);

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                type: "article",
                images: ipo.logo_about?.logo ? [ipo.logo_about.logo] : [],
            },
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
        const response = await fetchIPODetail(slug);

        if (!response.data) {
            notFound();
        }

        return <IPODetailPage initialData={response.data} />;
    } catch (error) {
        notFound();
    }
}
