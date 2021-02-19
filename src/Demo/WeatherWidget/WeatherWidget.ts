import React from 'react';
import { v4 } from 'uuid';
import { BaseWidget } from '../../CustomGrid/BaseWidget';
import { WidgetType } from '../../CustomGrid/Enums/WidgetType';
import WeatherWidgetRenderer from './WeatherWidgetRenderer';

export class WeatherWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.WeatherWidget;
    public width: number = 2;
    public height: number = 1;
    public isDraggable = true;
    isResizeable = false;
    // public 
    public render(): JSX.Element
    {
        return React.createElement(WeatherWidgetRenderer, {});
    }
}