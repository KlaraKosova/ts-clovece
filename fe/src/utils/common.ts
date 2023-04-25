import { Coordinates } from "../types/common/Coordinates";

export async function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
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

export function camelToKebabCase(str: string) {
    let result = ''
    for (let i = 0; i < str.length; i++) {
        if (str[i].toUpperCase() === str[i]) {
            result += `-${str[i].toLowerCase()}`
        } else {
            result += str[i]
        }
    }
    return result
}

export function coordinatesDiff(a: Coordinates, b: Coordinates): Coordinates {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}
