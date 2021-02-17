import { isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import "./BaseStyle.scss";
import { BaseWidget } from './BaseWidget';
import { CollisionCorrection } from './CollisionCorrection';
import { GridItemInternalRenderer } from './GridItemInternalRenderer';
import { IBoundaryInfo } from './Interfaces/IBoundaryInfo';
import { IGirdHostProps } from './Interfaces/IGirdHostProps';
import { ISerialisationInfo } from './Serialization/ISerialisationInfo';
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
    // is resizing
    const [_resizing, _setResizing] = useState(false);

    // creates the correct grid layout when the size chages or a widget collision occures
    const createCorrectLayout = (dimensions: IBoundaryInfo, boundaryCollission: boolean, widgets?: BaseWidget[]) =>
    {
        widgets = getWidgetsHorizontal(widgets);

        let grid = new CollisionCorrection(dimensions);
        let changes = false;
        if (!boundaryCollission)
        {
            widgets.forEach(widget =>
            {
                if (widget.hasPositionInfo(dimensions.width))
                {
                    widget.setPosition(widget.getWidgetPositionInfo(dimensions.width), dimensions.width);
                    changes = true;
                }
            });
        }
        // add everything to the table
        widgets.forEach(widget =>
        {
            grid.add(widget.getWidgetPositionInfo(dimensions.width));
        });

        grid.finalise();
        // retrieve position of the table
        widgets.forEach(widget =>
        {
            let position = grid.getPosition(widget.id);

            if (position !== null)
            {
                widget.setPosition({ ...position, heigth: widget.height, width: widget.width, userGenerated: false }, dimensions.width);
                changes = true;
            }
        });
        // force update
        if (changes) _forceUpdate(!_update);
    };

    // set new widgets if props change
    useEffect(() =>
    {
        _setInitialRender(true);
        if (widgets)
        {
            createCorrectLayout({ width: _prevColCount, heigth: 0 }, false, widgets);
            _setWidgets(generateWidgetIndex(widgets));
        }
    }, [widgets]);

    // find the lagest widget width
    const dynamicMinWidth = () =>
    {
        let max = Object.values(_widgets).map(widget => widget.width).sort((a, b) => b - a)[0] || 1;
        return max;
    };

    

    // the layout was changed by the user
    const onLayoutChange = (colCount: number, layout: GridLayout.Layout[]) =>
    {
        if(!_initialRender){

            layout.forEach(itemPosition =>
            {
                _widgets[itemPosition.i].setPosition({ x: itemPosition.x, y: itemPosition.y, width: itemPosition.w, heigth: itemPosition.h, userGenerated: !_resizing }, colCount);
            });
    
            if (props.onChange !== undefined)
            {
                props.onChange(serialize);
            }
    
            if (_resizing) _setResizing(false);
        }

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
                        onRemove={props.onRemoveWidget}
                    />
                </div>
            );
        }
        );
    };

    // serialize the grid
    const serialize = () =>
    {
        return JSON.stringify(Object.values(_widgets).map(widget => { return ({ Type: widget.WidgetType, Serialisation: widget.serialize() } as ISerialisationInfo); }));
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

                const resized = _prevColCount !== colCount;

                if (_initialRender || gridHasBoundaryCollision || resized)
                {
                    // create a new layout if it is the initial render or collisions are detected or the columnCount changes
                    createCorrectLayout({ width: colCount, heigth: rowCount }, gridHasBoundaryCollision);
                }

                if (resized || dimensions.width == 0)
                {
                    _setResizing(true);
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
                                draggableHandle={".IPI-DRAG"}
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