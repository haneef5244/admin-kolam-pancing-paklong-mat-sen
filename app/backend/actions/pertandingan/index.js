'use server';
import moment from "moment";
import prisma from "../../helpers/prisma";
import { getBlobSasUrl } from "../../helpers/blob";
import { broadcastMessage } from "../webpubsub";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";

export const getAllPertandingan = async () => {
    try {
        let dates = await prisma.booking_availability.findMany({
            where: {
                tarikh: {
                    gte: moment().startOf('day')
                },
            },
            distinct: ['tarikh'],
            select: {
                'tarikh': true,
            },
            orderBy: {
                'tarikh': 'asc'
            }
        })
        let posters = await prisma.pertandingan.findMany({
            where: {
                tarikh: {
                    in: dates?.map(e => new Date(e?.tarikh).toISOString())
                },
                is_deleted: false
            },
            select: {
                'tarikh': true,
                'poster_url': true,
                'jenis': true,
                'is_started': true,
                'is_ended': true,
                'id': true,
            }
        })
        for (let d of dates) {
            let pertandingan = posters.filter(e => moment(e?.tarikh).startOf('day').format('YYYY-MM-DD') == moment(d?.tarikh).startOf('day').format('YYYY-MM-DD'))?.[0] ?? {};
            let poster_url = pertandingan?.poster_url;
            if (poster_url) {
                d.poster_url = getBlobSasUrl(poster_url, 'posters', moment().utc().add(10, "minute"), process.env.AZURE_STORAGE_PUBLIC_ACCOUNT_NAME, process.env.AZURE_STORAGE_PUBLIC_ACCOUNT_KEY);
            }
            d.jenis = pertandingan?.jenis
            d.is_started = pertandingan?.is_started
            d.is_ended = pertandingan?.is_ended
            d.pertandingan_id = pertandingan?.id
        }
        return dates;
    } catch (e) {
        throw e;
    }

}

export const startPertandingan = async (id) => {
    await prisma.pertandingan.update({
        where: {
            id: Number(id)
        },
        data: {
            'is_started': true
        }
    })
    await broadcastStartPertandingan();
    return;
}

export const getPertandinganLog = async (pertandinganId) => {
    let result = await prisma.pertandingan_audit_log.findMany({
        where: {
            pertandingan_id: Number(pertandinganId),
        },
        select: {
            'pancang_value': true,
            'berat': true,
            'waktu': true,
            'timbang': {
                'select': {
                    'label': true,
                }
            },
            'id': true
        },
        orderBy: [{
            berat: 'desc'
        }, {
            waktu: 'desc'
        }],
        'take': 250
    })
    result = result?.map((e, no) => ({ ...e, no: no + 1 }))
    return result;
}

export const getAllPertandinganLog = async (pertandinganId) => {
    let result = await prisma.pertandingan_audit_log.findMany({
        where: {
            pertandingan_id: Number(pertandinganId),
        },
        select: {
            'pancang_value': true,
            'berat': true,
            'waktu': true,
            'timbang': {
                'select': {
                    'label': true,
                    'id': true
                }
            },
            'id': true,
        },
        orderBy: [{
            berat: 'desc'
        }, {
            waktu: 'desc'
        }]
    })
    result = result?.map((e, no) => ({ ...e, no: no + 1, timbang_id: e?.timbang?.id, waktu: moment(e.waktu).format('HH:MM A') }))
    return result;
}

export const insertPertandingLog = async (pancangValue, weight, pertandinganId, timbangId, jenisPertandingan, time, tarikhPertandingan) => {
    let waktu = ''
    if (moment(time).format('A') === 'AM') {
        waktu = moment(`${moment(tarikhPertandingan).format('YYYY-MM-DD')} ${moment(time).hours()}:${moment(time).minutes()}:${moment(time).minutes()}`).add(1, 'day').toISOString()
    } else waktu = moment(`${moment(tarikhPertandingan).format('YYYY-MM-DD')} ${moment(time).hours()}:${moment(time).minutes()}:${moment(time).minutes()}`).toISOString()

    await prisma.pertandingan_audit_log.create({
        data: {
            'berat': weight,
            'pancang': {
                'connect': {
                    'id': pancangValue?.id
                }
            },
            'pertandingan': {
                'connect': {
                    id: pertandinganId
                }
            },
            timbang: {
                'connect': {
                    id: Number(timbangId)
                }
            },
            waktu
        }
    });
    broadcast(pertandinganId, jenisPertandingan);
}

export const broadcast = async (pertandinganId, jenisPertandingan) => {
    if (jenisPertandingan == 'OPEN') {
        let result = await prisma.pertandingan_audit_log.findMany({
            where: {
                pertandingan_id: Number(pertandinganId),
            },
            select: {
                'pancang_value': true,
                'berat': true,
                'waktu': true,
                'timbang': {
                    'select': {
                        'label': true,
                    }
                }
            },
            orderBy: [{
                berat: 'desc'
            }, {
                waktu: 'desc'
            }],
            'take': 250
        })
        result = result?.map((e, no) => ({ ...e, no: no + 1 }))
        await broadcastMessage(process.env.AZURE_WEB_PUB_SUB_CONNECTION_STRING, `pertandingan_${pertandinganId}`, JSON.stringify({ data: result }))
    }
}

export const broadcastEndPertandingan = async (pertandinganId) => {
    await broadcastMessage(process.env.AZURE_WEB_PUB_SUB_CONNECTION_STRING, `pertandingan_${pertandinganId}`, JSON.stringify({ is_ended: true }))
}

export const broadcastStartPertandingan = async () => {
    await broadcastMessage(process.env.AZURE_WEB_PUB_SUB_CONNECTION_STRING, 'pertandingan_event_started', JSON.stringify({ is_started: true }))
}

export const getTimbang = async () => {
    const token = cookies().get('token');
    const tokenValue = token?.value;

    const { id } = decode(tokenValue);
    return await prisma.timbang.findFirst({
        where: {
            admin_id: Number(id),
            is_deleted: false,
        },
        select: {
            'label': true,
            'id': true,
        }
    })
}

export const endPertandingan = async (pertandinganId) => {
    await prisma.pertandingan.update({
        where: {
            id: Number(pertandinganId)
        },
        data: {
            is_ended: true,
        }
    })
    broadcastEndPertandingan(pertandinganId)
}

export const updateAuditLog = async (data, pertandinganId, tarikhPertandingan) => {
    let hour = moment(data?.waktu).hours()
    let minute = moment(data?.waktu).minutes()
    let foat = moment(data?.waktu).format('A');
    let waktu = ''
    if (moment(data?.waktu).format('A') === 'AM') {
        waktu = moment(`${moment(tarikhPertandingan).format('YYYY-MM-DD')} ${moment(data?.waktu).hours()}:${moment(data?.waktu).minutes()}:00`).add(1, 'day').toISOString()
    } else waktu = moment(`${moment(tarikhPertandingan).format('YYYY-MM-DD')} ${moment(data?.waktu).hours()}:${moment(data?.waktu).minutes()}:00`).toISOString()

    const updatedData = await prisma.pertandingan_audit_log.update({
        where: {
            id: Number(data?.id),
            pertandingan_id: Number(pertandinganId)
        },
        data: {
            'berat': data?.berat,
            'pancang': {
                connect: {
                    value: data?.pancang_value
                }
            },
            timbang: {
                connect: {
                    id: data?.timbang_id,
                }
            },
            'waktu': data?.waktu
        },
        select: {
            pertandingan: {
                'select': {
                    'jenis': true
                }
            }
        }
    })
    broadcast(pertandinganId, updatedData?.pertandingan?.jenis)
}

export const deletePertandinganAuditLog = async (id, pertandinganId, jenisPertandingan) => {
    await prisma.pertandingan_audit_log.delete({
        where: {
            id,
        }
    })
    broadcast(pertandinganId, jenisPertandingan)

    return
}