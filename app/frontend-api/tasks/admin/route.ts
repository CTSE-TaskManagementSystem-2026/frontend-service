import { NextRequest, NextResponse } from 'next/server';

// Server-side only — safe to use in ECS Task Definition env vars & .env.local
// Never exposed to the browser (no NEXT_PUBLIC_ prefix needed)
const TASKS_SERVICE_URL =
    process.env.TASKS_SERVICE_URL ?? 'http://localhost:3003/api/tasks';

// ── GET /frontend-api/tasks/admin  →  GET tasks-service/ ───────────────────
// Fetches all tasks (admin view — all users' tasks)
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization') ?? '';

        const upstream = await fetch(TASKS_SERVICE_URL, {
            method: 'GET',
            headers: { Authorization: authHeader },
        });

        const data = await upstream.json();
        return NextResponse.json(data, { status: upstream.status });
    } catch (err) {
        console.error('[frontend-api/tasks/admin] GET upstream error:', err);
        return NextResponse.json(
            { message: 'Tasks service unavailable. Please try again later.' },
            { status: 502 }
        );
    }
}

// ── DELETE /frontend-api/tasks/admin?id=<taskId>  →  DELETE tasks-service/?id=<taskId>
// Deletes a task by ID passed as a query param
export async function DELETE(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization') ?? '';
        const id = req.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'id query param is required.' }, { status: 400 });
        }

        const upstream = await fetch(`${TASKS_SERVICE_URL}?id=${encodeURIComponent(id)}`, {
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
        console.error('[frontend-api/tasks/admin] DELETE upstream error:', err);
        return NextResponse.json(
            { message: 'Tasks service unavailable. Please try again later.' },
            { status: 502 }
        );
    }
}
