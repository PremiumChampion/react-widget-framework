import React from 'react';
import { v4 } from 'uuid';
import { BaseWidget } from '../CustomGrid/BaseWidget';
import WeatherWidgetRenderer from './WeatherWidgetRenderer';

export class WeatherWidget extends BaseWidget
{
    public serialize(): string
    {
        throw new Error('[WeatherWidget] Method serialize not implemented.');
    }
    public deserialize(): BaseWidget
    {
        throw new Error('[WeatherWidget] Method deserialize not implemented.');
    }
    public id: string = v4();
    public width: number = 3;
    public height: number = 2;
    public isDraggable = false;
    public render(): JSX.Element
    {
        return React.createElement(WeatherWidgetRenderer, {});
    }
}