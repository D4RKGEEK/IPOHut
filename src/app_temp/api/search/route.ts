import { NextResponse } from 'next/server';
import { fetchIPOMetadata } from '@/lib/api';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    try {
        const response = await fetchIPOMetadata();

        if (!response.data) {
            return NextResponse.json({ success: false, data: [] });
        }

        // Return the metadata for client-side search
        return NextResponse.json({
            success: true,
            data: response.data.map(ipo => ({
                slug: ipo.slug,
                name: ipo.name,
            }))
        });
    } catch (error) {
        console.error('Error fetching search data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch IPO data' },
            { status: 500 }
        );
    }
}
