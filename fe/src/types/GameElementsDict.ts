
import { type PlayerColors } from './PlayerColors'
import { type StaticBackground } from '@/visuals/components/StaticBackground'
import { type Field } from '@/visuals/components/Field'
import { type Figure } from '@/visuals/components/Figure'
import { type Overlay } from '@/visuals/components/Overlay'
import { type Dice } from '@/visuals/components/Dice'
import { type DicePlayButton } from '@/visuals/components/DicePlayButton'
import { type Loading } from '@/visuals/components/Loading'
import { type WinnerModal } from '@/visuals/components/WinnerModal'

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
