const generatePancangValue = (prefix, start, end, kolam) => {
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
        })
    }
}

generatePancangValue('A', 1, 145, 1);