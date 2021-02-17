import { ISerialisationInfo } from './ISerialisationInfo';
import { ISerializable } from './ISerializable';

export abstract class Serializer<T extends ISerializable>{
    public _registered: {
        [Type: number]: () => T
    } = {};
    register(Type: number, constructor: () => T)
    {
        this._registered[Type] = constructor;
    }
    deserialize(SerialisationInfo: ISerialisationInfo){
        let instance = this._registered[SerialisationInfo.Type]();
        instance.deserialize(SerialisationInfo.Serialisation);
        return instance;
    }
}