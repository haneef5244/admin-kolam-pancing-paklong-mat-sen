import { uploadBase64ImageToBlob } from "@/app/backend/helpers/blob";
import prisma from "@/app/backend/helpers/prisma";
import moment from "moment";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const file = body.file;

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const base64Image = buffer.toString('base64');

            const fileName = `${new Date().toISOString()}-${file?.name}`
            const resp = await uploadBase64ImageToBlob(fileName, 'posters', base64Image, process.env.AZURE_STORAGE_PUBLIC_CONNECTION_STRING, file?.type);

            await prisma.pertandingan.update({
                where: {
                    id: body.id ? Number(body?.id) : null,
                },
                data: {
                    poster_url: fileName
                }
            })
        } else {
            await prisma.pertandingan.update({
                where: {
                    id: body.id ? Number(body?.id) : null,
                },
                data: {
                    poster_url: null
                }
            })
        }
        return NextResponse.json({ message: 'Successfully updated!' });
    }
    catch (e) {
        return NextResponse.json({ error: e?.message }, { status: 500 })
    }
}