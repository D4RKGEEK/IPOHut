import IPOAllotmentCheckerPage from "@/views/IPOAllotmentCheckerPage";
import { fetchIPOMetadata, fetchIPODetail } from "@/lib/api";
import { notFound } from "next/navigation";

// 3 Hour Revalidation
export const revalidate = 25200;

export async function generateStaticParams() {
    try {
        const response = await fetchIPOMetadata();
        if (!response.data) return [];

        return response.data.map((ipo) => ({
            slug: ipo.slug,
        }));
    } catch (error) {
        console.error("Error generating static params for allotment:", error);
        return [];
    }
}

export default async function IPOAllotment({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch server-side data for Allotment page
    // We already have fetchIPODetail in api.ts
    // Use it to get the data
    let startData = null;
    try {
        const res = await fetchIPODetail(slug);
        if (res && res.data) {
            startData = res.data;
        }
    } catch (e) {
        // Fallback or handle error (notFound() is already used if critical, but here maybe just let client try or 404)
    }

    if (!startData) return notFound();

    return <IPOAllotmentCheckerPage initialData={startData} />;
}
