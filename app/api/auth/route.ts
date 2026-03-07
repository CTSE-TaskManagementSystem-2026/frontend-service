import { NextRequest, NextResponse } from 'next/server';

const AUTH_SERVICE_BASE = 'http://auth-service.internal.local/api/auth';

// ──────────────────────────────────────────────
// POST /api/auth
// Body: { action: 'register' | 'login', ...fields }
// ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...payload } = body;

        if (action === 'register') {
            return await handleRegister(payload);
        }

        if (action === 'login') {
            return await handleLogin(payload);
        }

        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Auth proxy error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ──────────────────────────────────────────────
// Register  →  POST http://auth-service.internal.local/api/auth/register
// ──────────────────────────────────────────────
async function handleRegister(payload: Record<string, string>) {
    const { name, email, password } = payload;

    if (!name || !email || !password) {
        return NextResponse.json(
            { message: 'Please provide name, email, and password' },
            { status: 400 }
        );
    }

    const response = await fetch(`${AUTH_SERVICE_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json(
            { message: data.message || 'Registration failed' },
            { status: response.status }
        );
    }

    return NextResponse.json(data, { status: 201 });
}

// ──────────────────────────────────────────────
// Login  →  POST http://auth-service.internal.local/api/auth/login
// ──────────────────────────────────────────────
async function handleLogin(payload: Record<string, string>) {
    const { email, password } = payload;

    if (!email || !password) {
        return NextResponse.json(
            { message: 'Please provide email and password' },
            { status: 400 }
        );
    }

    const response = await fetch(`${AUTH_SERVICE_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json(
            { message: data.message || 'Login failed' },
            { status: response.status }
        );
    }

    // data contains: { message, token, role, name, email }
    return NextResponse.json(data, { status: 200 });
}
