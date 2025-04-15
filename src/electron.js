const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080
    // fullscreen: true
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);