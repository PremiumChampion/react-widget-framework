import React from 'react';
import { v4 } from 'uuid';
import { BaseWidget } from '../CustomGrid/BaseWidget';
import { WidgetType } from '../CustomGrid/Enums/WidgetType';
import NumberWidgetRenderer from './NumberWidgetRenderer';

export class NumberWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.NumberWidget;
    numb: number;
    constructor()
    {
        super();
        this.numb = Math.floor(Math.random() * 100);
    }
    public id: string = v4();
    public width: number = 1;
    public height: number = 1;
    public displayDragHandle = true;
    public contentDragable = true;
    public draggableIndicatorClassName = "bounce";
    public render(): JSX.Element
    {
        return React.createElement(NumberWidgetRenderer, { numb: this.numb });
    }
}