import * as React from "react";
import * as ReactDOM from "react-dom";
import { List, Range } from "immutable";
import { CardAction } from "../actionCreators/cardAction";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

interface IContainerProps {
    hand: List<string>;
    cardAction: CardAction;
    cardEvent: Bacon.Property<List<string>, List<string>>;
}

class Container extends React.Component<IContainerProps, any> {
    constructor(props) {
        super(props);
    }

    render() {
        <div className="container">
        {
            this.props.hand.map((card, i) =>
                
            );
        }

        return <div className="board">
            {squares}
        </div>;
    }
}

export default DragDropContext(HTML5Backend)(Container);