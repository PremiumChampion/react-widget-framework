import { BaseWidget } from '../BaseWidget';

export interface IGirdHostProps
{
    widgets: BaseWidget[];
    useSerialisation?: (serialisationFunction: () => string) => void;
    onChanged?: (serializedWidgets: string) => void;
}