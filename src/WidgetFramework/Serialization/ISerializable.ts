export interface ISerializable
{
    deserialize: (info: string) => void;
    serialize: () => string;
}