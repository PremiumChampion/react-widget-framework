import React from 'react';
import { BaseWidget } from '../../CustomGrid/BaseWidget';
import { WidgetType } from '../../CustomGrid/Enums/WidgetType';
import NotesWidgetRenderer, { NotesWidgetRendererProps } from './NotesWidgetRenderer';
import "../Spin.scss"


export class NotesWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.NotesWidget;
    public notes: string[] = [];
    public width: number = 1;
    public height: number = 1;
    public displayDragHandle = false;
    public contentDragable = true;
    public allowDeletion = true;
    public isResizeable = false;
    public notificationCount = this.notes.length;
    public render(): JSX.Element
    {
        const props: NotesWidgetRendererProps = {
            addNote: (note: string) =>
            {
                this.notes.push(note);
                this.notificationCount = this.notes.length;
                this.componentUpdate();
            },
            removeNote: (index: number) =>
            {
                this.notes.splice(index, 1);
                this.notificationCount = this.notes.length;
                this.componentUpdate();
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