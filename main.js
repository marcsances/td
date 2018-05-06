/* eslint-disable no-console */

const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');

// don't change the client id if you want this example to work
const ClientId = '442789695038947328';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    titleBarStyle: 'hidden',
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL("https://www.twitch.tv/");

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null)
    createWindow();
});

// only needed for discord allowing spectate, join, ask to join
DiscordRPC.register(ClientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

function dispatchUrl(url) {
  var matchRegex = /https?:\/\/(?:www.)?twitch.tv\/([^\\\/\n]+)?(?:\/([^\\\/\n]+))?(?:\/([^\\\/\n]+))?/gi;
  var res = matchRegex.exec(url);
  if (res.length > 0) {
    switch (res[1]) {
      case undefined:
        this.details = "Twitch";
        this.state = "Twitch Home";
        this.largeImageKey = "marquii";
        this.largeImageText = "Twitch Home";
        this.smallImageKey = "twitch";
        this.smallImageText = "Twitch";
        break;
      case "directory":
        this.details = "Twitch";
        this.state = "Twitch Directory (" + (res[2]!=undefined ? res[3] : "directory home") + ")";
        this.largeImageKey = "marquii";
        this.largeImageText = "Twitch Directory (" + (res[2]!=undefined ? res[3] : "directory home") + ")";
        this.smallImageKey = "twitch";
        this.smallImageText = "Twitch";
        break;
      default:
        this.details = "Twitch";
        this.state = "Watching " + res[1];
        this.largeImageKey = "marquii";
        this.largeImageText = res[1];
        this.smallImageKey = "twitch";
        this.smallImageText = "Twitch";
        break;
    }
  } else {
    this.details = "Twitch";
    this.state = "Unknown Location";
    this.largeImageKey = "marquii";
    this.largeImageText = "Unknown Location";
    this.smallImageKey = "twitch";
    this.smallImageText = "Unknown Location";
  }
  return this;
}

async function setActivity() {
  if (!rpc || !mainWindow)
    return;

  const boops = await mainWindow.webContents.executeJavaScript('window.boops');
  console.log(mainWindow.webContents.history[mainWindow.webContents.currentIndex])
  var status = dispatchUrl(mainWindow.webContents.history[mainWindow.webContents.currentIndex])
  console.log(status.largeImageText)
  rpc.setActivity({
    details:  status.details,
    state: status.state,
    startTimestamp,
    largeImageKey: status.largeImageKey,
    largeImageText: status.largeImageText,
    smallImageKey: status.smallImageKey,
    smallImageText: status.smallImageText,
    instance: false,
  });
}


rpc.on('ready', () => {
  setActivity();

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login(ClientId).catch(console.error);