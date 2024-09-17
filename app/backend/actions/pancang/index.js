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
            'is_available': true,
        }
    })
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
    return {
        available: Number(available) - Number(unavailable),
        unavailable,
    }
}