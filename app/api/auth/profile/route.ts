import { NextRequest, NextResponse } from 'next/server';

const AUTH_SERVICE_BASE = 'http://auth-service.internal.local/api/auth';

// ──────────────────────────────────────────────
// GET /api/auth/profile
// Forwards Authorization header to auth-service and returns the user profile.
// ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'No token provided' }, { status: 401 });
        }

        const response = await fetch(`${AUTH_SERVICE_BASE}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Failed to fetch profile' },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error('Profile proxy GET error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ──────────────────────────────────────────────
// PUT /api/auth/profile
// Proxies profile update (name, email, password change) to auth-service.
// ──────────────────────────────────────────────
export async function PUT(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'No token provided' }, { status: 401 });
        }

        const body = await request.json();

        const response = await fetch(`${AUTH_SERVICE_BASE}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Failed to update profile' },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error('Profile proxy PUT error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
