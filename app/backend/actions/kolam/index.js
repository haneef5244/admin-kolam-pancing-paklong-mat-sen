'use server';
import moment from "moment";
import prisma from "../../helpers/prisma"

export const getKolams = async (tarikh) => {
    const availablePancangs = await prisma.booking_availability.findMany({
        select: {
            'kolam': {
                'select': {
                    'id': true,
                    'label': true,
                }
            },
            'pancang': {
                'select': {
                    'id': true,
                    'value': true,
                },
            },
        },
        where: {
            'tarikh': moment(tarikh).toISOString(),
            'is_available': true,
            'pancang': {
                'is_available': true,
                'is_deleted': false,
            }
        },
        'orderBy': {
            'pancang': { 'value': 'asc' }
        }
    })
    let kolamIndex = 0;

    let kolams = [];

    let kolamIndexObj = {}
    for (let ap of availablePancangs) {
        if (!kolamIndexObj[ap?.kolam?.id]) {
            kolamIndexObj[ap?.kolam?.id] = true;
            kolams[kolamIndex] = {
                id: ap?.kolam?.id,
                label: ap?.kolam?.label,
                pancangs: availablePancangs?.filter(p => p?.kolam?.id == ap?.kolam?.id)?.map(x => x?.pancang)
            }
            kolamIndex++;
        }
    }

    return JSON.stringify(kolams);
}