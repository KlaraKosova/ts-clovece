
import { PlayerColors } from "./PlayerColors";
import {StaticBackground} from "@/gameProgressControls/svgLayer/StaticBackground";
import { Field } from "@/gameProgressControls/svgLayer/Field";
import { Figure } from "@/gameProgressControls/svgLayer/Figure";
import { Overlay } from "@/gameProgressControls/svgLayer/Overlay";
import { Dice } from "@/gameProgressControls/svgLayer/Dice";
import { DicePlayButton } from "@/gameProgressControls/svgLayer/DicePlayButton";
import { Loading } from "@/gameProgressControls/svgLayer/Loading";
import { WinnerModal } from "@/gameProgressControls/svgLayer/WinnerModal";

export interface GameElementsDict {
    STATIC_BACKGROUND: StaticBackground,
    MAIN_FIELDS: Field[],
    START_FIELDS: Record<PlayerColors, Field[]>,
    HOME_FIELDS: Record<PlayerColors, Field[]>,
    FIGURES: Record<PlayerColors, Figure[]>,
    OVERLAY: Overlay,
    DICE: Dice,
    DICE_PLAY_BUTTON: DicePlayButton,
    LOADING: Loading,
    WINNER_MODAL: WinnerModal
}
