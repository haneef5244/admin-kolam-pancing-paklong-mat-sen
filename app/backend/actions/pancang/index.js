'use server';
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
                }
            },
            'is_available': true,
        }
    })
}