import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const cookieStore = await cookies();
    cookieStore.delete('token');

    const url = new URL(request.url);
    const origin = url.origin;

    return NextResponse.redirect(new URL('/login', origin));
}

export async function POST(request: Request) {
    return GET(request);
}
