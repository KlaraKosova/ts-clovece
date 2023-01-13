import { SVG } from "@svgdotjs/svg.js";
import { Constants, k } from "../helpers/svgBoardConstants";
import { StaticBackground } from "../svgElements/StaticBackground";
import { View } from "./View";

export class GameProgressView extends View {
    private background: StaticBackground;

    public render(): void {
        const container = document.createElement("div");
        container.id = "svgContainer";
        this.rootElem.replaceChildren(container);

        const draw = SVG().addTo("#svgContainer").size(Constants.BOARD_SIZE * k, Constants.BOARD_SIZE * k);
        this.background = new StaticBackground(draw);
        this.background.render();
    }
    public removeListeners(): void { }
    public registerListeners(): void { }
}
