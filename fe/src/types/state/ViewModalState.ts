import { ViewModalTypes } from "./ViewModalTypes"

export type ViewModalState = /*{
    type: ViewModalTypes,
    data: any // TODO
}
*/ {
    type: typeof ViewModalTypes.NO_MOVES_MODAL,
    data: undefined
} | undefined