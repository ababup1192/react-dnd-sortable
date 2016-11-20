// import Style Sheet
import "../style/main.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { List } from "immutable";

import Dispatcher from "./actionCreators/dispatcher";
import { CardElem } from "./models/cardElem";
import { CardAction } from "./actionCreators/CardAction";
import Container from "./components/Container";

const dispatcher = new Dispatcher();
const firstHand = List.of(
    new CardElem(1, "White a cool JS library"),
    new CardElem(2, "Make it generic enough"),
    new CardElem(3, "Write README"),
    new CardElem(4, "Create some examples"),
    new CardElem(5, "???")
);

const cardAction = new CardAction(dispatcher, firstHand);
const cardEvent: Bacon.Property<List<CardElem>, List<CardElem>> = cardAction.createProperty();

cardEvent.onValue((cards: List<CardElem>) => {
    ReactDOM.render(<Container
        cards={cards}
        cardAction={cardAction} />,
        document.getElementById("content")
    );
});
