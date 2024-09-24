import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import prisma from "@/app/backend/helpers/prisma";
import moment from "moment";

export async function POST(req) {
    try {
        const body = await req.json();

        const token = body?.token;

        const decryptedData = CryptoJS.AES.decrypt(token, process.env.QR_SECRET_KEY).toString(CryptoJS.enc.Utf8);
        const jsonData = JSON.parse(decryptedData);

        const bookingInfo = await prisma.kolam_booking.findFirst({
            where: {
                is_deleted: false,
                is_checked_in: false,
                id: Number(jsonData?.bookingId),
                payment_status: 'PAID',
            },
            select: {
                'id': true,
                'user': {
                    select: {
                        'nama_pertama': true,
                        'nama_akhir': true,
                    }
                },
                'manual_booking': {
                    'select': {
                        'nama_penuh': true,
                        'email': true,
                        'telefon': true,
                    }
                },
                'is_manual': true,
                'kolam_booking_kolams': {
                    'select': {
                        'kolam_booking_pancang': {
                            'select': {
                                'value': true,
                            }
                        },
                        'kolam': {
                            select: {
                                'id': true,
                                'label': true,
                            }
                        }
                    },
                    where: {
                        'is_deleted': false,
                    }
                },
                'tarikh': true,
                'add_ons': true,
            }
        })
        if (!bookingInfo || !bookingInfo?.id) {
            return NextResponse.json({ error: 'Booking tidak wujud' }, { status: 500 })
        } else if (moment(bookingInfo?.tarikh).startOf('day').isBefore(moment().startOf('day'))) {
            return NextResponse.json({ error: `Booking sudah terlepas! Tarikh booking - ${moment(bookingInfo?.tarikh).format('Do MMM YYYY')}` }, { status: 500 })
        }
        if (bookingInfo && bookingInfo?.id) {
            const updatedBooking = await prisma.kolam_booking.update({
                where: {
                    is_deleted: false,
                    id: Number(jsonData?.bookingId),
                    payment_status: 'PAID',
                },
                data: {
                    check_in_on: new Date(),
                    is_checked_in: true,
                },
                select: {
                    'id': true,
                    'user': {
                        select: {
                            'nama_pertama': true,
                            'nama_akhir': true,
                        }
                    },
                    'tarikh': true,
                    'add_ons': true,
                    'is_manual': true,
                    'manual_booking': {
                        'select': {
                            'nama_penuh': true,
                            'email': true,
                            'telefon': true,
                        }
                    },
                    'kolam_booking_kolams': {
                        'select': {
                            'kolam_booking_pancang': {
                                'select': {
                                    'value': true,
                                }
                            },
                            'kolam': {
                                select: {
                                    'id': true,
                                    'label': true,
                                }
                            }
                        },
                        where: {
                            'is_deleted': false,
                        },
                    },
                },
            });
            if (updatedBooking?.id) {
                return NextResponse.json({ data: updatedBooking })
            }
        }
        // check if date is past or not
        return NextResponse.json({ message: 'Successful' })
    } catch (e) {
        return NextResponse.json({ error: 'Invalid QR code' }, { status: 500 })
    }

}