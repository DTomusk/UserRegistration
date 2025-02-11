import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // calls fastapi backend endpoint to generate a token 
        const res = await fetch('http://127.0.0.1:8000/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: email,
                password,
            })
        });

        if (!res.ok) {
            return NextResponse.json('Invalid credentials', { status: 401 });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}