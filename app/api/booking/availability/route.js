import prisma from "@/app/backend/helpers/prisma";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { NextResponse } from "next/server";

export const getAvailableBookings = async () => {
    return prisma.booking_availability.findMany({
        where: {
            tarikh: {
                gte: moment().startOf('day')
            },
        },
        distinct: ['tarikh'],
    })
}

export async function GET(req) {
    const data = await getAvailableBookings();
    return NextResponse.json({ data });
}

export async function POST(req) {
    try {
        const body = await req.json();

        const toDelete = body?.dates?.filter(e => e?.is_deleted);
        const toAdd = body?.dates?.filter(e => !e?.is_deleted);



        if (toDelete?.length) {
            const count = await prisma.$transaction(async (txn) => {
                let value = toDelete?.map(e => `'${moment(e.value).toDate()}'`).join(',');
                let query = `SELECT * from "booking_availability"
                WHERE 
                tarikh::text in (${toDelete?.map(e => `'${moment(e?.value).format("YYYY-MM-DD HH:mm:ss")}' AS timestamp without time zone)`).join(',')})
                FOR UPDATE`

                console.log(query)
                const lockQuery = await txn.$queryRaw`SELECT * from "booking_availability"
                    WHERE tarikh::date IN (${Prisma.join(toDelete.map(e => Prisma.sql`${e.value}::date`))})
                    FOR UPDATE`;

                const deleteCount = await txn.$executeRaw`DELETE from "booking_availability"
                    WHERE tarikh::date IN (${Prisma.join(toDelete.map(e => Prisma.sql`${e.value}::date`))});
                `
                await txn.pertandingan.deleteMany({
                    where: {
                        tarikh: {
                            in: toDelete?.map(e => `${new Date(e?.value).toISOString()}`)
                        }
                    }
                })
                await txn.pertandingan_audit_log.deleteMany({
                    where: {
                        'pertandingan': {
                            tarikh: {
                                in: toDelete?.map(e => `${new Date(e?.value).toISOString()}`)
                            }
                        }
                    }
                })
                return deleteCount;
            });

            if (!count) {
                return NextResponse.json({ error: 'Error deleting dates!' }, { status: 500 })
            }
        }
        if (toAdd?.length) {
            let kolams = await prisma.kolam.findMany({
                select: {
                    'id': true,
                }
            });
            let pancangs = await prisma.pancang.findMany({
                select: {
                    'id': true,
                    'kolam_id': true,
                }
            });

            let dataToInsert = [];
            let kolamObj = {}
            for (let k of kolams) {
                kolamObj[k?.id] = k;
            }
            let tarikhs = [];
            for (let tarikh of toAdd) {
                for (let p of pancangs) {
                    dataToInsert.push({
                        kolam_id: p?.kolam_id,
                        tarikh: new Date(tarikh?.value),
                        pancang_id: p?.id
                    })
                }
                tarikhs.push(new Date(tarikh?.value));
            }

            const resp = await prisma.booking_availability.createMany({
                data: dataToInsert
            })
            const pertandinganResp = await prisma.pertandingan.createMany({
                data: tarikhs.map(t => {
                    return {
                        tarikh: t
                    }
                })
            })
            if (resp?.count) {
                return NextResponse.json({ message: 'Successful!' })
            } else {
                return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 })
            }
        }
        return NextResponse.json({ message: 'Successful!' })
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 })
    }

}