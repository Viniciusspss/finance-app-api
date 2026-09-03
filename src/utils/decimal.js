export const formatAmount = (value) => {
    const num = parseFloat(String(value ?? '0'))
    if (Number.isNaN(num)) {
        return '0'
    }
    if (Number.isInteger(num)) {
        return String(num)
    }
    return num.toFixed(2)
}

export const sumAmounts = (amounts) => {
    const total = amounts.reduce(
        (acc, value) => acc + parseFloat(String(value ?? '0')),
        0,
    )
    return formatAmount(total)
}

export const subtractAmounts = (a, b) => {
    return formatAmount(
        parseFloat(String(a ?? '0')) - parseFloat(String(b ?? '0')),
    )
}

export const percentageOfTotal = (part, total) => {
    const totalNum = parseFloat(String(total ?? '0'))
    if (totalNum === 0) {
        return 0
    }
    return Math.floor((parseFloat(String(part ?? '0')) / totalNum) * 100)
}

export const toDocument = (doc) => {
    if (!doc) {
        return null
    }
    const plain = doc.toObject ? doc.toObject() : { ...doc }
    const { _id, __v, ...rest } = plain
    if (!rest.id && _id) {
        rest.id = _id.toString()
    }
    if (rest.amount !== undefined) {
        rest.amount = formatAmount(rest.amount)
    }
    return rest
}

export const isDuplicateKeyError = (error) => error?.code === 11000
