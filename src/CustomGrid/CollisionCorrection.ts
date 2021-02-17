import { SpaceCollissionType } from './Enums/SpaceCollissionType';
import { IBoundaryInfo } from './Interfaces/IBoundaryInfo';
import { IGridPositionInfo } from './Interfaces/IGridPositionInfo';
import { IItemPositionInfo } from './Interfaces/IPositionInfo';
import { isNil } from "lodash";
export class CollisionCorrection
{
    private _fillInformation: (string | null)[][];
    private _tableColumns: number;
    private _isFinal = false;
    private _stackSize = 0;
    /**
     *
     */
    constructor(colunmCont: number)
    {
        this._tableColumns = colunmCont;
        this._fillInformation = [];
    }

    public add(item: IItemPositionInfo, resetStackCounter = true)
    {
        if (this._isFinal)
        {
            throw new Error("[CollisionCorrection]: Can not add items on finalised instance.");
        }
        // check if the callstack is to large
        if (resetStackCounter)
        {
            this._stackSize = 0;
        } else
        {
            this._stackSize++;
        }
        if (this._stackSize < 2000)
        {
            // indicates if a space is filled
            let spaceFilled: SpaceCollissionType[] = this.isSpaceFilled(item);

            if (spaceFilled.length > 0)
            {
                // Space is filled
                if (spaceFilled.indexOf(SpaceCollissionType.Right) !== -1 && spaceFilled.indexOf(SpaceCollissionType.Widget) !== -1)
                {
                    this.add({ ...item, y: item.y + 1, x: 0 }, false);
                } else if (spaceFilled.indexOf(SpaceCollissionType.Right) !== -1)
                {

                    if (!this.isSpaceFilled({ ...item, x: item.x - 1 }))
                    {
                        this.add({ ...item, x: -1 }, false);
                    } else
                    {
                        this.add({ ...item, y: item.y + 1, x: 0 }, false);
                    }

                } else if (spaceFilled.indexOf(SpaceCollissionType.Widget) !== -1)
                {
                    this.add({ ...item, x: item.x + 1 }, false);
                }
            }
            else
            {
                // Space is free and can be occupied
                this.fillSpace(item);
            }
        } else
        {
            console.warn("[CollisionCorrection] Stack size exceeded");
        }
    }

    private isSpaceFilled(item: IItemPositionInfo)
    {
        let collissionTypes: SpaceCollissionType[] = [];
        for (let width = 0; width < item.width; width++)
        {
            for (let height = 0; height < item.heigth; height++)
            {
                if (isNil(this._fillInformation[item.x + width]))
                {
                    this._fillInformation[item.x + width] = [];
                }

                if (item.x + width >= this._tableColumns)
                {
                    collissionTypes.push(SpaceCollissionType.Right);
                }

                if (!isNil(this._fillInformation[item.x + width][item.y + height]))
                {
                    collissionTypes.push(SpaceCollissionType.Widget);
                }
            }
        }
        return collissionTypes;
    }

    private fillSpace(item: IItemPositionInfo)
    {
        // occupies  space for an item
        for (let width = 0; width < item.width; width++)
        {
            for (let height = 0; height < item.heigth; height++)
            {
                if (!this._fillInformation[item.x + width] === undefined)
                {
                    this._fillInformation[item.x + width] = [];
                }
                this._fillInformation[item.x + width][item.y + height] = item.id;
            }
        }
    }

    public getPosition(id: string): IGridPositionInfo | null
    {

        let item: IGridPositionInfo | null = null;

        if (!this._isFinal)
        {
            // all items need to be added 
            throw new Error("[CollisionCorrection]: Cannot get position until grid is finalised.\nPlease call CollissionCorrection.finalise() to finalise the grid.");
        }

        // get first position with id
        for (let x = 0; x < this._tableColumns; x++)
        {
            let y = 0;

            if (!this._fillInformation[x])
            {
                this._fillInformation[x] = [];
            }
            // eslint-disable-next-line no-loop-func
            this._fillInformation[x].forEach(itemId =>
            {
                if (id === itemId && item === null)
                {
                    item = { x, y };
                }

                y++;
            });
        }

        return item;
    }

    public finalise()
    {
        this._isFinal = true;
    }
}