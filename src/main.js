// アプリケーション作成用のモジュールを読み込み
require("ts-node").register();
require('http');
require('./index.ts')
const {app, BrowserWindow} = require('electron');

// メインウィンドウ
let mainWindow;

function createWindow () {
  // メインウィンドウを作成します
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  });

  mainWindow.maximize();

  mainWindow.loadURL('http://localhost:3000');

  if (!app.isPackaged) {
    mainWindow.openDevTools();
  }

  // メインウィンドウが閉じられたときの処理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
}

//  初期化が完了した時の処理
app.on('ready', createWindow);

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
  // macOSのとき以外はアプリケーションを終了させます
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', () => {
  // メインウィンドウが消えている場合は再度メインウィンドウを作成する
  if (mainWindow === null) {
    createWindow();
  }
});