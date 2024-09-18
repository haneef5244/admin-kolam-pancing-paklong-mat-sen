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

export const getAllUsersBookings = async () => {
    const registeredUsers = await prisma.user.findMany({
        select: {
            'nama_akhir': true,
            'nama_pertama': true,
            'email': true,
            'telefon': true,
            'kolam_bookings': {
                select: {
                    'id': true,
                }
            }
        }
    })
    for (let u of registeredUsers) {
        u.nama_penuh = `${u?.nama_pertama} ${u?.nama_akhir}`
    }
    const manualUsers = await prisma.manual_booking.findMany({
        select: {
            'email': true,
            'nama_penuh': true,
            'telefon': true,
            'kolam_booking': {
                select: {
                    'id': true,
                }
            }
        }
    })
    return JSON.stringify([...registeredUsers, ...manualUsers])
}

export const getFirstTenNamaPengguna = async (nama) => {
    const registeredUsers = await prisma.user.findMany({
        where: {
            OR: [
                {
                    'nama_pertama': {
                        contains: nama.toLowerCase(),
                        mode: 'insensitive'
                    }
                },
                {
                    'nama_akhir': {
                        contains: nama.toLowerCase(),
                        mode: 'insensitive'
                    }
                }
            ]
        },
        take: 5,
        select: {
            'nama_pertama': true,
            'nama_akhir': true,
        }
    })
    for (let u of registeredUsers) {
        u.nama_penuh = `${u.nama_pertama} ${u.nama_akhir}`
    }
    const manualUsers = await prisma.manual_booking.findMany({
        where: {
            'nama_penuh': {
                contains: nama.toLowerCase(),
                mode: 'insensitive'
            }
        },
        take: 5,
        distinct: ['nama_penuh'],
        select: {
            'nama_penuh': true,
        }
    })
    return JSON.stringify([...registeredUsers, ...manualUsers])
}

export const getFirstTenEmails = async (email) => {
    const registeredUsers = await prisma.user.findMany({
        where: {
            email: {
                contains: email.toLowerCase(),
                mode: 'insensitive'
            }
        },
        take: 5,
        select: {
            'email': true,
        }
    })
    const manualUsers = await prisma.manual_booking.findMany({
        where: {
            email: {
                contains: email.toLowerCase(),
                mode: 'insensitive'
            }
        },
        take: 5,
        distinct: ['email'],
        select: {
            'email': true,
        }
    })
    return JSON.stringify([...registeredUsers, ...manualUsers])
}

export const getFirstTenTelefon = async (telefon) => {
    const registeredUsers = await prisma.user.findMany({
        where: {
            telefon: {
                contains: telefon.trim(),
                mode: 'insensitive'
            }
        },
        take: 5,
        select: {
            'telefon': true,
        }
    })
    const manualUsers = await prisma.manual_booking.findMany({
        where: {
            telefon: {
                contains: telefon.toLowerCase(),
                mode: 'insensitive'
            }
        },
        take: 5,
        distinct: ['telefon'],
        select: {
            'telefon': true,
        }
    })
    return JSON.stringify([...registeredUsers, ...manualUsers])
}