
import { type PlayerColors } from './PlayerColors'
import { type StaticBackground } from '@/controls/visual/components/StaticBackground'
import { type Field } from '@/controls/visual/components/Field'
import { type Figure } from '@/controls/visual/components/Figure'
import { type Overlay } from '@/controls/visual/components/Overlay'
import { type Dice } from '@/controls/visual/components/Dice'
import { type DicePlayButton } from '@/controls/visual/components/DicePlayButton'
import { type Loading } from '@/controls/visual/components/Loading'
import { type WinnerModal } from '@/controls/visual/components/WinnerModal'

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
