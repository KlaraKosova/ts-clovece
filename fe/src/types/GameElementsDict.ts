
import { type PlayerColors } from './PlayerColors'
import { type StaticBackground } from '@/svgComponents/StaticBackground'
import { type Field } from '@/svgComponents/Field'
import { type Figure } from '@/svgComponents/Figure'
import { type Overlay } from '@/svgComponents/Overlay'
import { type Dice } from '@/svgComponents/Dice'
import { type DicePlayButton } from '@/svgComponents/DicePlayButton'
import { type Loading } from '@/svgComponents/Loading'
import { type WinnerModal } from '@/svgComponents/WinnerModal'

export interface GameElementsDict {
    STATIC_BACKGROUND: StaticBackground
    MAIN_FIELDS: Field[]
    START_FIELDS: Record<PlayerColors, Field[]>
    HOME_FIELDS: Record<PlayerColors, Field[]>
    FIGURES: Record<PlayerColors, Figure[]>
    OVERLAY: Overlay
    DICE: Dice
    DICE_PLAY_BUTTON: DicePlayButton
    LOADING: Loading
    WINNER_MODAL: WinnerModal
}
