import React from 'react';
import { v4 } from 'uuid';
import { BaseWidget } from '../../CustomGrid/BaseWidget';
import { WidgetType } from '../../CustomGrid/Enums/WidgetType';
import SettingsWidgetRenderer from './SettingsWidgetRenderer';
export class SettingsWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.SettingsWidget;
    public render(): JSX.Element
    {
        return React.createElement(SettingsWidgetRenderer, { id: this.id });
    }
    public width: number = 1;
    public height: number = 1;
    public allowDeletion = false;
    public draggable = true;
    public isResizeable = false;
}