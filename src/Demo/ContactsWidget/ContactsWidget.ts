import React from 'react';
import { BaseWidget } from '../../CustomGrid/BaseWidget';
import { WidgetType } from '../../CustomGrid/Enums/WidgetType';
import ContactsWidgetRenderer from './ContactsWidgetRenderer';

export class ContactsWidget extends BaseWidget
{
    public WidgetType: WidgetType = WidgetType.KontaktWidget;
    public contacts: string[] = [];
    constructor()
    {
        super();
    }

    public width: number = 1;
    public height: number = 1;
    public displayDragHandle = true;
    public contentDragable = true;
    // public draggableIndicatorClassName = "spin";
    public allowDeletion = true;
    public isResizeable = false;
    public notificationCount = this.contacts.length;
    public render(): JSX.Element
    {
        return React.createElement(ContactsWidgetRenderer, {
            contacts: this.contacts,
            addContact: (contact: string) =>
            {
                this.contacts.push(contact);
                this.notificationCount = this.contacts.length;
                this.componentUpdate();
            },
            removeContact: (index: number) =>
            {
                this.contacts.splice(index, 1);
                this.notificationCount = this.contacts.length;
                this.componentUpdate();
            },
            id: this.id
        });
    }
    public onAfterDeserialisation()
    {
        this.notificationCount = this.contacts.length;
    }
}