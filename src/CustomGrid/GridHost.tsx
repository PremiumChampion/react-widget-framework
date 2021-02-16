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
import { ISerialisationInfo } from './Interfaces/ISerialisationInfo';

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
    const generateWidgetIndex = (unindexedWidgets: BaseWidget[], horizontal = true) =>
    {
        let itemIndex: { [id: string]: BaseWidget; } = {};

        unindexedWidgets = horizontal ? getWidgetsHorizontal(unindexedWidgets) : getWidgetsVertical(unindexedWidgets);
        unindexedWidgets.forEach(unindexedWidget =>
        {
            itemIndex[unindexedWidget.id] = unindexedWidget;
        });

        return itemIndex;
    };

    const getWidgetsHorizontal = (widgets?: BaseWidget[]) =>
    {
        if (!widgets) widgets = Object.values(_widgets);
        if (widgets.length > 0)
        {
            let mostRightElement: BaseWidget = widgets
                .sort((a, b) =>
                {
                    return (b.x + b.width) - (a.x + a.width);
                })[0];

            let colCount = mostRightElement.x + mostRightElement.width;
            return widgets.sort((a, b) =>
            {
                const calculatePosition = (widget: BaseWidget) =>
                {
                    return widget.x + 1 + widget.y * colCount;
                };

                return calculatePosition(a) - calculatePosition(b);
            });
        } else
        {
            return [];
        }
    };

    const getWidgetsVertical = (widgets?: BaseWidget[]) =>
    {
        if (!widgets) widgets = Object.values(_widgets);
        if (widgets.length > 0)
        {
            let mostBottomElement: BaseWidget = widgets
                .sort((a, b) =>
                {
                    return (b.y + b.height) - (a.y + a.height);
                })[0];

            let rowCount = mostBottomElement.x + mostBottomElement.width;

            return widgets.sort((a, b) =>
            {
                const calculatePosition = (widget: BaseWidget) =>
                {
                    return widget.y + 1 + widget.y * rowCount;
                };

                return calculatePosition(a) - calculatePosition(b);
            });
        } else
        {
            return [];
        }
    };

    // Apps and Widgets
    const [_widgets, _setWidgets] = useState(generateWidgetIndex(widgets));
    // Allow forced rerender
    const [_update, _forceUpdate] = useState(true);
    // Keeps tract of column size changes
    const [_prevColCount, _setPrevColCount] = useState(0);
    // Is initial render
    const [_initialRender, _setInitialRender] = useState(true);



    // set new widgets if props change
    useEffect(() =>
    {
        if (widgets)
        {
            _setWidgets(generateWidgetIndex(widgets));
            createCorrectLayout({width: _prevColCount, heigth: 0},false);
        }
    }, [widgets]);

    // find the lagest widget width
    const dynamicMinWidth = () =>
    {
        let max = Object.values(_widgets).map(widget => widget.width).sort((a, b) => b - a)[0] || 1;
        return max;
    };



    // creates the correct grid layout when the size chages or a widget collision occures
    const createCorrectLayout = (dimensions: IBoundaryInfo, boundaryCollission: boolean) =>
    {
        let grid = new CollisionCorrection(dimensions);
        let changes = false;
        if (!boundaryCollission)
        {
            getWidgetsHorizontal().forEach(widget =>
            {
                if (widget.hasPositionInfo(dimensions.width))
                {
                    widget.setPosition(widget.getWidgetPositionInfo(dimensions.width), dimensions.width, false);
                    changes = true;
                }
            });
        }
        // add everything to the table
        getWidgetsHorizontal().forEach(widget =>
        {
            grid.add(widget.getWidgetPositionInfo(dimensions.width));
        });

        grid.finalise();
        // retrieve position of the table
        getWidgetsHorizontal().forEach(widget =>
        {
            let position = grid.getPosition(widget.id);

            if (position !== null)
            {
                widget.setPosition({ ...position, heigth: widget.height, width: widget.width, id: widget.id }, dimensions.width, false);
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
            _widgets[itemPosition.i].setPosition({ x: itemPosition.x, y: itemPosition.y, width: itemPosition.w, heigth: itemPosition.h, id: itemPosition.i }, colCount, true);
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
        return JSON.stringify(Object.values(_widgets).map(widget => { return ({ WidgetType: widget.WidgetType, Serialisation: widget.serialize() } as ISerialisationInfo); }));
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
                const rowHeigth = colWidth * 0.9;
                const rowCount = Math.floor(dimensions.height / rowHeigth);


                // determines if the Grid has boundary colisions
                const gridHasBoundaryCollision = Object.values(_widgets).some(item => { return (item.x + item.width > colCount); });


                if (_initialRender || gridHasBoundaryCollision || _prevColCount !== colCount)
                {
                    // create a new layout if it is the initial render or collisions are detected or the columnCount changes
                    createCorrectLayout({ width: colCount, heigth: rowCount }, gridHasBoundaryCollision);
                }

                // First render has finished
                if (_initialRender) _setInitialRender(false);

                return (
                    <div>
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