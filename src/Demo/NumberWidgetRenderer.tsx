import React from "react";
import "./NumberWidgetStyles.scss";
export interface NumberWidgetRendererProps
{
    numb: number;
}

interface NumberWidgetRendererState
{
}
/**
 * Component NumberWidgetRenderer
 *
 * @export
 * @class Main
 * @extends {React.Component<NumberWidgetRendererProps, NumberWidgetRendererState>}
 */
export default class NumberWidgetRenderer extends React.Component<NumberWidgetRendererProps, NumberWidgetRendererState> {

    constructor(props: NumberWidgetRendererProps)
    {
        super(props);
    }

    public render(): JSX.Element
    {
        return (
            <div className="NumberWidget IPI-NODRAG" style={{ backgroundColor: `rgba(${ Math.random() * 255 }, ${ Math.random() * 255 }, ${ Math.random() * 255 }, ${ Math.random() * 255 })` }}>
                {/* Test */}
                <p>{this.props.numb}</p>
                {/* <div><a href="https://www.meteoblue.com/en/weather/week/index?utm_source=weather_widget&utm_medium=linkus&utm_content=daily&utm_campaign=Weather%2BWidget" target="_blank">meteoblue</a></div> */}
            </div>
        );
    }

    public componentDidMount()
    {

    }
}