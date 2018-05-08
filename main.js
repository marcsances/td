/*
td - Twitch client with Discord RPC support
Copyright 2018, Marc Sances

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');

const ClientId = '442789695038947328';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    titleBarStyle: 'hidden',
    webPreferences: { nodeIntegration: false },
    icon: path.join(__dirname, 'assets/icons/64x64.png')
  });
  //mainWindow.setMenu(null);
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

DiscordRPC.register(ClientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();
const sysurls = ['directory','dashboard'];
const featured = ['summit1g','the8bitdrummer','sethdrumstv','lvpes','halifax','ninja'];

function dispatchUrl(url) {
  var matchRegex = /https?:\/\/(?:www.)?twitch.tv\/([^\\\/\n]+)?(?:\/([^\\\/\n]+))?(?:\/([^\\\/\n]+))?/gi;
  var res = matchRegex.exec(url);
  if (res.length > 0) {
    this.smallImageKey = "twitch";
    this.smallImageText = "Twitch";
    this.details = "Twitch";
    switch (res[1]) {
      case undefined:
        this.state = "Twitch Home";
        this.largeImageKey = "glitchy";
        this.largeImageText = this.state;
        break;
      case "directory":
        this.state = "Twitch Directory (" + (res[2]!=undefined ? (res[2]=="following" ? "following" : res[3]) : "home") + ")";
        this.largeImageKey = "glitchy";
        this.largeImageText = this.state;;
        break;
      default:
        if (featured.indexOf(res[1])!=-1) {
          this.largeImageKey = res[1];  
        } else {
          this.largeImageKey = "glitchy";
        }
        this.state = "Watching " + res[1];
        this.largeImageText = res[1];
        break;
    }
  } else {
    this.details = "Twitch";
    this.state = "Unknown Location";
    this.largeImageKey = "glitchy";
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
