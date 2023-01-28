import { GameProgress, PlayerColor} from "./types";

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
