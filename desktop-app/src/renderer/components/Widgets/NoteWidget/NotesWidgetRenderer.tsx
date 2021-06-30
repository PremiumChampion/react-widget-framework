import { Callout, DirectionalHint, IconButton, Text, TextField } from '@fluentui/react';
import React from "react";
import { v4 } from 'uuid';
import "./NotesWidgetStyles.scss";
export interface NotesWidgetRendererProps
{
    notes: string[];
    addNote: (noteText: string) => void;
    id: string;
    removeNote: (index: number) => void;
}

interface NotesWidgetRendererState
{
    calloutOpen: boolean;
    contactName: string;
}
/**
 * Component ContactsWidgetRenderer
 *
 * @export
 * @class Main
 * @extends {React.Component<NotesWidgetRendererProps, NotesWidgetRendererState>}
 */
export default class NotesWidgetRenderer extends React.Component<NotesWidgetRendererProps, NotesWidgetRendererState> {

    constructor(props: NotesWidgetRendererProps)
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
                className="Notes_Icon WIDGET-NODRAG"
                onClick={() =>
                {
                    this.setState({ calloutOpen: true });
                }}
                onTouchStartCapture={() =>
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
                            if (this.state.contactName.trim().length > 0) this.props.addNote(this.state.contactName);
                            this.setState({ calloutOpen: false, contactName: "" });
                        }}
                        preventDismissOnResize={true}
                    >
                        <div className={"NotesHost"}>
                            <div>
                                <TextField value={this.state.contactName} onChange={(_, text) => { this.setState({ contactName: text || "" }); }} />
                                <IconButton
                                    onClick={() =>
                                    {
                                        if (this.state.contactName.trim().length > 0)
                                        {
                                            this.props.addNote(this.state.contactName);
                                            this.setState({ contactName: "" });
                                        }
                                    }}
                                    iconProps={{ iconName: "CheckMark" }}
                                />
                            </div>
                            {
                                this.props.notes.map((contact, i) =>
                                {
                                    return (
                                        <div key={v4()}><Text>{contact}</Text><IconButton iconProps={{ iconName: "Clear" }} onClick={() => { this.props.removeNote(i); }} /></div>
                                    );
                                })
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