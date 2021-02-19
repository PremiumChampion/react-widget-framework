import React, { useEffect, useReducer, useState } from "react";
import { IGridItemInternalProps } from './Interfaces/IGridItemInternalProps';

export const GridItemInternalRenderer = (props: IGridItemInternalProps) =>
{
    const [_notificationBubbleText, _setNotificationBubbleText] = useState("");
    const [_updateVersion, _forceUpdate] = useReducer(x => x + 1, 0);

    const onRemove = () =>
    {
        if (props.onRemove !== undefined)
        {
            props.item.onRemove();
            props.onRemove(props.item);
        }
    };

    props.item.componentUpdate = _forceUpdate;

    const generateNotificationBubbleText = () =>
    {
        let text = props.item.notificationCount + "";
        
        if (props.item.notificationCount > 9)
        {
            text = "9+";
        }
        if (props.item.notificationCount > 25)
        {
            text = "25+";
        }

        if (props.item.notificationCount > 50)
        {
            text = "50+";
        }
        if (props.item.notificationCount > 100)
        {
            text = "100+";
        }
        if (props.item.notificationCount > 999)
        {
            text = "999+";
        }

        return text;
    };


    return (
        <div key={_updateVersion + ""} className={["item", props.item.isDraggable ? props.item.draggableIndicatorClassName : "", "TS_PREVIEW"].join(" ")}>
            <div className="item-content">
                <div className="card">
                    <div className={`IPI_CONTENT ${ props.item.contentDragable ? "IPI-DRAG " : "" }`} id={props.item.id}>
                        {props.item.render()}
                    </div>
                    {props.item.allowDeletion &&
                        <div className="remove">
                            <i className="material-icons" onMouseDown={onRemove}>&#xE5CD;</i>
                        </div>
                    }
                    {props.item.displayDragHandle && props.item.isDraggable &&
                        <div className="IPI-DRAG IPI-DRAG-HANDLE">
                            <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M13,11H18L16.5,9.5L17.92,8.08L21.84,12L17.92,15.92L16.5,14.5L18,13H13V18L14.5,16.5L15.92,17.92L12,21.84L8.08,17.92L9.5,16.5L11,18V13H6L7.5,14.5L6.08,15.92L2.16,12L6.08,8.08L7.5,9.5L6,11H11V6L9.5,7.5L8.08,6.08L12,2.16L15.92,6.08L14.5,7.5L13,6V11Z" />
                            </svg>
                        </div>
                    }
                </div>
                {props.item.notificationCount > 0 &&
                    <div className="IPI-NOTIFICATION_BUBBLE">
                        <div>
                            <p>{generateNotificationBubbleText()}</p>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};