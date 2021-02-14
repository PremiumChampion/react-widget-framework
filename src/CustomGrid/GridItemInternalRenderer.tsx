import React from "react";
import { IGridItemInternalProps } from './Interfaces/IGridItemInternalProps';

export const GridItemInternalRenderer = (props: IGridItemInternalProps) =>
{
    const item = props.item;

    const onRemove = () =>
    {
        item.onRemove();
    };

    return (
        <div className={`item`}>
            <div className="item-content">
                <div className="card">
                    <div className={`IPI_CONTENT ${ item.contentDragable ? "IPI-DRAG" : "" }`}>
                        {item.render()}
                    </div>
                    {item.allowDeletion &&
                        <div className="remove">
                            <i className="material-icons" onMouseDown={onRemove}>&#xE5CD;</i>
                        </div>
                    }
                    {item.displayDragHandle &&
                        <div className="IPI-DRAG IPI-DRAG-HANDLE">
                            <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M13,11H18L16.5,9.5L17.92,8.08L21.84,12L17.92,15.92L16.5,14.5L18,13H13V18L14.5,16.5L15.92,17.92L12,21.84L8.08,17.92L9.5,16.5L11,18V13H6L7.5,14.5L6.08,15.92L2.16,12L6.08,8.08L7.5,9.5L6,11H11V6L9.5,7.5L8.08,6.08L12,2.16L15.92,6.08L14.5,7.5L13,6V11Z" />
                            </svg>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};