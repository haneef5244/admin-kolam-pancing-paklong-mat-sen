'use server';

import prisma from "@/app/backend/helpers/prisma";
import moment from "moment";

export const validateVoucher = async voucher => {
    if (voucher) {
        const voucherData = await prisma.vouchers.findFirst({
            where: {
                code: voucher,
                expires_on: {
                    gte: moment().toISOString()
                }
            },
            select: {
                'id': true,
                'code': true,
            }
        });

        if (!voucherData?.id) {
            return false;
        }
    }
    return true;
}