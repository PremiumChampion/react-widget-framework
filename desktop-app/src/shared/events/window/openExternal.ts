import { isNil } from "lodash";

export const EventName = "a9786d2c-5023-426f-9441-dc8c6038ee8c";

export interface EventData { url: string };

export const EventDataValid = (data: any) => {
    if (typeof data == "object" && isNil(data) == false) {
        return (data.url && typeof data.url == "string");
    }
    return false;
}