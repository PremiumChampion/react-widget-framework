import { BrowserWindow, ipcMain, shell } from "electron";
import { Events } from "../shared/index";

export class WindowEvents {

    public static add() {
        ipcMain.on(Events.Window.Close.EventName, WindowEvents.onWindowCloseEvent.bind(this));
        ipcMain.on(Events.Window.OpenExternal.EventName, WindowEvents.onOpenExternalUrl.bind(this));
    }

    public static remove() {
        ipcMain.removeListener(Events.Window.Close.EventName, WindowEvents.onWindowCloseEvent.bind(this))
        ipcMain.removeListener(Events.Window.OpenExternal.EventName, WindowEvents.onOpenExternalUrl.bind(this));
    }

    private static onWindowCloseEvent(event: Electron.IpcMainEvent, data: Events.Window.Close.EventData) {
        if (Events.Window.Close.EventDataValid(data)) {
            BrowserWindow.fromId(event.sender.id).close();
        }
    }

    private static onOpenExternalUrl(event: Electron.IpcMainEvent, data: Events.Window.OpenExternal.EventData) {
        if (Events.Window.OpenExternal.EventDataValid(data)) {
            shell.openExternal(data.url);
        }
    }
}