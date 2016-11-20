import { Record } from "immutable";

const CardElemRecord = Record({ id: -1, text: "" });

const ID = "id";
const TEXT = "text";

export class CardElem extends CardElemRecord {
    private id: number;
    private text: string;

    constructor(id: number, text: string) {
        super({ id: id, text: text });
    }

    getId(): number {
        return this.get(ID);
    }

    getText(): string {
        return this.get(TEXT);
    }
}