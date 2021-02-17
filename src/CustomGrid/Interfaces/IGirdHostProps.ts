import { BaseWidget } from '../BaseWidget';

export interface IGirdHostProps
{
    widgets: BaseWidget[];
    useSerialisation?: (serialisationFunction: () => string) => void;
    onRemoveWidget?: (widget: BaseWidget) => void;
    onChange?: (serialisationFunction: () => string)=> void;
}