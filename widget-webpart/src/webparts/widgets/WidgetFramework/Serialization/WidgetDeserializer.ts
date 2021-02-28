
import { BaseWidget } from '../BaseWidget';
import { WidgetType } from '../Enums/WidgetType';
import { ISerialisationInfo } from './ISerialisationInfo';
import { Serializer } from './Serializer';

class _WidgetDeserializer extends Serializer<BaseWidget>
{
    _registered: {
        [Type: number]: () => BaseWidget
    } = {};

    register(WidgetType: WidgetType, constructor: () => BaseWidget)
    {
        this._registered[WidgetType] = constructor;
    }

    deserialize(SerialisationInfo: ISerialisationInfo){
        let widget = this._registered[SerialisationInfo.Type]();
        widget.deserialize(SerialisationInfo.Serialisation);
        widget.onAfterDeserialisation();
        return widget;
    }
}

export const WidgetDeserializer = new _WidgetDeserializer();