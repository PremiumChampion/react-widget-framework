import { Icon, PrimaryButton } from '@fluentui/react';
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
                // id={this.iconId}
                onClick={() =>
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
                    >
                        <div className={"SettingsHost"}>
                            <div className={"WidgetSelection"}>
                                <div key={"ContactInfo"} className={"SettingsEntity"}>
                                    <Icon style={{ fontSize: "40px" }} iconName={"ContactInfo"} onClick={() =>
                                    {
                                        Custom_Event.fire("IPI_ADD_WIDGET", WidgetType.KontaktWidget);
                                    }} />
                                    <p>Kontakt-Widget</p>
                                </div>
                                <div key={"CloudWeather"} className={"SettingsEntity"}>
                                    <Icon style={{ fontSize: "40px" }} iconName={"CloudWeather"} onClick={() =>
                                    {
                                        Custom_Event.fire("IPI_ADD_WIDGET", WidgetType.WeatherWidget);
                                    }} />
                                    <p>Wetter-Widget</p>
                                </div>
                            </div>
                            <div className={"SaveOptions"}>
                                <PrimaryButton onClick={() => { Custom_Event.fire("IPI_SAVE_WIDGETS", undefined); }}>Widgets speichern</PrimaryButton>
                                <PrimaryButton onClick={() => { Custom_Event.fire("IPI_LOAD_WIDGETS", true); }}>Widgets laden</PrimaryButton>
                                <PrimaryButton onClick={() => { Custom_Event.fire("IPI_LOAD_WIDGETS", false); }}>Neue Widgets generieren</PrimaryButton>
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