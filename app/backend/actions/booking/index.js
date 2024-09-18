'use server';

import { Prisma } from "@prisma/client";
import prisma from "../../helpers/prisma";
import moment from "moment";

export const createManualBooking = async (kolamId, tarikh, calculatedObj, namaPenuh, email, telefon, isDeposit, depositAmount, voucher) => {
    try {
        const booking = await prisma.$transaction(async txn => {

            let amount = calculatedObj?.totalDiscounted;
            let pancang = calculatedObj?.products?.filter(e => e?.name == 'PANCANG')?.map(e => e?.label);
            let addOns = calculatedObj?.products?.filter(e => e?.type == 'ADD_ONS' && e?.quantity);

            const bookingAvailabilityLock = await txn.$executeRaw`
                SELECT * from booking_availability AS ba
                JOIN pancang AS p
                    ON ba.pancang_id = p.id
                WHERE p.value in (${Prisma.join(pancang)})
                    and ba.kolam_id = ${kolamId}
                    and ba.tarikh = ${Prisma.sql`${new Date(tarikh)}`}::date
                    and ba.is_available = true
                FOR UPDATE`;

            if (bookingAvailabilityLock == pancang?.length) {
                const voucherData = await txn.vouchers.findFirst({
                    where: {
                        code: voucher
                    },
                    select: {
                        'id': true,
                    }
                });

                await txn.kolam_booking.create({
                    data: {
                        payment_status: isDeposit ? 'PENDING_PAYMENT' : 'PAID',
                        kolam_id: Number(kolamId),
                        amount,
                        is_manual: true,
                        tarikh: new Date(tarikh).toISOString(),
                        add_ons: {
                            create: addOns.map(e => ({
                                type: e?.name,
                                quantity: e?.quantity
                            }))
                        },
                        is_deposit: isDeposit,
                        deposit_amount: isDeposit ? Number(depositAmount) : null,
                        pancangs: {
                            createMany: {
                                data: pancang.map(e => ({
                                    nombor: e
                                }))
                            }
                        },
                        manual_booking: {
                            create: {
                                nama_penuh: namaPenuh,
                                email: email || null,
                                telefon: telefon
                            }
                        },
                        voucher_id: Number(voucherData?.id)
                    }
                })
                const resp = await txn.booking_availability.updateMany({
                    where: {
                        pancang: {
                            value: {
                                in: pancang.map(e => e),
                            }
                        },
                        kolam_id: Number(kolamId),
                        tarikh: new Date(tarikh).toISOString()
                    },
                    data: {
                        is_available: false
                    }
                })
                return resp;
            } else {
                throw new Error('Maaf, pancang sudah diambil oleh pengguna lain.')
            }
        })
        return booking;

    } catch (e) {
        throw e;
    }

}

export const getAllBookingsByPertandinganDate = async (date) => {
    return JSON.stringify(await prisma.kolam_booking.findMany({
        where: {
            tarikh: moment(date).toISOString(),
        },
        select: {
            'amount': true,
            'payment_status': true,
            'tarikh': true,
            'deposit_amount': true,
            'is_manual': true,
            'kolam_id': true,
            'created_on': true,
            'is_deposit': true,
            'manual_booking': {
                select: {
                    'nama_penuh': true,
                    'email': true,
                    'telefon': true,
                }
            },
            'created_on': true,
            'pancangs': {
                select: {
                    'nombor': true,
                }
            },
        },
        orderBy: {
            created_on: 'asc'
        }
    }))
}