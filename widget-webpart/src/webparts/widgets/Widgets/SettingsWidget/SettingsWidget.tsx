import * as React from 'react';
import { BaseWidget } from '../../WidgetFramework/BaseWidget';
import { WidgetType } from '../../WidgetFramework/Enums/WidgetType';
import SettingsWidgetRenderer, { SettingsWidgetRendererProps } from './SettingsWidgetRenderer';
import styles from  "../Spin.module.scss";

export class SettingsWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.SettingsWidget;
    public width: number = 1;
    public height: number = 1;
    public allowDeletion = false;
    public isResizeable = false;
    public render(): JSX.Element
    {
        const props: SettingsWidgetRendererProps = {
            id: this.id
        };
        return <SettingsWidgetRenderer {...props} />;
    }
}