import { NextRequest, NextResponse } from 'next/server';

// Server-side only — safe to use in ECS Task Definition env vars & .env.local
// Never exposed to the browser (no NEXT_PUBLIC_ prefix needed)
const AUTH_SERVICE_URL =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001/api/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const upstream = await fetch(`${AUTH_SERVICE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await upstream.json();

        return NextResponse.json(data, { status: upstream.status });
    } catch (err) {
        console.error('[frontend-api/auth/login] upstream error:', err);
        return NextResponse.json(
            { message: 'Auth service unavailable. Please try again later.' },
            { status: 502 }
        );
    }
}
