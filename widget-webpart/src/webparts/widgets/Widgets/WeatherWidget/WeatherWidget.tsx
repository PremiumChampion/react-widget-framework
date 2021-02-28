import * as React from 'react';
import { BaseWidget } from '../../WidgetFramework/BaseWidget';
import { WidgetType } from '../../WidgetFramework/Enums/WidgetType';
import WeatherWidgetRenderer from './WeatherWidgetRenderer';
import styles from  "../Spin.module.scss"

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