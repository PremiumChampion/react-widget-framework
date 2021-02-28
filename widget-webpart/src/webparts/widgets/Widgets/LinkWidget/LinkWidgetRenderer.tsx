import { ActionButton, Callout, DirectionalHint, Icon, TextField } from 'office-ui-fabric-react';
import * as React from "react";
// import styles from '../../components/Widgets.module.scss';
import styles from  "./LinkWidgetStyles.module.scss";
export interface LinkWidgetRendererProps
{
    link: { title: string, link: string, icon: string; } | undefined;
    setLink: (noteText: { title: string, link: string, icon: string; }) => void;
    id: string;
}

interface LinkWidgetRendererState
{
    calloutOpen: boolean;
    title: string;
    icon: string;
    taget: string;
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
            title: "",
            icon: "Link",
            taget: ""
        };
    }

    private _handleWidgetClick()
    {
        if (this.props.link === undefined)
        {
            this.setState({ calloutOpen: true });
        } else
        {
            window.location.assign(this.props.link.link);
        }
    }

    public render(): JSX.Element
    {
        console.log(styles);
        
        return (
            <div
                className="Link_Icon WIDGET-NODRAG"
                onClick={this._handleWidgetClick.bind(this)}
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
                                <TextField value={this.state.icon} onChange={(_, text) => { this.setState({ icon: text || "" }); }} placeholder={"Fluent-UI-Icon-Name"} />
                                <a target={"_blank"} href="https://developer.microsoft.com/de-DE/fluentui#/styles/web/icons#available-icons">{"Verfügbare Icons anzeigen "}<Icon iconName="OpenInNewWindow" /></a>
                                <TextField value={this.state.title} onChange={(_, text) => { this.setState({ title: text || "" }); }} placeholder={"Linkbezeichnung"} />
                                <TextField value={this.state.taget} onChange={(_, text) => { this.setState({ taget: text || "" }); }} placeholder={"Ziel z.B. https://google.com"} />
                                <ActionButton
                                    onClick={() =>
                                    {
                                        if (this.state.icon.trim().length > 0 && this.state.taget.trim().length > 0 && this.state.title.trim().length > 0)
                                        {
                                            this.props.setLink({ icon: this.state.icon, link: this.state.taget, title: this.state.title });
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