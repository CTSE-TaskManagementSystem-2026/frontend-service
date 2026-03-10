import { NextRequest, NextResponse } from 'next/server';

// Server-side only — safe to use in ECS Task Definition env vars & .env.local
// Never exposed to the browser (no NEXT_PUBLIC_ prefix needed)
const AUTH_SERVICE_URL =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001/api/auth';

// ── GET /frontend-api/auth/users  →  GET auth-service/profile ──────────────
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization') ?? '';

        const upstream = await fetch(`${AUTH_SERVICE_URL}/profile`, {
            method: 'GET',
            headers: { Authorization: authHeader },
        });

        const data = await upstream.json();
        return NextResponse.json(data, { status: upstream.status });
    } catch (err) {
        console.error('[frontend-api/auth/users] GET upstream error:', err);
        return NextResponse.json(
            { message: 'Auth service unavailable. Please try again later.' },
            { status: 502 }
        );
    }
}

// ── PUT /frontend-api/auth/users  →  PUT auth-service/profile ──────────────
// Handles both profile info update (name, email, bio)
// and password change (currentPassword, newPassword)
export async function PUT(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization') ?? '';
        const body = await req.json();

        const upstream = await fetch(`${AUTH_SERVICE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader,
            },
            body: JSON.stringify(body),
        });

        const data = await upstream.json();
        return NextResponse.json(data, { status: upstream.status });
    } catch (err) {
        console.error('[frontend-api/auth/users] PUT upstream error:', err);
        return NextResponse.json(
            { message: 'Auth service unavailable. Please try again later.' },
            { status: 502 }
        );
    }
}
