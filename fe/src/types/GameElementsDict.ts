
import { type PlayerColors } from './PlayerColors'
import { type StaticBackground } from '@/gameProgressControls/svgLayer/StaticBackground'
import { type Field } from '@/gameProgressControls/svgLayer/Field'
import { type Figure } from '@/gameProgressControls/svgLayer/Figure'
import { type Overlay } from '@/gameProgressControls/svgLayer/Overlay'
import { type Dice } from '@/gameProgressControls/svgLayer/Dice'
import { type DicePlayButton } from '@/gameProgressControls/svgLayer/DicePlayButton'
import { type Loading } from '@/gameProgressControls/svgLayer/Loading'
import { type WinnerModal } from '@/gameProgressControls/svgLayer/WinnerModal'

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
