import { NextResponse } from 'next/server';
import { getAdminSettings, saveAdminSettings } from '@/lib/server-config';
import { AdminSettings } from '@/types/admin';

export async function GET() {
    try {
        const settings = getAdminSettings();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const settings = body as AdminSettings;

        // Add validation if needed, for now trusting the types effectively
        const success = saveAdminSettings(settings); // Synchronous write

        if (success) {
            return NextResponse.json({ success: true, settings });
        } else {
            return NextResponse.json(
                { error: 'Failed to save settings' },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}
