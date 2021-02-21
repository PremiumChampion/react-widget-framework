import React from 'react';
import { BaseWidget } from '../../WidgetFramework/BaseWidget';
import { WidgetType } from '../../WidgetFramework/Enums/WidgetType';
import SettingsWidgetRenderer, { SettingsWidgetRendererProps } from './SettingsWidgetRenderer';
import "../Spin.scss";

export class SettingsWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.SettingsWidget;
    public width: number = 1;
    public height: number = 1;
    public allowDeletion = false;
    public draggable = true;
    public isResizeable = false;
    public render(): JSX.Element
    {
        const props: SettingsWidgetRendererProps = {
            id: this.id
        };
        return <SettingsWidgetRenderer {...props} />;
    }
}