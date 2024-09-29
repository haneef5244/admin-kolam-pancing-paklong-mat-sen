'use server';
import moment from "moment";
import prisma from "../../helpers/prisma"

export const getAvailablePancang = async (kolamId, tarikh) => {
    return await prisma.booking_availability.findMany({
        where: {
            kolam_id: kolamId,
            tarikh: tarikh,
            pancang: {
                is_deleted: false
            }
        },
        select: {
            'pancang': {
                select: {
                    'value': true,
                    'is_left': true,
                    'is_right': true,
                    'is_available': true,
                }
            },
            'kolam_id': true,
            'is_available': true,
        }
    })
}

export const getKolamsFromPancang = async (pancangs) => {
    return JSON.stringify(await prisma.booking_availability.findMany({
        where: {
            pancang: {
                'value': {
                    in: pancangs
                }
            }
        },
        distinct: ['kolam_id']
    }))
}

export const getPancangData = async (pancangs) => {
    const data = await prisma.booking_availability.findMany({
        where: {
            pancang: {
                'value': {
                    in: pancangs
                }
            }
        },
        select: {
            'kolam_id': true,
            'pancang': {
                'select': {
                    'value': true
                }
            }
        },
        orderBy: {
            'pancang': {
                'value': 'asc'
            }
        }
    })
    let obj = {}
    for (let i of data) {
        if (obj.hasOwnProperty(i?.kolam_id)) {
            obj[i?.kolam_id] = [...obj[i?.kolam_id], i?.pancang?.value]
        } else {
            obj[i?.kolam_id] = [i?.pancang?.value]
        }
    }
    return JSON.stringify(obj);
}

export const getAvailableAndUnavailablePancang = async (tarikh) => {
    const unavailable = await prisma.booking_availability.count({
        where: {
            'is_available': false,
            tarikh: moment(tarikh).toISOString(),
            pancang: {
                is_available: true,
                is_deleted: false
            }
        }
    })
    const available = await prisma.pancang.count({
        where: {
            is_available: true,
            is_deleted: false,
        }
    })
    return JSON.stringify({
        available: Number(available) - Number(unavailable),
        unavailable,
    })
}

export const getAllActivePancangs = async () => {
    let pancangs = await prisma.pancang.findMany({
        where: {
            is_deleted: false,
            is_available: true,
        },
        select: {
            'id': true,
            'value': true
        }
    })

    return pancangs.map(p => ({
        ...p,
        label: p?.value
    }))
}