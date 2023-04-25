import { Dice } from "../../svgElements/elements/Dice";
import { DicePlayButton } from "../../svgElements/elements/DicePlayButton";
import { Field } from "../../svgElements/elements/Field";
import { Figure } from "../../svgElements/elements/Figure";
import { Loading } from "../../svgElements/elements/Loading";
import { NextPlayerButton } from "../../svgElements/elements/NextPlayerButton";
import { NoMovesModal } from "../../svgElements/elements/NoMovesModal";
import { Overlay } from "../../svgElements/elements/Overlay";
import { StaticBackground } from "../../svgElements/elements/StaticBackground";
import { PlayerColors } from "../common/PlayerColors";

export interface GameElementsDict {
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
