import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import { List } from "immutable";
import { CardElem } from "../models/cardElem";

const MOVE_CARD = "MOVE_CARD";
export interface IMoveCardIndex {
    dragIndex: number;
    hoverIndex: number;
}

export class CardAction {
    private d: Dispatcher;
    private firstHand: List<CardElem>;

    constructor(dispatcher: Dispatcher, firstHand: List<CardElem>) {
        this.d = dispatcher;
        this.firstHand = firstHand;
    }

    public moveCard(moveCardIndex: IMoveCardIndex) {
        this.d.push(MOVE_CARD, moveCardIndex);
    }

    public createProperty(): Bacon.Property<List<CardElem>, List<CardElem>> {
        return Bacon.update<List<CardElem>, IMoveCardIndex, List<CardElem>>(this.firstHand,
            [this.d.stream(MOVE_CARD)], this._moveCard.bind(this)
        );
    }

    private _moveCard(oldHand: List<CardElem>, moveCardIndex: IMoveCardIndex): List<CardElem> {
        const {dragIndex, hoverIndex} = moveCardIndex;
        const dragCard: CardElem = oldHand.get(dragIndex);
        return oldHand.splice(dragIndex, 1).splice(hoverIndex, 0, dragCard).toList();
    }
}