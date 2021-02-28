import * as React from "react";
import { IGridItemInternalProps } from './Interfaces/IGridItemInternalProps';
import styles from "./BaseStyle.module.scss";
export const WidgetInternalRenderer = (props: IGridItemInternalProps) =>
{
    const [, _forceUpdate] = React.useReducer(x => x + 1, 0);

    const removeWidget = () =>
    {
        if (props.onRemove !== undefined)
        {
            props.item.onRemove();
            props.onRemove(props.item);
        }
    };

    props.item.remove = removeWidget;

    props.item.forceWidgetUpdate = () => { _forceUpdate(undefined); };


    return (
        <div className={[styles["item"], props.item.isDraggable ? props.item.draggableIndicatorClassName : "", "TS-PREVIEW"].join(" ")}>
            <div className={styles['item-comtent']}>
                <div className={styles["card"]}>
                    <div className={`${ styles["WIDGET-CONTENT"] } ${ (props.item.contentDragable && props.item.isDraggable) ? "WIDGET-DRAG " : "" }`} id={props.item.id}>
                        {props.item.render()}
                    </div>
                    {props.item.allowDeletion &&
                        <div className={styles["remove"]}>
                            <i className="material-icons" onMouseDown={removeWidget}>&#xE5CD;</i>
                        </div>
                    }
                    {props.item.displayDragHandle && props.item.isDraggable &&
                        <div className={styles['WIDGET-DRAG-HANDLE'] + " WIDGET-DRAG"}>
                            <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M13,11H18L16.5,9.5L17.92,8.08L21.84,12L17.92,15.92L16.5,14.5L18,13H13V18L14.5,16.5L15.92,17.92L12,21.84L8.08,17.92L9.5,16.5L11,18V13H6L7.5,14.5L6.08,15.92L2.16,12L6.08,8.08L7.5,9.5L6,11H11V6L9.5,7.5L8.08,6.08L12,2.16L15.92,6.08L14.5,7.5L13,6V11Z" />
                            </svg>
                        </div>
                    }
                </div>
                {props.item.notificationCount > 0 &&
                    <div className={styles["WIDGET-NOTIFICATION-BUBBLE"]}>
                        <div>
                            <p>{props.item.generateNotificationBubbleText()} </p>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};