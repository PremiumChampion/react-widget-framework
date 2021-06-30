import { isNil } from "lodash";

export const EventName = "07383952-358e-4af2-9ce9-f9c9b2badc71";

export interface EventData { };

export const EventDataValid = (data: any) => {
    return typeof data == "object" && isNil(data) == false;
}