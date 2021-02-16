import React from 'react';
import { v4 } from 'uuid';
import { BaseWidget } from '../CustomGrid/BaseWidget';
import { WidgetType } from '../CustomGrid/Enums/WidgetType';
import WeatherWidgetRenderer from './WeatherWidgetRenderer';

export class WeatherWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.WeatherWidget;
    public id: string = v4();
    public width: number = 3;
    public height: number = 2;
    public isDraggable = false;
    public render(): JSX.Element
    {
        return React.createElement(WeatherWidgetRenderer, {});
    }
}