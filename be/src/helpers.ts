import {FieldDataset, GameProgress, PlayerColor, PlayersOrder} from "./types";

export function generateDiceSequence(): number[] {
    let result = [] as number[]
    for (let i = 0; i < 50; i++) {
        let next
        do {
            next = Math.round(Math.random() * 5) + 1
        } while (i !== 0 && next === result[i - 1])
        result.push(next)
    }

    return result
}

export function objectCompare(a: Record<string, any>, b: Record<string, any>) {
    const aKeys = Object.keys(a)
    for (let i = 0; i < aKeys.length; i++) {
        const key = aKeys[i];
        if (a.hasOwnProperty(key) && a[key] !== b[key]) {
            return false
        }
    }

    const bKeys = Object.keys(b)
    for (let i = 0; i < bKeys.length; i++) {
        const key = bKeys[i];
        if (b.hasOwnProperty(key) && a[key] !== b[key]) {
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
