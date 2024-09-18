import moment from "moment";
import prisma from "../../helpers/prisma";
import { getBlobSasUrl } from "../../helpers/blob";

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
            }
        })
        for (let d of dates) {
            let pertandingan = posters.filter(e => moment(e?.tarikh).startOf('day').format('YYYY-MM-DD') == moment(d?.tarikh).startOf('day').format('YYYY-MM-DD'))?.[0] ?? {};
            let poster_url = pertandingan?.poster_url;
            if (poster_url) {
                d.poster_url = getBlobSasUrl(poster_url, 'posters', moment().utc().add(10, "minute"), process.env.AZURE_STORAGE_PUBLIC_ACCOUNT_NAME, process.env.AZURE_STORAGE_PUBLIC_ACCOUNT_KEY);
            }
            d.jenis = pertandingan?.jenis
        }
        return dates;
    } catch (e) {
        throw e;
    }

}