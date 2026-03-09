import { NextRequest, NextResponse } from 'next/server';

const TASK_SERVICE_BASE = process.env.TASK_SERVICE_URL ?? 'http://localhost:3003/api/tasks';

/**
 * User proxy: forward task requests to task-lifecycle-service with user's JWT.
 * Task-service scopes results to createdBy = userId extracted from JWT.
 */

// GET /api/tasks/user  — get user's own tasks
// GET /api/tasks/user?projectId=<id>  — filter by project
export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization') ?? '';
    const { searchParams } = req.nextUrl;
    const projectId = searchParams.get('projectId');

    const url = new URL(`${TASK_SERVICE_BASE}/api/tasks`);
    if (projectId) url.searchParams.set('projectId', projectId);

    try {
        const res = await fetch(url.toString(), {
            headers: { Authorization: token },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to reach task-service', details: String(err) }, { status: 502 });
    }
}

// POST /api/tasks/user  — create a task (createdBy set from JWT in task-service)
export async function POST(req: NextRequest) {
    const token = req.headers.get('authorization') ?? '';
    const body = await req.json().catch(() => ({}));

    try {
        const res = await fetch(`${TASK_SERVICE_BASE}/api/tasks`, {
            method: 'POST',
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to reach task-service', details: String(err) }, { status: 502 });
    }
}

// PATCH /api/tasks/user?id=<id>  — update own task
export async function PATCH(req: NextRequest) {
    const token = req.headers.get('authorization') ?? '';
    const id = req.nextUrl.searchParams.get('id');
    const body = await req.json().catch(() => ({}));

    if (!id) return NextResponse.json({ error: '`id` query param required' }, { status: 400 });

    try {
        const res = await fetch(`${TASK_SERVICE_BASE}/api/tasks?id=${id}`, {
            method: 'PATCH',
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to reach task-service', details: String(err) }, { status: 502 });
    }
}

// DELETE /api/tasks/user?id=<id>  — delete own task
export async function DELETE(req: NextRequest) {
    const token = req.headers.get('authorization') ?? '';
    const id = req.nextUrl.searchParams.get('id');

    if (!id) return NextResponse.json({ error: '`id` query param required' }, { status: 400 });

    try {
        const res = await fetch(`${TASK_SERVICE_BASE}/api/tasks?id=${id}`, {
            method: 'DELETE',
            headers: { Authorization: token },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to reach task-service', details: String(err) }, { status: 502 });
    }
}
