"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 引入electron并创建一个Browserwindow
var electron_1 = require("electron");
var Splashscreen = require("@trodi/electron-splashscreen");
var path = require("path");
var url = require("url");
var backend_1 = require("./src/backend");
var win;
var serve;
var args = process.argv.slice(1);
serve = args.some(function (val) { return val === '--server'; });
console.log(args);
function createWindow() {
    // Init backend
    var backend = new backend_1.BackendMain();
    backend.listen();
    var size = electron_1.screen.getPrimaryDisplay().workAreaSize;
    var mainOpts = {
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
    var config = {
        windowOpts: mainOpts,
        templateUrl: __dirname + "/splash-screen.html",
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
            electron: require(__dirname + "/node_modules/electron"),
        });
        win.loadURL('http://localhost:8000');
    }
    else {
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
    win.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    win.once('ready-to-show', function () {
        win && win.show();
    });
}
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    electron_1.app.on('ready', createWindow);
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
process.on('uncaughtException', function (err) {
    console.log('err', err);
});
//# sourceMappingURL=main.js.map