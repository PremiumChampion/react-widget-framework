import React from "react";
import "./WeatherWidgetStyle.scss";
export interface WeatherWidgetRendererProps
{
}

interface WeatherWidgetRendererState
{
}
/**
 * Component WeatherWidgetRenderer
 *
 * @export
 * @class Main
 * @extends {React.Component<WeatherWidgetRendererProps, WeatherWidgetRendererState>}
 */
export default class WeatherWidgetRenderer extends React.Component<WeatherWidgetRendererProps, WeatherWidgetRendererState> {

    constructor(props: WeatherWidgetRendererProps)
    {
        super(props);
    }

    public render(): JSX.Element
    {
        return (
            <div className={"WeatherWidget"} >
                <iframe
                    title={"Weather"}
                    src={"https://www.meteoblue.com/en/weather/widget/daily?geoloc=detect&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&precipunit=MILLIMETER&coloured=monochrome&pictoicon=0&pictoicon=1&maxtemperature=0&maxtemperature=1&mintemperature=0&mintemperature=1&windspeed=0&windgust=0&winddirection=0&uv=0&humidity=0&precipitation=0&precipitationprobability=0&spot=0&pressure=0&layout=dark"}
                    frameBorder="0"
                    scrolling="NO"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
                    style={{ width: "216px", height: "200px", pointerEvents: "none", position: 'absolute', top: "-94px" }}
                ></iframe>
            </div>
        );
    }

    public componentDidMount()
    {

    }
}