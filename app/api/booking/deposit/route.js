import prisma from "@/app/backend/helpers/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    const { newDepositAmount, id } = await req.json();


    const booking = await prisma.kolam_booking.findFirst({
        where: {
            id: id ? Number(id) : null,
            is_deleted: false,
        },
        select: {
            'deposit_amount': true,
            'amount': true,
        }
    })
    const update = await prisma.kolam_booking.update({
        where: {
            id: id ? Number(id) : null,
            is_deleted: false,
        },
        data: {
            deposit_amount: Number(newDepositAmount) + Number(booking?.deposit_amount),
            payment_status: Number(newDepositAmount) + Number(booking?.deposit_amount) == booking?.amount ? 'PAID' : 'PENDING_PAYMENT'
        }
    })
    return NextResponse.json({ data: 'Successfully updated' })
}