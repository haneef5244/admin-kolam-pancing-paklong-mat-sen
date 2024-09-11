import prisma from "@/app/backend/helpers/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {

    const { bookingId } = await req.json();

    const bookings = await prisma.kolam_booking.findFirst({
        where: {
            id: Number(bookingId),
            payment_status: 'PAID',
        },
        select: {
            'id': true,
            'amount': true,
            'pancangs': {
                select: {
                    'nombor': true,
                }
            },
            'kolam_id': true,
            'add_ons': {
                select: {
                    'quantity': true,
                    'type': true,
                }
            },
            'tarikh': true,
            'manual_booking': {
                select: {
                    'nama_penuh': true,
                    'email': true,
                    'telefon': true,
                }
            },
            'is_manual': true,
            'user': {
                select: {
                    'nama_pertama': true,
                    'nama_akhir': true,
                    'email': true,
                    'telefon': true,
                }
            },
            'payment': {
                select: {
                    'transaction_time': true,
                }
            },
            'created_on': true,
        }
    })

    return NextResponse.json({ data: bookings })
}