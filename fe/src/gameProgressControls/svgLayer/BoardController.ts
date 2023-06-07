// import { Svg } from "@svgdotjs/svg.js";
// import { centers, homeCenters } from "../utils/fieldCenters";
// import { Field } from "./elements/Field";
// import { Figure } from "./elements/Figure";
// import { StaticBackground } from "./elements/StaticBackground";
// import App from "../App";
// import { Dice } from "./elements/Dice";
// import { Overlay } from "./elements/Overlay";
// import { DicePlayButton } from "./elements/DicePlayButton";
// import { SocketIOClientInstance } from "../socketio/SocketClient";
// import { NoMovesModal } from "./elements/NoMovesModal";
// import { NextPlayerButton } from "./elements/NextPlayerButton";
// import { Loading } from "./elements/Loading";
// import { GameProgress } from "../facades/GameProgress";
// import { objectCompare } from "../utils/common";
// import { SvgBoardStates } from "../types/state/SvgBoardStates";
// import { SvgElements } from "../types/svgLayer/SvgElements";
// // import { GameElementsDict } from "../types/svgLayer/GameElementsDict";
// import { GameProgressDataset } from "../types/data/GameProgressDataset";
// import { PlayerColors, PlayersOrder } from "../types/common/PlayerColors";
// import { GameProgressUpdate } from "../types/data/GameProgressUpdate";
// import { FigureDataset } from "../types/data/FigureDataset";
// import { FieldDataset } from "../types/data/FieldDataset";
// import { DocumentClickData } from "../types/state/DocumentClickData";
// type GameElementsDict = Record<string, any>
//
// export class BoardController {
//     private readonly draw: Svg;
//     private boardState: SvgBoardStates;
//     private gameProgress: GameProgress;
//     private gameElementsDict: GameElementsDict
//
//     constructor(draw: Svg) {
//         this.draw = draw;
//         this.boardState = SvgBoardStates.LOADING;
//         this.init();
//         this.gameProgress = new GameProgress()
//     }
//
//     public setProgress(progress: GameProgressDataset) {
//         this.gameProgress.setDataset(progress)
//     }
//
//     public setSvgProgress(progress: GameProgressDataset) {
//         this.gameProgress.setDataset(progress)
//
//         PlayersOrder.forEach((color: PlayerColors) => {
//             for (let i = 0; i < 4; i++) {
//                 const progressPosition = progress.playerStatuses[color].figures[i];
//                 const field = this.getFieldByFieldDataset(progressPosition)
//                 this.gameElementsDict[SvgElements.FIGURES][color][i].setField(field);
//                 this.gameElementsDict[SvgElements.FIGURES][color][i].render();
//             }
//         })
//     }
//
//     public renderLoadedProgress(progress: GameProgressDataset) {
//         this.gameElementsDict.OVERLAY.clear()
//         this.gameElementsDict.LOADING.clear()
//         this.setSvgProgress(progress)
//         this.displayDice()
//     }
//
//     public displayDice() {
//         if (this.gameProgress.getCurrentPlayerId() === App.getUserInfo().userId) {
//             this.boardState = SvgBoardStates.DICE;
//             this.gameElementsDict.OVERLAY.render();
//             this.gameElementsDict.DICE.render();
//         } else {
//             this.boardState = SvgBoardStates.WAITING
//         }
//     }
//
//     private init() {
//         const background = new StaticBackground(this.draw)
//         const startFields = {} as Record<PlayerColors, Field[]>
//         const homeFields = {} as Record<PlayerColors, Field[]>
//         const figures = {} as Record<PlayerColors, Figure[]>
//         const mainFields = [] as Field[]
//
//         for (let i = 0; i < 40; i++) {
//             mainFields[i] = new Field(this.draw, {
//                 index: i,
//                 color:
//                     i % 10 === 0 ? (`${Math.floor(i / 10)}` as PlayerColors) : null,
//                 isHome: false,
//                 isStart: false,
//             });
//         }
//
//         PlayersOrder.forEach((playerColor, index) => {
//             const path = [] as Field[]
//             const pathStart = index * 10;
//             for (let i = 0; i < 40; i++) {
//                 const field = /*this.*/mainFields[(pathStart + i) % 40];
//                 path.push(field);
//             }
//
//             startFields[playerColor] = [];
//             homeFields[playerColor] = [];
//             figures[playerColor] = [];
//
//             for (let i = 0; i < 4; i++) {
//                 const homeField = new Field(this.draw, {
//                     index: i,
//                     color: playerColor,
//                     isHome: true,
//                     isStart: false,
//                 });
//                 const startField = new Field(this.draw, {
//                     index: i,
//                     color: playerColor,
//                     isHome: false,
//                     isStart: true,
//                 });
//
//                 homeFields[playerColor].push(homeField);
//                 startFields[playerColor].push(startField);
//                 path.push(homeField)
//             }
//
//             for (let i = 0; i < 4; i++) {
//                 const figure = new Figure(this.draw, { color: playerColor, index: i }, startFields[playerColor][i]);
//                 figure.setPath(path)
//                 figures[playerColor].push(figure);
//             }
//         });
//
//         this.gameElementsDict = {
//             [SvgElements.BACKGROUND]: background,
//             [SvgElements.MAIN_FIELDS]: mainFields,
//             [SvgElements.START_FIELDS]: startFields,
//             [SvgElements.HOME_FIELDS]: homeFields,
//             [SvgElements.FIGURES]: figures,
//             [SvgElements.OVERLAY]: new Overlay(this.draw),
//             [SvgElements.DICE]: new Dice(this.draw),
//             [SvgElements.DICE_PLAY_BUTTON]: new DicePlayButton(this.draw),
//             [SvgElements.NO_MOVES_MODAL]: new NoMovesModal(this.draw),
//             [SvgElements.NEXT_PLAYER_BUTTON]: new NextPlayerButton(this.draw),
//             [SvgElements.LOADING]: new Loading(this.draw)
//         }
//     }
//
//     public render() {
//         this.boardState = SvgBoardStates.LOADING
//         this.renderStatic()
//         this.gameElementsDict.OVERLAY.render()
//         this.gameElementsDict.LOADING.render()
//         this.gameElementsDict.LOADING.runAnimation()
//     }
//
//     private renderStatic() {
//         this.gameElementsDict.BACKGROUND.render();
//         for (let i = 0; i < 40; i++) {
//             this.gameElementsDict.MAIN_FIELDS[i].render();
//         }
//         PlayersOrder.forEach((playerColor) => {
//             for (let i = 0; i < 4; i++) {
//                 this.gameElementsDict.START_FIELDS[playerColor][i].render();
//                 this.gameElementsDict.HOME_FIELDS[playerColor][i].render();
//                 this.gameElementsDict.FIGURES[playerColor][i].render();
//             }
//         });
//     }
//
//     public async handleClick(data: DocumentClickData) {
//         console.log(data)
//         if (data.dice && this.boardState === SvgBoardStates.DICE) {
//             this.boardState = SvgBoardStates.DICE_ANIMATION
//             await this.gameElementsDict.DICE.animateDotsSequence(this.gameProgress.getLastDiceSequence());
//             this.boardState = SvgBoardStates.DICE_PLAY_BUTTON;
//             this.gameElementsDict.DICE_PLAY_BUTTON.render();
//             this.gameElementsDict.DICE.animateMoveUp();
//             this.gameElementsDict.DICE_PLAY_BUTTON.animateMoveDown();
//             return;
//         }
//         if (data.playButton && this.boardState === SvgBoardStates.DICE_PLAY_BUTTON) {
//             this.boardState = SvgBoardStates.HIGHLIGHT_ANIMATION;
//             this.gameElementsDict.DICE.clear();
//             this.gameElementsDict.DICE_PLAY_BUTTON.clear();
//             this.gameElementsDict.OVERLAY.clear();
//             this.showMoveOptions();
//             return;
//         }
//
//         if (this.boardState === SvgBoardStates.HIGHLIGHT_ANIMATION && (data.field || data.figure)) {
//             this.boardState = SvgBoardStates.CURRENT_PLAYER_FIGURE_MOVE_ANIMATION
//             let field
//             let srcFigure = null as Figure | null
//             let destFigure = null as Figure | null
//
//             if (data.field) {
//                 field = this.getFieldByFieldDataset(data.field)
//                 srcFigure = this.getFigureByNextField(field)
//                 const destFigureDataset = this.gameProgress.getFigureByField(data.field)
//                 destFigure = destFigureDataset ? this.getFigureByFigureDataset(destFigureDataset) : null
//             } else {
//                 destFigure = this.getFigureByFigureDataset(data.figure)
//                 field = destFigure.getField()
//                 srcFigure = this.getFigureByNextField(field)
//             }
//             if (!srcFigure) {
//                 return
//             }
//
//             this.stopAllHighlightAnimations()
//             const updates: GameProgressUpdate[] = []
//
//             if (destFigure) {
//                 const startField = this.getFreeStartField(destFigure.getDataset().color)
//                 updates.push({
//                     type: "KICK",
//                     prevField: srcFigure.getField().getDataset(),
//                     nextField: field.getDataset()
//                 })
//
//                 updates.push({
//                     type: "MOVE",
//                     prevField: destFigure.getField().getDataset(),
//                     nextField: startField.getDataset()
//                 })
//                 console.log('updates', updates)
//                 console.log('emit CLIENT_GAME_PROGRESS_UPDATE');
//
//                 SocketIOClientInstance.socket.emit("CLIENT_GAME_PROGRESS_UPDATE", updates)
//                 console.log('kick', field);
//                 await srcFigure.animateKickSequence(field)
//                 console.log('move', startField);
//
//                 await destFigure.animateMoveSequence(startField)
//             } else {
//                 updates.push({
//                     type: "MOVE",
//                     prevField: srcFigure.getField().getDataset(),
//                     nextField: field.getDataset()
//                 })
//                 console.log('emit CLIENT_GAME_PROGRESS_UPDATE');
//
//                 SocketIOClientInstance.socket.emit("CLIENT_GAME_PROGRESS_UPDATE", updates)
//                 await srcFigure.animateMoveSequence(field)
//             }
//             this.boardState = SvgBoardStates.WAITING
//         }
//
//         if (this.boardState === SvgBoardStates.NO_MOVES_MODAL && data.nextPlayerButton) {
//             this.gameElementsDict.NO_MOVES_MODAL.clear()
//             this.gameElementsDict.NEXT_PLAYER_BUTTON.clear()
//             this.gameElementsDict.OVERLAY.clear()
//             this.boardState = SvgBoardStates.WAITING
//             console.log('emit CLIENT_GAME_PROGRESS_UPDATE');
//
//             SocketIOClientInstance.socket.emit("CLIENT_GAME_PROGRESS_UPDATE", [])
//         }
//     }
//
//     private showMoveOptions() {
//         const userInfo = App.getUserInfo();
//         const move = this.gameProgress.getLastDiceSequence()[this.gameProgress.getLastDiceSequence().length - 1]
//
//         const playerFigures = this.gameElementsDict.FIGURES[userInfo.color];
//         const availableFields = [] as Field[];
//         for (let i = 0; i < 4; i++) {
//             const currentFigure = playerFigures[i]
//             const nextField = currentFigure.computeNextField(move)
//             if (nextField && !availableFields.includes(nextField)) {
//                 const figureDataset = this.gameProgress.getFigureByField(nextField.getDataset());
//                 if (figureDataset) {
//                     const figure = this.getFigureByFigureDataset(figureDataset)
//                     figure.highlightAnimationStart();
//                 }
//                 nextField.highlightAnimationStart();
//                 availableFields.push(nextField);
//                 currentFigure.setNextField(nextField)
//             }
//         }
//         if (!availableFields.length) {
//             this.boardState = SvgBoardStates.NO_MOVES_MODAL
//             this.gameElementsDict.OVERLAY.render()
//             this.gameElementsDict.NO_MOVES_MODAL.render()
//             this.gameElementsDict.NEXT_PLAYER_BUTTON.render()
//             this.gameElementsDict.NO_MOVES_MODAL.moveDown()
//             this.gameElementsDict.NEXT_PLAYER_BUTTON.moveDown()
//         }
//     }
//
//     public async animateUpdates(updates: GameProgressUpdate[]) {
//         if (this.boardState === SvgBoardStates.CURRENT_PLAYER_FIGURE_MOVE_ANIMATION) {
//             this.boardState = SvgBoardStates.WAITING
//             return
//         }
//         this.boardState = SvgBoardStates.NEXT_PLAYER_FIGURE_MOVE_ANIMATION
//         for (const update of updates) {
//             const nextField = this.getFieldByFieldDataset(update.nextField)
//             const prevFigureDataset = this.gameProgress.getFigureByField(update.prevField)
//             const nextFigureDataset = this.gameProgress.getFigureByField(update.nextField)
//             // const nextFigure = this.getFigureByField(nextField)
//             if (!prevFigureDataset) {
//                 console.log('prev');
//
//                 throw new Error("TODO")
//             }
//             const prevFigure = this.getFigureByFigureDataset(prevFigureDataset)
//             if (update.type === "MOVE") {
//                 await prevFigure.animateMoveSequence(nextField)
//                 // animationFunctions.push(prevFigure.animateMoveSequence.bind(prevFigure, nextField))
//                 //animationFunctions.push(bind(prevFigure.animateMoveSequence, prevFigure, nextField))
//             } else if (update.type === 'KICK') {
//                 await prevFigure.animateKickSequence(nextField)
//
//                 /* const nextFigureDataset = this.gameProgress.getFigureByField(update.nextField)
//                 if (!nextFigureDataset) {
//                     console.log('next');
//
//                     throw new Error('TODO');
//                 }
//                 const nextFigure = this.getFigureByFigureDataset(nextFigureDataset)
//                 // throw new Error('not implemented')
//                 await nextFigure.animateKickSequence(nextField)
//                 /*if (!nextFigure) {
//                     throw new Error('test')
//                 } */
//                 //await nextFigure.animateMoveSequence(nextField)
//                 // animationFunctions.push(nextFigure.animateMoveSequence.bind(nextFigure, nextField))
//                 // animationFunctions.push(bind(nextFigure.animateMoveSequence, nextFigure, nextField)) */
//             }
//         }
//         /* for (const animationFunction of animationFunctions) {
//             console.log(animationFunction.__boundThis__)
//             console.log(animationFunction.__boundArgs__)
//             console.log('--------')
//             animationFunction()
//         } */
//         // this.displayDice()
//     }
//
//     private getFigureByNextField(field: Field): Figure | null {
//         for (let i = 0; i < 4; i++) {
//             const color = PlayersOrder[i]
//             for (let j = 0; j < 4; j++) {
//                 const figure = this.gameElementsDict.FIGURES[color][j]
//
//                 if (figure.getNextField() === field) {
//                     return figure
//                 }
//             }
//         }
//         return null;
//     }
//
//     private getFigureByFigureDataset(figure: FigureDataset) {
//         return this.gameElementsDict.FIGURES[figure.color][figure.index]
//     }
//
//     private getFieldByFieldDataset(field: FieldDataset): Field {
//         if (field.isHome) {
//             return this.gameElementsDict.HOME_FIELDS[field.color][field.index]
//         }
//         if (field.isStart) {
//             return this.gameElementsDict.START_FIELDS[field.color][field.index]
//         }
//         return this.gameElementsDict.MAIN_FIELDS[field.index]
//     }
//
//     private stopAllHighlightAnimations() {
//         for (let i = 0; i < 40; i++) {
//             this.gameElementsDict.MAIN_FIELDS[i].highlightAnimationStop()
//         }
//
//         PlayersOrder.forEach(playerColor => {
//             for (let i = 0; i < 4; i++) {
//                 this.gameElementsDict.HOME_FIELDS[playerColor][i].highlightAnimationStop()
//                 this.gameElementsDict.START_FIELDS[playerColor][i].highlightAnimationStop()
//                 this.gameElementsDict.FIGURES[playerColor][i].highlightAnimationStop()
//             }
//         })
//     }
//
//     private getFreeStartField(color: PlayerColors) {
//         const startFields = [...this.gameElementsDict.START_FIELDS[color]] as (Field | null)[]
//
//         for (let i = 0; i < 4; i++) {
//             const figure = this.gameElementsDict.FIGURES[color][i]
//             console.log('+++++++++++++++++++++++', i);
//
//             for (let j = 0; j < 4; j++) {
//                 if (!startFields[j]) {
//                     continue
//                 }
//                 const figureFieldDataset = figure.getField().getDataset()
//                 const startFieldDataset = startFields[j].getDataset()
//                 console.log('------------');
//                 console.log(figureFieldDataset);
//
//                 console.log(startFieldDataset);
//                 console.log('/************   ', objectCompare(figureFieldDataset, startFieldDataset), '   ************/');
//
//
//                 if (objectCompare(figureFieldDataset, startFieldDataset)) {
//                     startFields[j] = null
//                 }
//             }
//             console.log(startFields);
//         }
//
//         return startFields[0] || startFields[1] || startFields[2] || startFields[3]
//     }
// }
//
// // @ts-ignore
// function bind(fn, boundThis, ...args) {
//     const bound = fn.bind(boundThis, ...args)
//     bound.__targetFunction__ = fn;
//     bound.__boundThis__ = boundThis;
//     bound.__boundArgs__ = args
//     return bound;
// }
