import { Icon, DefaultButton } from '@fluentui/react';
import { Callout, DirectionalHint } from 'office-ui-fabric-react';
import React from "react";
import { WidgetType } from '../../CustomGrid/Enums/WidgetType';
import { Custom_Event } from './../CustomEvents';
import "./SettingsWidget.scss";

export interface SettingsWidgetRendererProps
{
    id: string;
}

interface SettingsWidgetRendererState
{
    calloutOpen: boolean;
}
/**
 * Component SettingsWidgetRenderer
 *
 * @export
 * @class Main
 * @extends {React.Component<SettingsWidgetRendererProps, SettingsWidgetRendererState>}
 */
export default class SettingsWidgetRenderer extends React.Component<SettingsWidgetRendererProps, SettingsWidgetRendererState> {

    constructor(props: SettingsWidgetRendererProps)
    {
        super(props);
        this.state = {
            calloutOpen: false,
        };
    }

    public render(): JSX.Element
    {
        return (
            <div
                className="Settings_Add_Icon"
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
                        directionalHint={DirectionalHint.bottomCenter}
                        onDismiss={() =>
                        {
                            this.setState({ calloutOpen: false });
                        }}
                        preventDismissOnResize={true}
                    >
                        <div className={"SettingsHost"}>
                            <div className={"WidgetSelection"}>
                                <div key={"ContactInfo"} className={"SettingsEntity"}>
                                    <Icon style={{ fontSize: "40px" }} iconName={"QuickNote"} onClick={() =>
                                    {
                                        Custom_Event.fire("ADD_WIDGET", WidgetType.NotesWidget);
                                    }} />
                                    <p>Notizen</p>
                                </div>
                                <div key={"CloudWeather"} className={"SettingsEntity"}>
                                    <Icon style={{ fontSize: "40px" }} iconName={"CloudWeather"} onClick={() =>
                                    {
                                        Custom_Event.fire("ADD_WIDGET", WidgetType.WeatherWidget);
                                    }} />
                                    <p>Wetter</p>
                                </div>
                                <div key={"Link"} className={"SettingsEntity"}>
                                    <Icon style={{ fontSize: "40px" }} iconName={"Link12"} onClick={() =>
                                    {
                                        Custom_Event.fire("ADD_WIDGET", WidgetType.LinkWidget);
                                    }} />
                                    <p>Link</p>
                                </div>
                            </div>
                            <div className={"SaveOptions"}>
                                <DefaultButton onClick={() => { Custom_Event.fire("SAVE_WIDGETS", undefined); }}>Widgets speichern</DefaultButton>
                                <DefaultButton onClick={() => { Custom_Event.fire("LOAD_WIDGETS", true); }}>Widgets laden</DefaultButton>
                                <DefaultButton onClick={() => { Custom_Event.fire("LOAD_WIDGETS", false); }}>Alle Widgets löschen</DefaultButton>
                            </div>
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