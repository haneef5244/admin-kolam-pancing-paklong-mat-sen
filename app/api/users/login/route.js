import prisma from "@/app/backend/helpers/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export async function POST(req) {
    const { username, password } = await req.json();

    const user = await prisma.admin.findFirst({
        where: {
            username: username || null
        },
        select: {
            'id': true,
            'username': true,
            'password': true,
            'email': true,
            'nama_pertama': true,
            'nama_akhir': true,
        }
    });

    if (user?.username && bcrypt.compare(password, user?.password)) {
        const token = jwt.sign({
            id: user?.id,
            username,
            email: user?.email,
            firstName: user?.nama_pertama,
            lastName: user?.nama_akhir,
            telefon: user?.telefon
        },
            process.env.TOKEN_KEY,
            {
                expiresIn: '48h'
            });
        cookies().set('token', token, {
        })
        return NextResponse.json({ message: 'Successful' });
    } else {
        return NextResponse.json({ error: 'Invalid username or password.' }, { status: 500 });
    }

}