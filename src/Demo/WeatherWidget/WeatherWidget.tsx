import React from 'react';
import { BaseWidget } from '../../CustomGrid/BaseWidget';
import { WidgetType } from '../../CustomGrid/Enums/WidgetType';
import WeatherWidgetRenderer from './WeatherWidgetRenderer';
import "../Spin.scss"

export class WeatherWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.WeatherWidget;
    public width: number = 2;
    public height: number = 1;
    public isDraggable = true;
    public isResizeable = false;
    public render(): JSX.Element
    {
        return <WeatherWidgetRenderer />;
    }
    public onAfterDeserialisation(){
    }
}