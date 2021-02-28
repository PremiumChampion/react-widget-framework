import * as React from 'react';
import { BaseWidget } from '../../WidgetFramework/BaseWidget';
import { WidgetType } from '../../WidgetFramework/Enums/WidgetType';
import NotesWidgetRenderer, { NotesWidgetRendererProps } from './NotesWidgetRenderer';
import "../Spin.module.scss"


export class NotesWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.NotesWidget;
    public notes: string[] = [];
    public width: number = 1;
    public height: number = 1;
    public displayDragHandle = false;
    public contentDragable = true;
    public allowDeletion = true;
    public isResizeable = true;
    public notificationCount = this.notes.length;
    public render(): JSX.Element
    {
        const props: NotesWidgetRendererProps = {
            addNote: (note: string) =>
            {
                this.notes.push(note);
                this.notificationCount = this.notes.length;
                this.forceWidgetUpdate();
            },
            removeNote: (index: number) =>
            {
                this.notes.splice(index, 1);
                this.notificationCount = this.notes.length;
                this.forceWidgetUpdate();
            },
            id: this.id,
            notes: this.notes
        };
        return (
            <NotesWidgetRenderer
                {...props}
            />
        );
    }
    public onAfterDeserialisation()
    {
        this.notificationCount = this.notes.length;
    }
}