'use server';

import { Prisma } from "@prisma/client";
import prisma from "../../helpers/prisma";
import moment from "moment";
import { calculate } from "./calculate";

export const createManualBooking = async (tarikh, calculatedObj, namaPenuh, email, telefon, isDeposit, depositAmount, voucher) => {
    try {
        const booking = await prisma.$transaction(async txn => {

            let amount = calculatedObj?.totalDiscounted;
            let pancangObj = calculatedObj?.products?.filter(e => e?.name == 'PANCANG')
            let pancang = pancangObj?.map(e => e?.label);
            let addOns = calculatedObj?.products?.filter(e => e?.type == 'ADD_ONS' && e?.quantity);

            const bookingAvailabilityLock = await txn.$executeRaw`
                SELECT * from booking_availability AS ba
                JOIN pancang AS p
                    ON ba.pancang_id = p.id
                    WHERE ${Prisma.join(
                pancangObj.map(po => Prisma.sql`
                            (p.value = ${po.label}
                             AND ba.kolam_id = ${po.kolam_id}
                             AND ba.is_available = true
                             AND ba.tarikh = ${new Date(tarikh)}::date
                            )`
                ),
                ' OR '
            )}
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

                const pancangData = await txn.pancang.findMany({
                    where: {
                        value: {
                            in: pancang
                        }
                    },
                    select: {
                        'kolam_id': true,
                        'id': true,
                        'value': true,
                    }
                })
                await txn.kolam_booking.create({
                    data: {
                        payment_status: isDeposit ? 'PENDING_PAYMENT' : 'PAID',
                        //kolam_id: Number(kolamId),
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
                        kolam_booking_kolams: {
                            createMany: {
                                data: pancangObj.map(p => ({
                                    'kolam_id': Number(p?.kolam_id),
                                    'kolam_booking_pancang_id': pancangData?.filter(pd => pd?.value == p?.label)?.[0]?.id
                                }))
                            }
                        },
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
                        OR: pancangData.map(pd => ({
                            kolam_id: Number(pd?.kolam_id),
                            pancang_id: Number(pd?.id),
                            tarikh: new Date(tarikh).toISOString()
                        }))
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
            is_deleted: false,
        },
        select: {
            'amount': true,
            'payment_status': true,
            'tarikh': true,
            'deposit_amount': true,
            'is_manual': true,
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
            'kolam_booking_kolams': {
                where: {
                    is_deleted: false,
                },
                'select': {
                    'kolam_booking_pancang': {
                        'select': {
                            'value': true,
                        }
                    },
                    'kolam': {
                        'select': {
                            'label': true,
                            'id': true,
                        }
                    }
                }
            },
        },
        orderBy: {
            created_on: 'asc'
        }
    }))
}

export const updateBooking = async (id, tarikh, toAdd, toDelete) => {
    try {
        const booking = await prisma.$transaction(async txn => {

            if (toAdd.length) {
                const bookingAvailabilityLock = await txn.$executeRaw`
                    SELECT * from booking_availability AS ba
                    JOIN pancang AS p
                        ON ba.pancang_id = p.id
                        WHERE ${Prisma.join(
                    toAdd.map(po => Prisma.sql`
                                (p.value = ${po.pancang.value}
                                 AND ba.kolam_id = ${po.kolam_id}
                                 AND ba.is_available = true
                                 AND ba.tarikh = ${new Date(tarikh)}::date
                                )`
                    ),
                    ' OR '
                )}
                    FOR UPDATE`;

                if (bookingAvailabilityLock == toAdd.length) {
                    await txn.kolam_booking_kolams.createMany({
                        data: toAdd.map(add => ({
                            'kolam_booking_id': Number(id),
                            'kolam_booking_pancang_id': Number(add.pancang.id),
                            'kolam_id': Number(add.kolam_id),
                        }))
                    })
                    await txn.booking_availability.updateMany({
                        data: {
                            'is_available': false,
                        },
                        where: {
                            'pancang_id': {
                                in: toAdd.map(ta => Number(ta.pancang.id))
                            }
                        }
                    })
                } else {
                    throw new Error('Maaf, pancang yang anda pilih telah dipilih oleh pengguna lain.')
                }

            }
            if (toDelete.length) {
                await txn.kolam_booking_kolams.updateMany({
                    where: {
                        OR: toDelete.map(del => ({
                            'kolam_booking_id': Number(id),
                            kolam_booking_pancang: {
                                'value': del.kolam_booking_pancang.value
                            },
                            'kolam_id': Number(del.kolam_id)
                        })),
                    },
                    data: {
                        'is_deleted': true,
                    }
                })
                await txn.booking_availability.updateMany({
                    data: {
                        'is_available': true,
                    },
                    where: {
                        'pancang': {
                            'value': {
                                in: toDelete.map(del => del.kolam_booking_pancang.value)
                            }
                        }
                    }
                })
            }
            //recalculate total amount
            const updatedBooking = await txn.kolam_booking.findFirst({
                where: {
                    id: Number(id),
                    is_deleted: false,
                },
                select: {
                    'kolam_booking_kolams': {
                        select: {
                            'kolam_id': true,
                            'kolam_booking_pancang': {
                                select: {
                                    'value': true,
                                    'id': true,
                                }
                            }
                        },
                        where: {
                            is_deleted: false,
                        }
                    },
                    'voucher': {
                        select: {
                            'code': true,
                        }
                    },
                    'add_ons': {
                        select: {
                            'type': true,
                            'quantity': true,
                        }
                    }
                }
            })

            const { totalDiscounted, total } = await calculate(
                [
                    ...updatedBooking?.kolam_booking_kolams?.map(kbk => ({
                        value: kbk.kolam_booking_pancang.value,
                        name: 'PANCANG',
                        label: kbk.kolam_booking_pancang.value,
                        quantity: 1
                    })),
                    ...updatedBooking.add_ons.map(e => ({
                        ...e,
                        name: e?.type
                    }))
                ], updatedBooking?.voucher);

            await txn.kolam_booking.update({
                where: {
                    id: Number(id)
                },
                data: {
                    'amount': totalDiscounted || total
                }
            })
        })

        return 'Successful';

    } catch (e) {
        throw new Error(e.message)
    }


}

export const deleteBooking = async (id) => {
    try {
        await prisma.$transaction(async txn => {
            const booking = await txn.kolam_booking.findFirst({
                where: {
                    id: Number(id)
                },
                select: {
                    'kolam_booking_kolams': {
                        'select': {
                            'id': true,
                            'kolam_booking_pancang_id': true,
                        }
                    }
                }
            })
            await txn.kolam_booking_kolams.updateMany({
                where: {
                    id: {
                        in: booking?.kolam_booking_kolams?.map(e => Number(e?.id))
                    },
                    kolam_booking_id: Number(id),
                },
                data: {
                    is_deleted: true
                }
            })
            await txn.kolam_booking.update({
                where: {
                    id: Number(id)
                },
                data: {
                    is_deleted: true,
                }
            })
            await txn.booking_availability.updateMany({
                where: {
                    pancang_id: {
                        in: booking?.kolam_booking_kolams?.map(e => Number(e.kolam_booking_pancang_id))
                    }
                },
                data: {
                    is_available: true,
                }
            })
            return;
        })
    } catch (e) {
        throw e;
    }


}