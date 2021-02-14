import { isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import { BaseWidget } from './BaseWidget';
import "./BaseStyle.scss";
import { CollisionCorrection } from './CollisionCorrection';
import { GridItemInternalRenderer } from './GridItemInternalRenderer';
import { IBoundaryInfo } from './Interfaces/IBoundaryInfo';
import { IGirdHostProps } from './Interfaces/IGirdHostProps';
import { ResizeContext } from './UseResize';

/**
 *
 *
 * @param {IGirdHostProps} props
 * @return {*} 
 */
export const GridHost = (props: IGirdHostProps) =>
{
    const { widgets } = props;

    // creates the widget index
    const generateWidgetIndex = (unindexedWidgets: BaseWidget[]) =>
    {
        let itemIndex: { [id: string]: BaseWidget; } = {};
        unindexedWidgets.forEach(unindexedWidget =>
        {
            itemIndex[unindexedWidget.id] = unindexedWidget;
        });
        return itemIndex;
    };

    // Apps and Widgets
    const [_widgets, _setWidgets] = useState(generateWidgetIndex(widgets));
    // Allow forced rerender
    const [_update, _forceUpdate] = useState(true);
    // Keeps tract of column size changes
    const [_prevColCount, _setPrevColCount] = useState(0);

    // find the lagest widget width
    const dynamicMinWidth = () =>
    {
        let max = Object.values(_widgets).map(widget => widget.width).sort((a, b) => b - a)[0] || 1;
        return max;
    };

    // set new widgets if props change
    useEffect(() =>
    {
        if (widgets)
        {
            _setWidgets(generateWidgetIndex(widgets));
        }
    }, [widgets]);

    // creates the correct grid layout when the size chages or a widget collision occures
    const createCorrectLayout = (dimensions: IBoundaryInfo, boundaryCollission: boolean) =>
    {
        let grid = new CollisionCorrection(dimensions);
        let changes = false;
        if (!boundaryCollission)
        {
            Object.values(_widgets).forEach(widget =>
            {
                if (widget.hasPositionInfo(dimensions.width))
                {
                    widget.setPosition(widget.getWidgetPositionInfo(dimensions.width), dimensions.width);
                    changes = true;
                }
            });
        }
        // add everything to the table
        Object.values(_widgets).forEach(widget =>
        {
            grid.add(widget.getWidgetPositionInfo(dimensions.width));
        });

        grid.finalise();
        // retrieve position of the table
        Object.values(_widgets).forEach(widget =>
        {
            let position = grid.getPosition(widget.id);
            if (position !== null)
            {
                widget.setPosition({ ...position, heigth: widget.height, width: widget.width, id: widget.id }, dimensions.width);
                changes = true;
            }
        });
        // set new 
        if (changes) _forceUpdate(!_update);
    };

    // the layout was changed by the user
    const onLayoutChange = (colCount: number, layout: GridLayout.Layout[]) =>
    {
        layout.forEach(itemPosition =>
        {
            _widgets[itemPosition.i].setPosition({ x: itemPosition.x, y: itemPosition.y, width: itemPosition.w, heigth: itemPosition.h, id: itemPosition.i }, colCount);
        });
    };

    // renders the widgets
    const renderWidgets = () =>
    {
        return Object.values(_widgets).map((item) =>
        {
            return (
                <div
                    data-grid={item.getGridData()}
                    key={item.id}
                >
                    <GridItemInternalRenderer
                        item={item}
                    />
                </div>
            );
        }
        );
    };

    // serialize the grid
    const serialize = () =>
    {
        return JSON.stringify(Object.values(_widgets).map(widget => widget.serialize()));
    };

    if (!isNil(props.useSerialisation))
    {
        props.useSerialisation(serialize);
    }



    return (
        <ResizeContext.Consumer>
            {dimensions =>
            {
                // calculate the availabe columns
                let colCount = Math.floor(dimensions.width / 100);
                const minCols = dynamicMinWidth();

                if (colCount < minCols)
                {
                    colCount = minCols;
                }

                if (_prevColCount !== colCount)
                {
                    _setPrevColCount(colCount);
                }
                // calculate the min container width
                let minContainerWidth = colCount * 100;
                let colWidth = Math.floor(dimensions.width / colCount);
                if (minContainerWidth < colWidth) colWidth = minContainerWidth;

                // calculate the row height
                const rowHeigth = Math.floor(colWidth * 0.9);
                const rowCount = Math.floor(dimensions.height / rowHeigth);

                // determines if the Grid has boundary colisions
                const gridHasBoundaryCollission = Object.values(_widgets).some(item => { return (item.x + item.width > colCount); });

                if (gridHasBoundaryCollission || _prevColCount !== colCount)
                {
                    // if collisions are detected create a new layout
                    createCorrectLayout({ width: colCount, heigth: rowCount }, gridHasBoundaryCollission);
                }

                return (
                    <div
                        style={{ width: `${ colCount * Math.floor(colWidth) }px`, overflow: "auto" }}
                    >
                        {_update &&
                            <GridLayout
                                className="layout"
                                cols={colCount}
                                rowHeight={rowHeigth}
                                width={dimensions.width}
                                isBounded
                                autoSize
                                draggableHandle={".IPI-DRAG"}
                                compactType={"horizontal"}
                                onLayoutChange={onLayoutChange.bind(undefined, colCount)}
                            >
                                {renderWidgets()}
                            </GridLayout>
                        }
                        {!_update &&
                            <GridLayout
                                className="layout"
                                cols={colCount}
                                rowHeight={rowHeigth}
                                width={dimensions.width}
                                isBounded
                                draggableHandle={".IPI-DRAG"}
                                compactType={"horizontal"}
                                onLayoutChange={onLayoutChange.bind(undefined, colCount)}
                            >
                                {renderWidgets()}
                            </GridLayout>
                        }
                    </div>
                );
            }}
        </ResizeContext.Consumer>
    );
};