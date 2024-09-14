import { deleteBlob, getBlobSasUrl, uploadBase64ImageToBlob, uploadBufferToBlob } from "@/app/backend/helpers/blob";
import prisma from "@/app/backend/helpers/prisma";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET(req) {
    const fileName = decodeURIComponent(req.nextUrl.searchParams.get('fileName'));

    const sasUrl = getBlobSasUrl(fileName, 'manual-receipts', moment().utc().add(5, 'minutes'))
    return NextResponse.json({ url: sasUrl });
}

export async function PATCH(req) {
    const { fileName, id } = await req.json();

    let decodedFileName = decodeURIComponent(fileName);
    await deleteBlob(process.env.AZURE_STORAGE_CONNECTION_STRING, 'manual-receipts', decodedFileName);
    const data = await prisma.kolam_booking_manual_receipts.findFirst({
        where: {
            kolam_booking_id: id ? Number(id) : null,
            receipt: decodedFileName,
        }
    })
    await prisma.kolam_booking_manual_receipts.delete({
        where: {
            id: data?.id ? Number(data?.id) : null
        }
    })
    return NextResponse.json({ message: 'Successful' });
}


export async function POST(req) {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const files = body.files;
    const filesCount = body.filesCount;
    const id = body?.id;

    let blobs = []
    for (let i = 1; i <= Number(filesCount); i++) {
        let file = body[`file${i}`];
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${new Date().toISOString()}-${file?.name}`;
        await uploadBufferToBlob(fileName, 'manual-receipts', buffer, process.env.AZURE_STORAGE_CONNECTION_STRING, file?.type)
        blobs.push(fileName);
    }

    const resp = await prisma.kolam_booking.update({
        where: {
            id: id ? Number(id) : null,
        },
        data: {
            manual_receipts: {
                createMany: {
                    data: blobs.map(e => ({
                        receipt: e
                    }))
                }
            }
        }
    })
    return NextResponse.json({ data: 'Successfully uploaded data!' })
}