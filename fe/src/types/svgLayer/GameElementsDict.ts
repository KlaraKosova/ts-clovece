
import { PlayerColors } from "../common/PlayerColors";
import {StaticBackground} from "@/gameProgressControls/svgLayer/StaticBackground";
import { Field } from "@/gameProgressControls/svgLayer/Field";
import { Figure } from "@/gameProgressControls/svgLayer/Figure";
import { Overlay } from "@/gameProgressControls/svgLayer/Overlay";
import { Dice } from "@/gameProgressControls/svgLayer/Dice";
import { DicePlayButton } from "@/gameProgressControls/svgLayer/DicePlayButton";
import { NoMovesModal } from "@/gameProgressControls/svgLayer/NoMovesModal";
import { NextPlayerButton } from "@/gameProgressControls/svgLayer/NextPlayerButton";
import { Loading } from "@/gameProgressControls/svgLayer/Loading";
import { HomeMovesOnlyModal } from "@/gameProgressControls/svgLayer/HomeMovesOnlyModal";

export interface GameElementsDict {
    STATIC_BACKGROUND: StaticBackground,
    MAIN_FIELDS: Field[],
    START_FIELDS: Record<PlayerColors, Field[]>,
    HOME_FIELDS: Record<PlayerColors, Field[]>,
    FIGURES: Record<PlayerColors, Figure[]>,
    OVERLAY: Overlay,
    DICE: Dice,
    DICE_PLAY_BUTTON: DicePlayButton,
    NO_MOVES_MODAL: NoMovesModal,
    NEXT_PLAYER_BUTTON: NextPlayerButton,
    LOADING: Loading,
    HOME_MOVES_ONLY_MODAL: HomeMovesOnlyModal
}
