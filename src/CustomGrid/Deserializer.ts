import { BaseWidget } from './BaseWidget';
import { WidgetType } from './Enums/WidgetType';
import { ISerialisationInfo } from './Interfaces/ISerialisationInfo';

class _Deserializer
{
    private _registeredWidgets: {
        [WidgetType: number]: () => BaseWidget
    } = {};
    registerWidget(WidgetType: WidgetType, constructor: () => BaseWidget)
    {
        this._registeredWidgets[WidgetType] = constructor;
    }
    deserializeWidget(SerialisationInfo: ISerialisationInfo){
        let widget = this._registeredWidgets[SerialisationInfo.WidgetType]();
        widget.deserialize(SerialisationInfo.Serialisation);
        return widget;
    }
}
export const Deserializer = new _Deserializer();