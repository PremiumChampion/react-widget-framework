import { SpaceCollissionType } from './Enums/SpaceCollissionType';
import { IGridPositionInfo } from './Interfaces/IGridPositionInfo';
import { IItemPositionInfo } from './Interfaces/IPositionInfo';
import { isNil } from "lodash";
export class CollisionHandler
{
    private _fillInformation: (string | null)[][];
    private _tableColumns: number;
    private _isFinal = false;

    private _lastItem: IItemPositionInfo | undefined;
    private _stackSize = 0;
    /**
     *
     */
    constructor(colunmCont: number)
    {
        this._tableColumns = colunmCont;
        this._fillInformation = [];
    }

    public add(item: IItemPositionInfo, lastItem: boolean, resetStackCounter = true)
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
                    this.add({ ...item, y: item.y + 1, x: 0 }, lastItem, false);
                } else if (spaceFilled.indexOf(SpaceCollissionType.Right) !== -1)
                {

                    if (!this.isSpaceFilled({ ...item, x: item.x - 1 }))
                    {
                        this.add({ ...item, x: -1 }, false);
                    } else
                    {
                        this.add({ ...item, y: item.y + 1, x: 0 }, lastItem, false);
                    }

                } else if (spaceFilled.indexOf(SpaceCollissionType.Widget) !== -1)
                {
                    this.add({ ...item, x: item.x + 1 }, lastItem, false);
                }
            }
            else
            {
                // Space is free and can be occupied
                this.fillSpace(item, lastItem);
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

    private fillSpace(item: IItemPositionInfo, lastItem: boolean)
    {
        if (!lastItem)
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
        } else
        {
            this._lastItem = item;
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
        // calculate the last item position
        if (this._lastItem !== undefined)
        {
            let y = this._fillInformation[0].length - 1;
            this.add({ ...this._lastItem, y }, false);
        }

        this._isFinal = true;
    }
}