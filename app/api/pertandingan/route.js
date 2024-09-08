import prisma from "@/app/backend/helpers/prisma";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const resp = await prisma.pertandingan.findMany({
            where: {
                tarikh: {
                    gte: moment().startOf('day'),
                },
                is_deleted: false,
            },
            distinct: ['tarikh']
        })
        return NextResponse.json({ data: resp });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function PATCH(req) {
    try {
        const { id, jenis } = await req.json();
        await prisma.pertandingan.update({
            where: {
                id,
                is_deleted: false
            },
            data: {
                jenis
            }
        })
        return NextResponse.json({ message: 'Updated successfully!' })
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}