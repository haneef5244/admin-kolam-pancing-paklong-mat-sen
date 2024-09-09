'use server';

import { Prisma } from "@prisma/client";
import prisma from "../../helpers/prisma";

export const createManualBooking = async (kolamId, tarikh, pancang, addOns, namaPenuh, email, telefon) => {
    try {
        const booking = await prisma.$transaction(async txn => {

            let amount = pancang.length * 90;

            const addOnsList = [];

            for (let ao of addOns) {
                if (ao.name == 'Air Mineral') {
                    addOnsList.push({
                        type: 'AIR_MINERAL',
                        quantity: ao?.quantity
                    })
                    amount += (ao.quantity * 2)
                }
            }

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
                await txn.kolam_booking.create({
                    data: {
                        payment_status: 'PAID',
                        kolam_id: Number(kolamId),
                        amount,
                        is_manual: true,
                        is_checked_in: true,
                        check_in_on: new Date().toISOString(),
                        tarikh: new Date(tarikh).toISOString(),
                        add_ons: {
                            create: addOnsList
                        },
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
                        }
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