export function generateDiceSequence(): number[] {
    const result = [] as number[]
    for (let i = 0; i < 50; i++) {
        let next = Math.round(Math.random() * 5) + 1

        if (i === 0) {
            while (next === result[i - 1]) {
                next = Math.round(Math.random() * 5) + 1
            }
        }
        result.push(next)
    }

    return result
}

export function objectCompare(a: Record<string, any>, b: Record<string, any>): boolean {
    const aKeys = Object.keys(a)
    for (let i = 0; i < aKeys.length; i++) {
        const key = aKeys[i]
        if (Object.prototype.hasOwnProperty.call(a, key) && a[key] !== b[key]) {
            return false
        }
    }

    const bKeys = Object.keys(b)
    for (let i = 0; i < bKeys.length; i++) {
        const key = bKeys[i]
        if (Object.prototype.hasOwnProperty.call(b, key) && a[key] !== b[key]) {
            return false
        }
    }
    return true
}

export function checkEnv(config: any): void {
    if (typeof config !== 'object') {
        throw new Error('Incorrect top level .env format')
    }

    if (typeof config.frontendUrl !== 'string') {
        throw new Error("Incorrect .env format - property 'frontendUrl'")
    }
    if (typeof config.mongodbConnectionString !== 'string') {
        throw new Error("Incorrect .env format - property 'mongodbConnectionString'")
    }
    if (typeof config.mongodbDatabaseName !== 'string') {
        throw new Error("Incorrect .env format - property 'mongodbDatabaseName'")
    }
}
