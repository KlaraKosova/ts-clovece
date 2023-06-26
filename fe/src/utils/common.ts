import { type Coordinates } from '../types/Coordinates'

export async function delay(ms: number): Promise<void> {
    await new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

// TODO refactor using generics
// export function objectCompare<Type extends Record<string, any>>(a: Type, b: Type)
export function objectCompare(a: Record<string, any> | null, b: Record<string, any> | null): boolean {
    if (!a || !b) {
        return a === b
    }

    const aKeys = Object.keys(a)
    for (let i = 0; i < aKeys.length; i++) {
        const key = aKeys[i]
        if (Object.hasOwnProperty.call(a, key) && a[key] !== b[key]) {
            return false
        }
    }

    const bKeys = Object.keys(b)
    for (let i = 0; i < bKeys.length; i++) {
        const key = bKeys[i]
        if (Object.hasOwnProperty.call(b, key) && a[key] !== b[key]) {
            return false
        }
    }
    return true
}

export function camelToKebabCase(str: string): string {
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
