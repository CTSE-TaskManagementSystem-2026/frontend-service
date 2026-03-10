import { NextRequest, NextResponse } from 'next/server';

// Server-side only — safe to use in ECS Task Definition env vars & .env.local
// Never exposed to the browser (no NEXT_PUBLIC_ prefix needed)
const AUTH_SERVICE_URL = 'http://auth-service.internal.local:3000/api/auth';

// ── GET /frontend-api/auth/admin  →  GET auth-service/users ────────────────
// Fetches the full list of users (admin only)
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization') ?? '';

        const upstream = await fetch(`${AUTH_SERVICE_URL}/users`, {
            method: 'GET',
            headers: { Authorization: authHeader },
        });

        const data = await upstream.json();
        return NextResponse.json(data, { status: upstream.status });
    } catch (err) {
        console.error('[frontend-api/auth/admin] GET upstream error:', err);
        return NextResponse.json(
            { message: 'Auth service unavailable. Please try again later.' },
            { status: 502 }
        );
    }
}

// ── PUT /frontend-api/auth/admin  →  PUT auth-service/users ────────────────
// Toggles a user's role. Body: { userId, role }
export async function PUT(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization') ?? '';
        const body = await req.json();

        const upstream = await fetch(`${AUTH_SERVICE_URL}/users`, {
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
        console.error('[frontend-api/auth/admin] PUT upstream error:', err);
        return NextResponse.json(
            { message: 'Auth service unavailable. Please try again later.' },
            { status: 502 }
        );
    }
}

// ── DELETE /frontend-api/auth/admin?userId=<id>  →  DELETE auth-service/users/:id
// Deletes a user by ID passed as a query param
export async function DELETE(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization') ?? '';
        const userId = req.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'userId query param is required.' }, { status: 400 });
        }

        const upstream = await fetch(`${AUTH_SERVICE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: { Authorization: authHeader },
        });

        // 204 No Content — no body to parse
        if (upstream.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const data = await upstream.json();
        return NextResponse.json(data, { status: upstream.status });
    } catch (err) {
        console.error('[frontend-api/auth/admin] DELETE upstream error:', err);
        return NextResponse.json(
            { message: 'Auth service unavailable. Please try again later.' },
            { status: 502 }
        );
    }
}
