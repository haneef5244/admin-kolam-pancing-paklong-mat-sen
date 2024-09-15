'use server';

import prisma from "@/app/backend/helpers/prisma";

export const calculate = async (products, voucher) => {
    const productDetails = await prisma.products.findMany({
        where: {
            name: {
                in: products?.map(e => e?.name)
            }
        },
        select: {
            'vouchers': true,
            'price': true,
            'label': true,
            'name': true,
            'type': true,
        }
    })
    let total = 0;
    let totalDiscounted = 0;
    for (let p of products) {
        const pp = productDetails?.filter(e => e?.name == p?.name)?.[0];

        if (voucher) {
            const containsVoucher = pp?.vouchers?.filter(e => e?.code == voucher);
            if (containsVoucher?.length) {
                let vouch = containsVoucher?.[0];
                p.discountedPrice = p.quantity * pp.price * vouch.percentage_off;
                p.price = p.quantity * pp.price
            } else {
                p.discountedPrice = p.quantity * pp.price
                p.price = p.quantity * pp.price

            }
        } else {
            p.discountedPrice = p.quantity * pp.price
            p.price = p.quantity * pp.price
        }
        if (pp?.type == 'ADD_ONS') {
            p.label = pp?.label
        }
        p.type = pp?.type
        total += p.price;
        totalDiscounted += p.discountedPrice;

    }
    return {
        total,
        totalDiscounted,
        products
    };
}