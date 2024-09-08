import prisma from "@/app/backend/helpers/prisma";
import moment from "moment";
import { NextResponse } from "next/server";

export async function POST(req) {
    const body = await req.json();

    const { bookingId = undefined, paymentStatus = [], kolam = [], tarikh = undefined } = body;

    let filterWhere = {}

    if (bookingId) {
        filterWhere = {
            ...filterWhere,
            'id': Number(bookingId)
        }
    }
    if (paymentStatus?.length) {
        filterWhere = {
            ...filterWhere,
            payment_status: {
                in: paymentStatus
            }
        }
    }
    if (kolam?.length) {
        filterWhere = {
            ...filterWhere,
            kolam_id: {
                in: kolam
            }
        }
    }
    if (tarikh) {
        const tarik = new Date(tarikh)
        const endOfTarik = moment(tarikh).endOf('day').toDate()
        filterWhere = {
            ...filterWhere,
            tarikh: {
                gte: tarik,
                lte: endOfTarik
            }
        }
    }
    const resp = await prisma.kolam_booking.findMany({
        where: {
            ...filterWhere
        },
        select: {
            'id': true,
            'kolam_id': true,
            'pancangs': true,
            'add_ons': true,
            'amount': true,
            'user_id': true,
            'pancangs': {
                select: {
                    'nombor': true,
                }
            },
            'user': {
                select: {
                    'nama_pertama': true,
                    'nama_akhir': true,
                    'email': true,
                    'telefon': true,
                }
            },
            'payment_status': true,
            'is_deleted': true,
            'is_checked_in': true,
            'check_in_on': true,
            'qr_link_file_name': true,
            'tarikh': true,
            'created_on': true,
        }
    })

    return NextResponse.json({ data: resp });
}