import { IBoundaryInfo } from './IBoundaryInfo';
import { IGridPositionInfo } from './IGridPositionInfo';

export interface IGridItemPositionInfo extends IBoundaryInfo, IGridPositionInfo{
    userGenerated: boolean;
}