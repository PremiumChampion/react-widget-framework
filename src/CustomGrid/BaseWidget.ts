import { isNil } from 'lodash';
import { WidgetType } from './Enums/WidgetType';
import { IGridItemPositionInfo } from './Interfaces/IGridItemPositionInfo';
import { IItemPositionInfo } from './Interfaces/IPositionInfo';
import { ISerializable } from './Serialization/ISerializable';

export abstract class BaseWidget implements ISerializable
{
    /**
     * the type of the widget
     *
     * @abstract
     * @type {WidgetType}
     * @memberof BaseWidget
     */
    public abstract WidgetType: WidgetType;
    /**
     * a classname to apply to the widget when it is dragable
     *
     * @type {(string | undefined)}
     * @memberof BaseWidget
     */
    public draggableIndicatorClassName: string = "";
    /**
     * FOR INTERNAL USE ONLY
     * keeps track of the saved widgets
     *
     * @type {{ [colCount: number]: IItemPositionInfo; }}
     * @memberof BaseWidget
     */
    public positionInfoTable: { [colCount: number]: IGridItemPositionInfo; } = {};
    /**
     * the id of the widget
     *
     * @abstract
     * @type {string}
     * @memberof BaseWidget
     */
    public abstract id: string;
    /**
     * indicates if the widget is dragable
     * default: TRUE
     *
     * @type {boolean}
     * @memberof BaseWidget
     */
    public isDraggable: boolean = true;
    /**
     * indicates if the widger is resizeable
     * default: TRUE
     *
     * @type {boolean}
     * @memberof BaseWidget
     */
    public isResizeable: boolean = true;
    /**
     * indicates if a drag handle should be displayed
     * default: false
     *
     * @type {boolean}
     * @memberof BaseWidget
     */
    public displayDragHandle: boolean = false;
    /**
     * indicates if the widget content should be dragable
     * default: TRUE
     *
     * @memberof BaseWidget
     */
    public contentDragable = true;
    /**
     * the width of the widget
     * in grid colunms
     *
     * @abstract
     * @type {number}
     * @memberof BaseWidget
     */
    public abstract width: number;
    /**
     * the heigth of the widget
     * in grid rows
     *
     * @abstract
     * @type {number}
     * @memberof BaseWidget
     */
    public abstract height: number;
    /**
     * indicates if the widget should be removeable and a remove button should be shown
     *
     * @type {boolean}
     * @memberof BaseWidget
     */
    public allowDeletion: boolean = true;
    /**
     * the x position of the widget on the grid
     *
     * @memberof BaseWidget
     */
    public x = 0;
    /**
     * the y position of the widget on the grid
     *
     * @memberof BaseWidget
     */
    public y = 0;
    /**
     * called to render the widget
     *
     * @abstract
     * @return {*}  {JSX.Element} the rendered widget
     * @memberof BaseWidget
     */
    public abstract render(): JSX.Element;
    /**
     * INTERNAL USE ONLY
     * sets the position of the widget
     *
     * @param {IItemPositionInfo} position the new position
     * @param {number} currentColCount the current colunm width
     * @memberof BaseWidget
     */
    public setPosition(position: IGridItemPositionInfo, currentColCount: number)
    {
        if (!this.positionInfoTable[0])
        {
            this.positionInfoTable[0] = { heigth: this.height, width: this.width, x: this.x, y: this.y, userGenerated: false };
        }

        this.x = position.x;
        this.y = position.y;
        this.height = position.heigth;
        this.width = position.width;

        this.positionInfoTable[currentColCount] = { heigth: this.height, width: this.width, x: this.x, y: this.y, userGenerated: position.userGenerated };
    }
    /**
     * INTERNAL USE ONLY
     * requests the widget position info for the element
     *
     * @param {number} [currentColCount] the current column
     * @return {*}  {IItemPositionInfo}
     * @memberof BaseWidget
     */
    public getWidgetPositionInfo(currentColCount?: number): IItemPositionInfo
    {
        const defaultPosition = !isNil(this.positionInfoTable[0]) ? { ...this.positionInfoTable[0], id: this.id } : { heigth: this.height, id: this.id, width: this.width, x: this.x, y: this.y, userGenerated: false };

        if (currentColCount === undefined)
        {
            // default widget position
            return defaultPosition;
        } else
        {
            if (this.hasPositionInfo(currentColCount))
            {
                return { ...this.positionInfoTable[currentColCount], id: this.id };
            } else
            {
                return defaultPosition;
            }
        }
    }
    /**
     * FOR INTERNAL USE ONLY
     * requests if the current column has a layout value
     *
     * @param {number} currentColCount
     * @return {*}  {boolean}
     * @memberof BaseWidget
     */
    public hasPositionInfo(currentColCount: number): boolean
    {
        return this.positionInfoTable[currentColCount] !== undefined;
    }

    /**
     * FOR INTERNAL USE ONLY
     * requests grid data
     *
     * @return {*} 
     * @memberof BaseWidget
     */
    public getGridData()
    {
        return { x: this.x, y: this.y, w: this.width, h: this.height, isResizable: this.isResizeable, static: !this.isDraggable, isDraggable: this.isDraggable, isBounded: true };
    }

    /**
     * function to serialise the widget. it saves all properties for later use. You can override this to implement your own logic for serialising the necesary values.
     *
     * @return {*}  {string}
     * @memberof BaseWidget
     */
    public serialize(): string
    {
        return JSON.stringify(this);
    }

    /**
     * function to deserialise the widget it assigns all properties of a JSON-Object ti this class Instance. You can override this to implement your own logic for deserializing the necesary values.
     *
     * @param {string} serialisationInfo
     * @memberof BaseWidget
     */
    public deserialize(info: string)
    {
        let serialisedOptions: Object = JSON.parse(info);
        Object.keys(serialisedOptions).forEach(key =>
        {
            this[key] = serialisedOptions[key];
        });
    }

    /**
     * function called when the webpart is removed.
     * Do any cleanup here
     * 
     * @memberof BaseWidget
     */
    public onRemove()
    {

    }

    /**
     * call this method to force the parent to rerender update
     *
     * @memberof BaseWidget
     */
    public _forceUpdate()
    {

    }

    /**
     * Method called after the widget is deserialised. Start loading any dynamic content here.
     *
     * @memberof BaseWidget
     */
    public onAfterDeserialisation()
     {

    }
    /**
     * Method called before the widget is serialised. It removes the user generated widget positions by default.
     *
     * @memberof BaseWidget
     */
    public onBeforeSerilisation()
    {
        // Remove autogenerated positions
        Object.keys(this.positionInfoTable).forEach(_colCount =>
        {
            const colCount: number = parseInt(_colCount);
            if (!this.positionInfoTable[colCount].userGenerated)
            {
                delete this.positionInfoTable[colCount];
            };
        });
    }
}