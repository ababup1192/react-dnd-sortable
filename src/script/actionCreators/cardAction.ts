import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import { List } from "Immutable";

const MOVE_CARD = "MOVE_CARD";
export interface IMoveCardIndex {
    dragIndex: number;
    hoverIndex: number;
}

export class CardAction {
    private d: Dispatcher;
    private firstHand: List<string>;

    constructor(dispatcher: Dispatcher, firstHand: List<string>) {
        this.d = dispatcher;
        this.firstHand = firstHand;
    }

    public moveCard(moveCardIndex: IMoveCardIndex) {
        this.d.push(MOVE_CARD, moveCardIndex);
    }

    public createProperty(): Bacon.Property<List<string>, List<string>> {
        return Bacon.update<List<string>, IMoveCardIndex, List<string>>(this.firstHand,
            [this.d.stream(MOVE_CARD)], this._moveCard.bind(this)
        );
    }

    private _moveCard(oldHand: List<string>, moveCardIndex: IMoveCardIndex): List<string> {
        const {dragIndex, hoverIndex} = moveCardIndex;
        const dragCard: string = oldHand.get(dragIndex);
        return oldHand.splice(dragIndex, 1).splice(hoverIndex, 0, dragCard).toList();
    }
}