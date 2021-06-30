import { Link } from '@fluentui/react';
import React from 'react';
import { BaseWidget } from '../../WidgetFramework/BaseWidget';
import { WidgetType } from '../../WidgetFramework/Enums/WidgetType';
import "../Spin.scss";
import LinkWidgetRenderer, { LinkWidgetRendererProps } from './LinkWidgetRenderer';


export class LinkWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.LinkWidget;
    public link: {
        title: string;
        link: string;
        icon: string;
    } | undefined;
    public width: number = 1;
    public height: number = 1;
    public displayDragHandle = false;
    public contentDragable = true;
    public allowDeletion = true;
    public isResizeable = false;
    public render(): JSX.Element
    {
        if (this.link)
        {
            this.notificationCount = 0;
        }
        const props: LinkWidgetRendererProps = {
            setLink: (link) =>
            {
                this.link = link;
                this.forceWidgetUpdate();
                this.indicatePropertyChange();
            },
            id: this.id,
            link: this.link
        };
        return (
            <LinkWidgetRenderer
                {...props}
            />
        );
    }
    public generateNotificationBubbleText()
    {
        return "•";
    }
    public notificationCount = 1;
}