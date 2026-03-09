// app/api/projects/admin/route.ts
// Admin-only proxy to projects-service.
// ALL methods forward the Authorization header (must be an admin JWT).
// The projects-service itself enforces the admin role check, so
// any non-admin token will receive a 403 from the upstream service.

import { NextRequest, NextResponse } from 'next/server';

const PROJECTS_SERVICE_BASE = process.env.PROJECTS_SERVICE_URL ?? 'http://localhost:3002/api/projects';

function authHeader(req: NextRequest) {
    return req.headers.get('authorization') ?? '';
}

function missingAuth() {
    return NextResponse.json({ message: 'Authorization token required' }, { status: 401 });
}

// ── GET /api/projects/admin  ──────────────────────────────────────────────────
// Returns ALL projects (admin sees everything).
// Optional ?userId= to filter by a specific owner (admin feature).
export async function GET(req: NextRequest) {
    const auth = authHeader(req);
    if (!auth.startsWith('Bearer ')) return missingAuth();

    try {
        // Forward optional userId query param
        const userId = req.nextUrl.searchParams.get('userId');
        const url = userId
            ? `${PROJECTS_SERVICE_BASE}?userId=${encodeURIComponent(userId)}`
            : PROJECTS_SERVICE_BASE;

        const res = await fetch(url, {
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
        console.error('[admin/projects] GET error:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ── POST /api/projects/admin  ─────────────────────────────────────────────────
// Create a project on behalf of any user (admin JWT required).
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
        console.error('[admin/projects] POST error:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ── PUT /api/projects/admin?id=…  ─────────────────────────────────────────────
// Admin can update any project (ownership check is bypassed for admins server-side).
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
        console.error('[admin/projects] PUT error:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ── DELETE /api/projects/admin?id=…  ──────────────────────────────────────────
// Admin can delete any project.
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
        console.error('[admin/projects] DELETE error:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
