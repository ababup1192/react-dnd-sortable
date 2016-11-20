import * as React from "react";
import * as ReactDOM from "react-dom";
import { List, Range } from "immutable";
import { CardTargetSource } from "./Card";
import { CardElem } from "../models/cardElem";
import { CardAction } from "../actionCreators/cardAction";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

interface IContainerProps {
    cards: List<CardElem>;
    cardAction: CardAction;
}

class Container extends React.Component<IContainerProps, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="container">
            {this.props.cards.map((card, idx) =>
                <CardTargetSource key={card.getId()}
                    index={idx}
                    card={card}
                    cardAction={this.props.cardAction} />
            )}
        </div>;
    }
}

export default DragDropContext(HTML5Backend)(Container);