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
            <div className="NumberWidget IPI-NODRAG" style={{ backgroundColor: `rgb(53, 53, 53)`, color: 'white' }} >
                <p>{this.props.numb}</p>
            </div>
        );
    }

    public componentDidMount()
    {

    }
}