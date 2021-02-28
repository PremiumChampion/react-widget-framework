/**
 * A class to create and manage custom events, handlers and listeners.
 *
 * @export
 * @class Custom_Event
 */
export class Custom_Event {
    /**
     * the generated event
     *
     * @private
     * @type {Event}
     * @memberof Custom_Event
     */
    private ev: Event;

    /**
     * Creates an instance of Custom_Event.
     * @param {string} eventType the type of the event
     * @param {*} data the payload of the event
     * @memberof Custom_Event
     */
    constructor(eventType: string, data: any) {
        this.ev = document.createEvent("Event");
        this.ev["data"] = data;
        this.ev.initEvent(eventType);
    }

    /**
     * Dispatches the event
     *
     * @memberof Custom_Event
     */
    dispatch = () => {
        window.dispatchEvent(this.ev);
    }

    /**
     * Fires a new Custom_Event with the specified EventType and data payload
     *
     * @static
     * @param {string} eventType the type of the event
     * @param {*} data the data to send as payload
     * @memberof Custom_Event
     */
    static fire(eventType: string, data: any) {
        new Custom_Event(eventType, data).dispatch();
    }

    /**
     * Adds a Event Listener with the specified EventType and EventListener
     *
     * @static
     * @param {string} eventType the type of the event
     * @param {(data: any) => void} listener the listener of the event
     * @return {*} the event handler reference
     * @memberof Custom_Event
     */
    static addEventListener(eventType: string, listener: (data: any) => void) {
        
        if (window["Custom_Events"] === undefined) {
            window["Custom_Events"] = {};
        }

        if (window["Custom_Events"][eventType] === undefined) {
            window["Custom_Events"][eventType] = []
        }

        var eventHandler: (ev: Event) => void = (ev) => {
            listener(ev["data"]);
        }

        window["Custom_Events"][eventType].push(eventHandler);

        window.addEventListener(eventType, eventHandler);

        return eventHandler;
    }

    /**
     * Removes all event listeners or a single event listener from the specified EventType
     *
     * @static
     * @param {string} eventType the type of the event
     * @param {(ev:Event) => void} [eventHandlerReference] The event handler reference for the listener to be deleted. If omitted all event listeners from the selected event type will be removed.
     * @memberof Custom_Event
     */
    static removeEventListener(eventType: string, eventHandlerReference?: (ev: Event) => void) {

        if (window["Custom_Events"] === undefined) {
            window["Custom_Events"] = {};
        }

        if (window["Custom_Events"][eventType] === undefined) {
            window["Custom_Events"][eventType] = [];
        }

        if (eventHandlerReference) {
            
            let eventIndex = window["Custom_Events"][eventType].indexOf(eventHandlerReference);
            
            if (eventIndex !== -1) {
                window["Custom_Events"][eventType].splice(eventIndex, 1);
            }
            
            window.removeEventListener(eventType, eventHandlerReference);

        } else {
            
            window["Custom_Events"][eventType].forEach(Custom_EventHandler => {
                window.removeEventListener(eventType, Custom_EventHandler);
            });

            window["Custom_Events"][eventType] = [];
        }
    }

}