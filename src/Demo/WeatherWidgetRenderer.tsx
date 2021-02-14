import React from "react";

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
            <div style={{ backgroundColor: "rgb(53, 53, 53)" }}>
                {/* Test */}
                <iframe
                    title={"Weather"}
                    src={"https://www.meteoblue.com/en/weather/widget/daily?geoloc=detect&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&precipunit=MILLIMETER&coloured=coloured&pictoicon=0&maxtemperature=0&maxtemperature=1&mintemperature=0&mintemperature=1&windspeed=0&windgust=0&winddirection=0&uv=0&humidity=0&precipitation=0&precipitationprobability=0&spot=0&pressure=0&layout=dark"}
                    frameBorder="0"
                    scrolling="NO"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
                    style={{ width: "216px", height: "420px", pointerEvents: "none" }}
                ></iframe>
                {/* <div><a href="https://www.meteoblue.com/en/weather/week/index?utm_source=weather_widget&utm_medium=linkus&utm_content=daily&utm_campaign=Weather%2BWidget" target="_blank">meteoblue</a></div> */}
            </div>
        );
    }

    public componentDidMount()
    {

    }
}