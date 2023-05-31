
import { Dice } from "../../svgLayer/elements/Dice";
import { DicePlayButton } from "../../svgLayer/elements/DicePlayButton";
import { Field } from "../../svgLayer/elements/Field";
import { Figure } from "../../svgLayer/elements/Figure";
import { Loading } from "../../svgLayer/elements/Loading";
import { NextPlayerButton } from "../../svgLayer/elements/NextPlayerButton";
import { NoMovesModal } from "../../svgLayer/elements/NoMovesModal";
import { Overlay } from "../../svgLayer/elements/Overlay";
import { StaticBackground } from "../../svgLayer/elements/StaticBackground";
import { PlayerColors } from "../common/PlayerColors";

export interface GameElementDict {
    BACKGROUND: StaticBackground,
    MAIN_FIELDS: Field[],
    START_FIELDS: Record<PlayerColors, Field[]>,
    HOME_FIELDS: Record<PlayerColors, Field[]>,
    FIGURES: Record<PlayerColors, Figure[]>,
    OVERLAY: Overlay,
    DICE: Dice,
    DICE_PLAY_BUTTON: DicePlayButton,
    NO_MOVES_MODAL: NoMovesModal,
    NEXT_PLAYER_BUTTON: NextPlayerButton,
    LOADING: Loading
}
