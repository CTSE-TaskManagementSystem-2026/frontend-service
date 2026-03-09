// app/api/projects/user/route.ts
// User-scoped proxy to projects-service.
// The JWT is forwarded as-is; projects-service extracts the userId and role,
// then returns only the projects that belong to that user.
// Admins who hit this endpoint will still see only their own projects —
// use /api/projects/admin for the admin "all projects" view.

import { NextRequest, NextResponse } from 'next/server';

const PROJECTS_SERVICE_BASE = process.env.PROJECTS_SERVICE_URL ?? 'http://localhost:3002/api/projects';

function authHeader(req: NextRequest) {
    return req.headers.get('authorization') ?? '';
}

function missingAuth() {
    return NextResponse.json({ message: 'Authorization token required' }, { status: 401 });
}

// ── GET /api/projects/user  ───────────────────────────────────────────────────
// Returns the projects owned by the authenticated user.
export async function GET(req: NextRequest) {
    const auth = authHeader(req);
    if (!auth.startsWith('Bearer ')) return missingAuth();

    try {
        const res = await fetch(PROJECTS_SERVICE_BASE, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: auth },
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json(
                { message: data.error || 'Failed to fetch projects' },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error('[user/projects] GET error:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ── POST /api/projects/user  ──────────────────────────────────────────────────
// Create a new project; createdBy is stamped server-side from the JWT.
export async function POST(req: NextRequest) {
    const auth = authHeader(req);
    if (!auth.startsWith('Bearer ')) return missingAuth();

    try {
        const body = await req.json();

        const res = await fetch(PROJECTS_SERVICE_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: auth },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json(
                { message: data.error || 'Failed to create project' },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        console.error('[user/projects] POST error:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ── PUT /api/projects/user?id=…  ──────────────────────────────────────────────
// Update a project. projects-service returns 403 if the user doesn't own it.
export async function PUT(req: NextRequest) {
    const auth = authHeader(req);
    if (!auth.startsWith('Bearer ')) return missingAuth();

    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: '`id` query param is required' }, { status: 400 });
        }

        const body = await req.json();

        const res = await fetch(`${PROJECTS_SERVICE_BASE}?id=${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: auth },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json(
                { message: data.error || 'Failed to update project' },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error('[user/projects] PUT error:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ── DELETE /api/projects/user?id=…  ───────────────────────────────────────────
// Delete a project. projects-service returns 403 if the user doesn't own it.
export async function DELETE(req: NextRequest) {
    const auth = authHeader(req);
    if (!auth.startsWith('Bearer ')) return missingAuth();

    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: '`id` query param is required' }, { status: 400 });
        }

        const res = await fetch(`${PROJECTS_SERVICE_BASE}?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', Authorization: auth },
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json(
                { message: data.error || 'Failed to delete project' },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error('[user/projects] DELETE error:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
