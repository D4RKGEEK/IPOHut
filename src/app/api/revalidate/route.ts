import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
    const token = request.headers.get("x-revalidation-token");

    // Use a secret token (should be in env vars, but hardcoded for now as requested/simple)
    // In production, use process.env.REVALIDATION_SECRET
    const secret = process.env.REVALIDATION_SECRET || "ipohut-revalidation-token-secure";

    if (token !== secret) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    try {
        const { path, type } = await request.json();

        if (path) {
            if (type === 'page' || type === 'layout') {
                revalidatePath(path, type);
            } else {
                revalidatePath(path);
            }
            return NextResponse.json({ revalidated: true, path, now: Date.now() });
        }

        return NextResponse.json({ message: "Missing path param" }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
    }
}
