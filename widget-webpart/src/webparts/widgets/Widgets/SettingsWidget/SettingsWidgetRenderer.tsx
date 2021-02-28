// import { Icon, DefaultButton } from '@fluentui/react';
import { Callout, DefaultButton, DirectionalHint, Icon } from 'office-ui-fabric-react';
import * as React from "react";
import { WidgetType } from '../../WidgetFramework/Enums/WidgetType';
import { Custom_Event } from '../CustomEvents';
import styles from "./SettingsWidget.module.scss";

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
        console.log(styles);

        return (
                <div
                    className={styles["Settings_Add_Icon"]}
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
                            <div className={styles["SettingsHost"]}>
                                <div className={styles["WidgetSelection"]}>
                                    <div key={"ContactInfo"} className={styles["SettingsEntity"]}>
                                        <Icon style={{ fontSize: "40px" }} iconName={"QuickNote"} onClick={() =>
                                        {
                                            Custom_Event.fire("ADD_WIDGET", WidgetType.NotesWidget);
                                        }} />
                                        <p>Notizen</p>
                                    </div>
                                    <div key={"CloudWeather"} className={styles["SettingsEntity"]}>
                                        <Icon style={{ fontSize: "40px" }} iconName={"CloudWeather"} onClick={() =>
                                        {
                                            Custom_Event.fire("ADD_WIDGET", WidgetType.WeatherWidget);
                                        }} />
                                        <p>Wetter</p>
                                    </div>
                                    <div key={"Link"} className={styles["SettingsEntity"]}>
                                        <Icon style={{ fontSize: "40px" }} iconName={"Link12"} onClick={() =>
                                        {
                                            Custom_Event.fire("ADD_WIDGET", WidgetType.LinkWidget);
                                        }} />
                                        <p>Link</p>
                                    </div>
                                </div>
                                <div className={styles["SaveOptions"]}>
                                    <DefaultButton onClick={() => { Custom_Event.fire("SAVE_WIDGETS", undefined); }}>Widgets speichern</DefaultButton>
                                    <DefaultButton onClick={() => { Custom_Event.fire("LOAD_WIDGETS", true); }}>Widgets laden</DefaultButton>
                                    <DefaultButton onClick={() => { Custom_Event.fire("LOAD_WIDGETS", false); }}>Alle Widgets löschen</DefaultButton>
                                </div>
                            </div>
                        </Callout>
                    }
                    {" "}
                </div>
            // </div>
        );
    }

    public componentDidMount()
    {

    }
}