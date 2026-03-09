import { NextRequest, NextResponse } from 'next/server';

const TASK_SERVICE_BASE = process.env.TASK_SERVICE_URL ?? 'http://localhost:3003/api/tasks';

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization') ?? '';
    const projectId = req.nextUrl.searchParams.get('projectId');

    const url = new URL(TASK_SERVICE_BASE);
    if (projectId) url.searchParams.set('projectId', projectId);

    try {
        const res = await fetch(url.toString(), { headers: { Authorization: token } });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to reach task-service', details: String(err) }, { status: 502 });
    }
}

export async function POST(req: NextRequest) {
    const token = req.headers.get('authorization') ?? '';
    const body = await req.json().catch(() => ({}));

    try {
        const res = await fetch(TASK_SERVICE_BASE, {
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

export async function PATCH(req: NextRequest) {
    const token = req.headers.get('authorization') ?? '';
    const id = req.nextUrl.searchParams.get('id');
    const body = await req.json().catch(() => ({}));

    if (!id) return NextResponse.json({ error: '`id` query param required' }, { status: 400 });

    try {
        const res = await fetch(`${TASK_SERVICE_BASE}?id=${id}`, {   // ← fixed
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

export async function DELETE(req: NextRequest) {
    const token = req.headers.get('authorization') ?? '';
    const id = req.nextUrl.searchParams.get('id');

    if (!id) return NextResponse.json({ error: '`id` query param required' }, { status: 400 });

    try {
        const res = await fetch(`${TASK_SERVICE_BASE}?id=${id}`, {
            method: 'DELETE',
            headers: { Authorization: token },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to reach task-service', details: String(err) }, { status: 502 });
    }
}