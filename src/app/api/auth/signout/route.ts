import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    cookieStore.delete('token');

    return NextResponse.redirect(new URL('/login', 'http://localhost:3000')); // In prod use env var or request.url based construction
}

export async function POST() {
    return GET();
}
