import * as React from "react";
import * as ReactDOM from "react-dom";
import { List, Range } from "immutable";
import { flow } from "lodash";
import {
    DropTarget,
    DropTargetSpec,
    DropTargetCollector,
    DropTargetConnector,
    DropTargetMonitor,
    ConnectDropTarget,
    DragSource,
    DragSourceMonitor,
    DragSourceConnector,
    DragSourceSpec,
    ConnectDragSource,
} from "react-dnd";
import { ItemTypes } from "../constants";
import { CardElem } from "../models/cardElem";
import { CardAction } from "../actionCreators/CardAction";

interface ICardProps {
    index: number;
    card: CardElem;
    cardAction: CardAction;
}

interface ICardTargetProps {
    connectDropTarget: ConnectDropTarget;
}

interface ICardSourceProps {
    connectDragSource: ConnectDragSource;
    isDragging: boolean;
}

class Card extends React.Component<ICardProps &
    ICardSourceProps & ICardTargetProps, any> {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps: ICardProps & ICardSourceProps, nextState: any) {
        const card = this.props.card;
        const nextCard = nextProps.card;

        return card.equals(nextCard) === false ||
            this.props.isDragging !== nextProps.isDragging;
    }

    render() {
        const {card, connectDragSource, connectDropTarget, isDragging} = this.props;
        const opacity = isDragging ? "no-opacity" : "opacity";

        return connectDragSource(connectDropTarget(<div className={`card ${opacity}`} >
            {card.getText()}
        </div>));
    }
}

const cardSource: DragSourceSpec<ICardProps> = {
    beginDrag(props: ICardProps) {
        return {
            id: props.card.getId(),
            index: props.index
        };
    }
};

const cardTarget: DropTargetSpec<ICardProps> = {
    hover(props: ICardProps, monitor: DropTargetMonitor, component) {
        const dragIndex = (monitor.getItem() as any).index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.cardAction.moveCard({ dragIndex, hoverIndex });

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        (monitor.getItem() as any).index = hoverIndex;
    }
};

const dropTargetCollect = (connect: DropTargetConnector): ICardTargetProps => ({
    connectDropTarget: connect.dropTarget()
});


const dragSourceCollect = (connect: DragSourceConnector,
    monitor: DragSourceMonitor): ICardSourceProps => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
};

export const CardTargetSource: React.ComponentClass<ICardProps> = flow(
    DropTarget(ItemTypes.CARD, cardTarget, dropTargetCollect),
    DragSource(ItemTypes.CARD, cardSource, dragSourceCollect)
)(Card);