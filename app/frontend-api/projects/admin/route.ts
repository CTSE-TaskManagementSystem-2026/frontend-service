import { NextRequest, NextResponse } from 'next/server';

// Server-side only — safe to use in ECS Task Definition env vars & .env.local
// Never exposed to the browser (no NEXT_PUBLIC_ prefix needed)
const PROJECTS_SERVICE_URL =
    process.env.PROJECTS_SERVICE_URL ?? 'http://localhost:3002/api/projects';

// ── GET /frontend-api/projects/admin  →  GET projects-service/ ─────────────
// Fetches all projects (admin view — all users' projects)
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization') ?? '';

        const upstream = await fetch(PROJECTS_SERVICE_URL, {
            method: 'GET',
            headers: { Authorization: authHeader },
        });

        const data = await upstream.json();
        return NextResponse.json(data, { status: upstream.status });
    } catch (err) {
        console.error('[frontend-api/projects/admin] GET upstream error:', err);
        return NextResponse.json(
            { message: 'Projects service unavailable. Please try again later.' },
            { status: 502 }
        );
    }
}

// ── DELETE /frontend-api/projects/admin?id=<projectId>  →  DELETE projects-service/?id=<projectId>
// Deletes a project by ID passed as a query param
export async function DELETE(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization') ?? '';
        const id = req.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'id query param is required.' }, { status: 400 });
        }

        const upstream = await fetch(`${PROJECTS_SERVICE_URL}?id=${encodeURIComponent(id)}`, {
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
        console.error('[frontend-api/projects/admin] DELETE upstream error:', err);
        return NextResponse.json(
            { message: 'Projects service unavailable. Please try again later.' },
            { status: 502 }
        );
    }
}
