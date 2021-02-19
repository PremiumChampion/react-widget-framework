import React from 'react';
import { BaseWidget } from '../../CustomGrid/BaseWidget';
import { WidgetType } from '../../CustomGrid/Enums/WidgetType';
import LinkWidgetRenderer, { LinkWidgetRendererProps } from './LinkWidgetRenderer';
import "../Spin.scss";


export class LinkWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.NotesWidget;
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
        const props: LinkWidgetRendererProps = {
            setLink: (link) =>
            {
                this.link = link;
                this.componentUpdate();
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
}