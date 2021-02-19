import React from 'react';
import { BaseWidget } from '../../CustomGrid/BaseWidget';
import { WidgetType } from '../../CustomGrid/Enums/WidgetType';
import SettingsWidgetRenderer from './SettingsWidgetRenderer';
export class SettingsWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.SettingsWidget;
    public render(): JSX.Element
    {
        const props = {
            id: this.id
        };
        return <SettingsWidgetRenderer {...props} />;
    }
    public width: number = 1;
    public height: number = 1;
    public allowDeletion = false;
    public draggable = true;
    public isResizeable = false;
}