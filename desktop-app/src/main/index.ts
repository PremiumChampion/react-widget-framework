import { app, BrowserWindow, ipcMain, screen, shell } from 'electron';
import { WindowEvents } from './windowEvents';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const windowWidth = Math.floor(width * 0.2);
  const mainWindow = new BrowserWindow({
    height: height,
    width: windowWidth,
    webPreferences: {
      nodeIntegration: true,
      offscreen: false,
      // ! webSecurity: important for loading webpack output
      webSecurity: false,
      allowRunningInsecureContent: false,
      nodeIntegrationInSubFrames: false,

    },
    transparent: true,
    frame: false,
    resizable: true,
    alwaysOnTop: true,
    x: width - windowWidth,
    y: 0,
    show: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    WindowEvents.add();
  });

  mainWindow.once("close", () => {
    WindowEvents.remove();
  })

  const openWindowInExternalBrowser = (event: Electron.Event, url: string) => {
    // console.log("opening url", url)
    let hostname = new URL(url).hostname;
    // make sure local urls stay in electron perimeter
    if (hostname == "localhost") {
      return;
    }

    // and open every other protocols on the browser      
    event.preventDefault();

    shell.openExternal(url);
  }

  mainWindow.webContents.on("will-navigate", openWindowInExternalBrowser);
  mainWindow.webContents.on('new-window', openWindowInExternalBrowser);

};



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
