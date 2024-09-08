import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    cookies().delete('token', {
        path: '/admin'
    })
    return NextResponse.json({ message: 'Successful' });
}