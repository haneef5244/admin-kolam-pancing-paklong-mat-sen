import prisma from "@/app/backend/helpers/prisma";
import moment from "moment";
import { NextResponse } from "next/server";

export async function POST(req) {
    const body = await req.json();

    const { bookingId = undefined, paymentStatus = [], kolam = [], tarikh = undefined, namaPengguna, email, telefon } = body;

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
    if (namaPengguna) {
        let splitNama = namaPengguna.split(' ');
        let splitNamaOr = []
        for (let name of splitNama) {
            splitNamaOr.push({
                user: {
                    nama_pertama: {
                        contains: name.trim(),
                        mode: 'insensitive'
                    }
                }
            })
            splitNamaOr.push({
                user: {
                    nama_akhir: {
                        contains: name.trim(),
                        mode: 'insensitive'
                    }
                }
            })
        }
        filterWhere = {
            ...filterWhere,
            AND: {
                OR: [
                    {
                        manual_booking: {
                            'nama_penuh': {
                                contains: namaPengguna.toLowerCase(),
                                mode: 'insensitive'
                            }
                        }
                    },
                    ...splitNamaOr
                ]
            }

        }
    }
    if (email) {
        filterWhere = {
            ...filterWhere,
            AND: {
                OR: [
                    {
                        manual_booking: {
                            'email': {
                                contains: email.toLowerCase(),
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        user: {
                            'email': {
                                contains: email.toLowerCase(),
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            }

        }
    }
    if (telefon) {
        filterWhere = {
            ...filterWhere,
            AND: {
                OR: [
                    {
                        manual_booking: {
                            'telefon': {
                                contains: telefon.toLowerCase(),
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        user: {
                            'telefon': {
                                contains: telefon.toLowerCase(),
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
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
                    'id': true,
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
            'is_manual': true,
            'voucher': true,
            'manual_booking': {
                select: {
                    'nama_penuh': true,
                    'email': true,
                    'telefon': true
                }
            },
            'is_deposit': true,
            'deposit_amount': true,
            'manual_receipts': true,
        },
        orderBy: {
            'id': 'desc'
        }
    })

    return NextResponse.json({ data: resp });
}