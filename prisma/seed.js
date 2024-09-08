// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generatePancangValue = (prefix, start, end, kolam, is_left = false, is_right = false) => {
    let data = []
    for (let i = end; i >= start; i--) {
        let prefixNumber = '';
        if (i / 1000 >= 1) {
            prefixNumber = ''
        } else if (i / 100 >= 1) {
            prefixNumber = '0'
        } else if (i / 10 >= 1) {
            prefixNumber = '00'
        } else {
            prefixNumber = '000'
        }
        console.log(`${prefix}${prefixNumber}${i}`)
        data.push({
            value: `${prefix}${prefixNumber}${i}`,
            kolam_id: kolam,
            is_left,
            is_right
        })
    }
    return data;
}



async function main() {
    // await prisma.pancang.createMany({
    //     data: [
    //         ...generatePancangValue('A', 1, 138, 1, false, true),
    //         ...generatePancangValue('B', 139, 279, 1, true, false),
    //         ...generatePancangValue('C', 280, 591, 2, true, false),
    //         ...generatePancangValue('D', 592, 991, 2, false, true),
    //         ...generatePancangValue('E', 992, 1231, 3, true, false),
    //         ...generatePancangValue('F', 1232, 1522, 3, false, true),
    //     ]
    // })
    // Add more seeding operations here
}

main()
    .then(() => {
        console.log('Database has been seeded');
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
