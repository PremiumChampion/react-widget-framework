import { BaseWidget } from '../BaseWidget';

export interface IGridItemInternalProps 
{
    item: BaseWidget;
    onRemove?: (item: BaseWidget) => void;
}