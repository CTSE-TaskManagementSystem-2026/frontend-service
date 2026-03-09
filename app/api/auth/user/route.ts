import { NextRequest, NextResponse } from 'next/server';

const AUTH_SERVICE_BASE = 'http://auth-service.internal.local/api/auth';

// ──────────────────────────────────────────────
// GET /api/auth/user
// Get all users  →  GET http://auth-service.internal.local/api/auth/users
// ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Authorization token required' }, { status: 401 });
        }

        const response = await fetch(`${AUTH_SERVICE_BASE}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ message: data.message || 'Failed to fetch users' }, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        console.error('Get users proxy error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ──────────────────────────────────────────────
// POST /api/auth/user
// Create a new user (admin only)  →  POST http://auth-service.internal.local/api/auth/admin/create
// ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Authorization token required' }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Please provide name, email, and password' }, { status: 400 });
        }

        const response = await fetch(`${AUTH_SERVICE_BASE}/admin/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader,
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ message: data.message || 'Failed to create user' }, { status: response.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error: unknown) {
        console.error('Create user proxy error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ──────────────────────────────────────────────
// PUT /api/auth/user
// Update user role  →  PUT http://auth-service.internal.local/api/auth/users
// Body: { userId, role }
// ──────────────────────────────────────────────
export async function PUT(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Authorization token required' }, { status: 401 });
        }

        const body = await request.json();
        const { userId, role } = body;

        if (!userId || !role) {
            return NextResponse.json({ message: 'userId and role are required' }, { status: 400 });
        }

        const response = await fetch(`${AUTH_SERVICE_BASE}/users`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader,
            },
            body: JSON.stringify({ userId, role }),
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ message: data.message || 'Failed to update user' }, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        console.error('Update user proxy error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ──────────────────────────────────────────────
// DELETE /api/auth/user?userId=<id>
// Delete user by ID  →  DELETE http://auth-service.internal.local/api/auth/users/:userId
// ──────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Authorization token required' }, { status: 401 });
        }

        const userId = request.nextUrl.searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({ message: 'userId query parameter is required' }, { status: 400 });
        }

        const response = await fetch(`${AUTH_SERVICE_BASE}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ message: data.message || 'Failed to delete user' }, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        console.error('Delete user proxy error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
