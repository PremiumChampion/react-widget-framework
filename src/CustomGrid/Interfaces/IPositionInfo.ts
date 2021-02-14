import { IBoundaryInfo } from './IBoundaryInfo';
import { IGridPositionInfo } from './IGridPositionInfo';

export interface IItemPositionInfo extends IBoundaryInfo, IGridPositionInfo
{
    id: string;
}