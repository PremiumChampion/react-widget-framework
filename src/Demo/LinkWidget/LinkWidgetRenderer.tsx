import { Callout, IconButton, DirectionalHint, Icon, Text, TextField, ActionButton } from '@fluentui/react';
import React from "react";
import "./LinkWidgetStyles.scss";
export interface LinkWidgetRendererProps
{
    link: { title: string, link: string, icon: string; } | undefined;
    setLink: (noteText: { title: string, link: string, icon: string; }) => void;
    id: string;
}

interface LinkWidgetRendererState
{
    calloutOpen: boolean;
    LinkTitle: string;
    LinkIcon: string;
    LinkTaget: string;
}
/**
 * Component ContactsWidgetRenderer
 *
 * @export
 * @class Main
 * @extends {React.Component<LinkWidgetRendererProps, LinkWidgetRendererState>}
 */
export default class LinkWidgetRenderer extends React.Component<LinkWidgetRendererProps, LinkWidgetRendererState> {

    constructor(props: LinkWidgetRendererProps)
    {
        super(props);
        this.state = {
            calloutOpen: false,
            LinkTitle: "",
            LinkIcon: "Link",
            LinkTaget: ""
        };
    }

    public render(): JSX.Element
    {
        return (
            <div
                className="Link_Icon IPI-NODRAG"
                onClick={() =>
                {
                    this.setState({ calloutOpen: true });
                }}
                onTouchStartCapture={() =>
                {
                    this.setState({ calloutOpen: true });
                }}
            >
                {!this.props.link && <Icon iconName={"Link12"} />}
                {this.state.calloutOpen && this.props.link === undefined &&
                    <Callout
                        preventDismissOnResize={true}
                        target={`#${ this.props.id }`}
                        directionalHint={DirectionalHint.rightCenter}
                        onDismiss={() =>
                        {
                            this.setState({ calloutOpen: false });
                        }}
                    >
                        <div className={"LinkHost"}>
                            <div>
                                <TextField value={this.state.LinkIcon} onChange={(_, text) => { this.setState({ LinkIcon: text || "" }); }} placeholder={"Fluent-UI-Icon-Name"} />
                                <TextField value={this.state.LinkTitle} onChange={(_, text) => { this.setState({ LinkTitle: text || "" }); }} placeholder={"Linkbezeichnung"} />
                                <TextField value={this.state.LinkTaget} onChange={(_, text) => { this.setState({ LinkTaget: text || "" }); }} placeholder={"Ziel z.B. https://google.com"} />
                                <ActionButton
                                    onClick={() =>
                                    {
                                        if (this.state.LinkIcon.trim().length > 0 && this.state.LinkTaget.trim().length > 0 && this.state.LinkTitle.trim().length > 0)
                                        {
                                            this.props.setLink({ icon: this.state.LinkIcon, link: this.state.LinkTaget, title: this.state.LinkTitle });
                                            this.setState({ calloutOpen: false });
                                        }
                                    }}
                                    iconProps={{ iconName: "CheckMark" }}
                                >Speichern</ActionButton>
                            </div>
                        </div>
                    </Callout>
                }
                {this.props.link &&
                    <div className={"DisplayLink"}>
                        <a href={this.props.link.link} title={this.props.link.title}>
                            <Icon iconName={this.props.link.icon} />
                        </a>
                    </div>
                }
            </div>
        );
    }

    public componentDidMount()
    {

    }
}