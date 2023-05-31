import { Coordinates } from "../../../types/svgLayer/Coordinates";

export interface Movable {
    moveTo(to: Coordinates, duration: number): void;
}
