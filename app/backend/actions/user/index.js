'use server'
import { cookies } from "next/headers";
import prisma from "../../helpers/prisma"

export const validateUser = async (id) => {
    const user = await prisma.admin.findFirst({
        where: {
            id
        },
        select: {
            'id': true,
        }
    })
    return user;
}

export const deleteUserSession = async () => {
    cookies().delete('token', {
        path: '/admin'
    });
    return;
}