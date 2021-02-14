import React from 'react';
import { v4 } from 'uuid';
import { BaseWidget } from '../CustomGrid/BaseWidget';
import NumberWidgetRenderer from './NumberWidgetRenderer';

export class NumberWidget extends BaseWidget
{
    public serialize(): string
    {
        throw new Error('Method not implemented.');
    }
    public deserialize(info: string)
    {
        throw new Error('Method not implemented.');
    }
    numb: number;   
    /**
     *
     */
    constructor(number:number) {
        super();
        this.numb = number
    }
    public id: string = v4();
    public width: number = 1;
    public height: number = 1;
    public displayDragHandle = true;
    public contentDragable = false;
    public render(): JSX.Element
    {
        return React.createElement(NumberWidgetRenderer, { numb: this.numb });
    }
}