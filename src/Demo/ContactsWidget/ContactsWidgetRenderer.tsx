import { Callout, DefaultButton, DirectionalHint, Icon, Text, TextField } from '@fluentui/react';
import React from "react";
import { v4 } from 'uuid';
import "./ContactsWidgetStyles.scss";
export interface ContactsWidgetRendererProps
{
    contacts: string[];
    addContact: (contactName: string) => void;
    id: string;
    removeContact: (index: number) => void;
}

interface ContactsWidgetRendererState
{
    calloutOpen: boolean;
    contactName: string;
}
/**
 * Component ContactsWidgetRenderer
 *
 * @export
 * @class Main
 * @extends {React.Component<ContactsWidgetRendererProps, ContactsWidgetRendererState>}
 */
export default class ContactsWidgetRenderer extends React.Component<ContactsWidgetRendererProps, ContactsWidgetRendererState> {

    constructor(props: ContactsWidgetRendererProps)
    {
        super(props);
        this.state = {
            calloutOpen: false,
            contactName: ""
        };
    }

    public render(): JSX.Element
    {
        return (
            <div
                className="Contacts_Icon IPI-NODRAG"
                onClick={() =>
                {
                    this.setState({ calloutOpen: true });
                }}
            >
                {this.state.calloutOpen &&
                    <Callout
                        target={`#${ this.props.id }`}
                        directionalHint={DirectionalHint.rightCenter}
                        onDismiss={() =>
                        {
                            this.setState({ calloutOpen: false });
                        }}
                    >
                        <div className={"ContactHost"}>
                            <div>
                                <TextField value={this.state.contactName} onChange={(_, text) => { this.setState({ contactName: text || "" }); }} />
                                <DefaultButton onClick={() =>
                                {
                                    this.props.addContact(this.state.contactName);
                                    this.setState({ contactName: "" });
                                }}>Kontakt speichern</DefaultButton>
                            </div>
                            {
                                this.props.contacts.map((contact, i) => { return (<div key={v4()}><Text>{contact}</Text><Icon iconName={"Delete"} onClick={() => { this.props.removeContact(i); }} /></div>); })
                            }
                        </div>
                    </Callout>
                }
            </div>
        );
    }

    public componentDidMount()
    {

    }
}