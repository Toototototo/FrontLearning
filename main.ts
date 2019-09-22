// 引入electron并创建一个Browserwindow
import { app, screen } from 'electron';
import * as Splashscreen from '@trodi/electron-splashscreen';
import * as path from 'path';
import * as url from 'url';
import { BackendMain } from './src/backend';

let win: any;
let serve: boolean;
const args = process.argv.slice(1);
serve = args.some(val => val === '--server');
console.log(args);

function createWindow() {

  // Init backend
  const backend = new BackendMain();
  backend.listen();

  const size = screen.getPrimaryDisplay().workAreaSize;

  const mainOpts: Electron.BrowserWindowConstructorOptions = {
    titleBarStyle: 'hiddenInset',
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    resizable: true,
    backgroundColor: '#fff',
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  };

  // configure the splashscreen
  const config: Splashscreen.Config = {
    windowOpts: mainOpts,
    templateUrl: `${__dirname}/splash-screen.html`,
    minVisible: 3500,
    delay: 0,
    splashScreenOpts: {
      width: 400,
      height: 400,
      transparent: true,
      center: true,
    },
  };
  // initialize the splashscreen handling
  win = Splashscreen.initSplashScreen(config);

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });
    win.loadURL('http://localhost:8000');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true,
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.once('ready-to-show', () => {
    win && win.show();
  });
}

try {

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
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

process.on('uncaughtException', (err) => {
  console.log('err', err);
});
