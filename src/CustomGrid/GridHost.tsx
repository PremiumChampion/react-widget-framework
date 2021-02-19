import { isNil } from 'lodash';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import GridLayout, { ReactGridLayoutProps } from 'react-grid-layout';
import "./BaseStyle.scss";
import { BaseWidget } from './BaseWidget';
import { CollisionCorrection } from './CollisionCorrection';
import { GridItemInternalRenderer } from './GridItemInternalRenderer';
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
        }
        else
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
        }
        else
        {
            return [];
        }
    };

    // Apps and Widgets
    const [_widgets, _setWidgets] = useState(generateWidgetIndex(props.widgets));
    // Allow forced rerender
    // const [_update, _forceUpdate] = useState(true);
    // Keeps tract of column size changes
    const [_prevColCount, _setPrevColCount] = useState(0);
    // Is initial render
    const [_initialRender, _setInitialRender] = useState(true);
    // is resizing
    const [_resizing, _setResizing] = useState(false);
    // function to force an update
    const [_updateVersion, _forceUpdate] = useReducer(x => x + 1, 0);
    // contains the parents dimensions
    const dimensions = useContext(ResizeContext);

    // creates the correct grid layout when the size chages or a widget collision occures
    const createCorrectLayout = (columnCount: number, boundaryCollission: boolean, widgets?: BaseWidget[], lastItemId?: string) =>
    {
        widgets = getWidgetsHorizontal(widgets);

        let grid = new CollisionCorrection(columnCount);
        let changes = false;
        if (!boundaryCollission)
        {
            widgets.forEach(widget =>
            {
                if (widget.hasPositionInfo(columnCount))
                {
                    widget.setPosition(widget.getWidgetPositionInfo(columnCount), columnCount);
                    changes = true;
                }
            });
        }
        // add everything to the table
        widgets.forEach(widget =>
        {
            grid.add(widget.getWidgetPositionInfo(columnCount), lastItemId === widget.id);
        });

        grid.finalise();
        // retrieve position of the table
        widgets.forEach(widget =>
        {
            let position = grid.getPosition(widget.id);

            if (position !== null)
            {
                widget.setPosition({ ...position, heigth: widget.height, width: widget.width, userGenerated: false }, columnCount);
                changes = true;
            }
        });
        // force update
        if (changes) _forceUpdate();
    };

    // props changed
    useEffect(() =>
    {
        if (props.widgets && (props.widgets.some(widget => _widgets[widget.id] !== widget) || props.widgets.length !== Object.keys(_widgets).length))
        {
            // get the ids of the new wigets
            const newWidgetIds = props.widgets.map(i => i.id).filter(widgetId => Object.keys(_widgets).indexOf(widgetId) === -1);

            let lastWidgetId: string | undefined;

            if (newWidgetIds.length > 0) lastWidgetId = newWidgetIds[newWidgetIds.length - 1];

            // sets the first render with new widgets
            _setInitialRender(true);
            // create the correect grid layout
            createCorrectLayout(_prevColCount, false, props.widgets, lastWidgetId);
            // update widgets
            _setWidgets(generateWidgetIndex(props.widgets));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    // find the lagest widget width
    const dynamicMinWidth = () =>
    {
        let max = Object.values(_widgets).map(widget => widget.width).sort((a, b) => b - a)[0] || 1;
        return max;
    };



    // the layout was changed by the user
    const onLayoutChange = (colCount: number, layout: GridLayout.Layout[]) =>
    {
        if (!_initialRender)
        {
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

    // serialize the grid
    const serialize = () =>
    {
        return JSON.stringify(Object.values(_widgets).map(widget =>
        {
            widget.onBeforeSerilisation();
            return (
                { Type: widget.WidgetType, Serialisation: widget.serialize() } as ISerialisationInfo
            );
        }));
    };

    if (!isNil(props.useSerialisation))
    {
        props.useSerialisation(serialize);
    }
    const minWidgetWidth = 108;

    // calculate the availabe columns
    let colCount = Math.floor(dimensions.width / minWidgetWidth);

    // ensure that the column count is greater or equal to the width of the widest widget
    const minCols = dynamicMinWidth();

    if (colCount < minCols)
    {
        colCount = minCols;
    }

    const resized = _prevColCount !== colCount;

    // set new column count if resized
    if (resized) _setPrevColCount(colCount);
    // calculate the min container width
    let minParentContainerWidth = colCount * minWidgetWidth;
    let colWidth = Math.floor(dimensions.width / colCount);

    if (minParentContainerWidth < colWidth) colWidth = minParentContainerWidth;

    // the value of the distance inbetween the widgets
    const gridMarginValue = 15;
    // calculate the row height
    const rowHeigth = colWidth * ((minWidgetWidth - gridMarginValue) / minWidgetWidth);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const rowCount = Math.floor(dimensions.height / rowHeigth);

    // determines if the Grid has boundary colisions
    const gridHasBoundaryCollision = Object.values(_widgets).some(item => { return (item.x + item.width > colCount); });

    if (_initialRender || gridHasBoundaryCollision || resized)
    {
        // create a new layout if it is the initial render or collisions are detected or the columnCount changes
        createCorrectLayout(colCount, gridHasBoundaryCollision);
    }

    if (resized || dimensions.width === 0)
    {
        _setResizing(true);
    }

    // renders the widgets
    const renderWidgets = () =>
    {
        return Object.values(_widgets).map((item) =>
        {
            item._forceGridUpdate = () =>
            {
                _forceUpdate();
            };
            

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
        });
    };

    var _previewSet = false;

    // Renders a item placeholder for the dropping zone
    const renderPlaceholder = (layout: GridLayout.Layout[], oldItem: GridLayout.Layout, newItem: GridLayout.Layout, _placeholder: GridLayout.Layout, event: MouseEvent, element: HTMLElement) =>
    {
        if (!_previewSet)
        {
            let placeholder = document.querySelector(".react-grid-item.react-grid-placeholder");
            if (placeholder?.childElementCount === 1) placeholder?.insertAdjacentHTML('afterbegin', element.querySelector(".TS_PREVIEW")?.outerHTML + "");
        }
    };


    const GridLayoutProps: ReactGridLayoutProps = {
        cols: colCount,
        rowHeight: rowHeigth,
        width: dimensions.width,
        isBounded: true,
        draggableHandle: ".IPI-DRAG",
        onLayoutChange: onLayoutChange.bind(undefined, colCount),
        verticalCompact: true,
        onDrag: renderPlaceholder,
        compactType: "horizontal",
        margin: [gridMarginValue, gridMarginValue],
    };

    // First render has finished
    if (_initialRender) _setInitialRender(false);

    return (
        <div key={_updateVersion} style={{ overflow: "hidden" }}>
            <GridLayout
                {...GridLayoutProps}
            >
                {renderWidgets()}
            </GridLayout>
        </div>
    );
};