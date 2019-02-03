/*
td - Twitch client with Discord RPC support
Copyright 2018, Marc Sances

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
const pjson = require("./package.json");
const app_ver = pjson.version;
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');
const {dialog} = require('electron');
const {copy, paste} = require('copy-paste')
const ClientId = '442789695038947328';
const window = require('electron').BrowserWindow;
const dispatchUrl = require('./dispatcher').dispatchUrl;
const {ipcMain} = require('electron');
const {get_settings_string,set_settings_string,delete_settings} = require("./settings");

const userscripts = ['https://cdn.betterttv.net/betterttv.js', 'https://cdn.frankerfacez.com/script/script.min.js'];
// TODO: dynamic loading on user request
var logger = require('electron-log');
var devMenuOverride = false; 

const winSettings = {
  width: 800,
  height: 600,
  resizable: true,
  titleBarStyle: 'hidden',
  show: false,
  webPreferences: { nodeIntegration: false, preload: path.join(__dirname,'preload.js'), nativeWindowOpen: true },
  icon: path.join(__dirname, 'assets/icons/64x64.png')
};

let mainWindow = null;

function getUserscriptInjectors() {
  var injectors = "";
  for (var i = 0; i < userscripts.length; i++) {
    injectors = injectors + "var script = document.createElement('script');\
    script.type = 'text/javascript';\
    script.src = '" + userscripts[i] + "';\
    var head = document.getElementsByTagName('head')[0];\
    if (!head) return;\
    head.appendChild(script);";
  }
  injectors = injectors + ";setTimeout(function a(){ document.querySelector(\"[data-a-target='settings-dropdown-link']\").outerHTML = document.querySelector(\"[data-a-target='settings-dropdown-link']\").outerHTML + \"<a class='tw-interactable' data-a-target='td-dropdown-link' href='javascript:td_settings()'><div class='tw-align-items-center tw-c-text-alt tw-flex tw-pd-x-2 tw-pd-y-05'><div class='tw-align-items-center tw-flex tw-mg-r-1'><svg class='tw-svg__asset tw-svg__asset--inherit tw-svg__asset--navsettings' width='18px' height='18px' version='1.1' viewBox='0 0 18 18' x='0px' y='0px'><path clip-rule='evenodd' d='M15.03,5.091v4.878l-2,2H8.151l-3.061,3.061L2.97,12.908l3.061-3.06V4.97l2-2h4.879L8.97,6.909l2.121,2.121L15.03,5.091z' fill-rule='evenodd'></path></svg></div><p class=''>Td settings</p></div></a>\"; },1000);";
  
  return injectors;
}

function injectScripts(window) {
  logger.debug("ready-to-show fired, attempt to inject userscripts");
  logger.debug("userscripts: " + userscripts);
  window.webContents.executeJavaScript("new Promise((r,x)=>{" + getUserscriptInjectors() + "r();})").then((r)=>{logger.debug("userscripts injected successfully");});
  window.show();
}

function newWindow(event,url) {
  logger.debug("new-window, url:" + url);
  return;
}

const defaultSettings = {
  devmode: "1",
  sharelink: "1",
  safemode: "0"
};

function init_settings() {
  Object.keys(defaultSettings).map((key) => {
    if (get_settings_string(key)=="undefined" || get_settings_string(key)==undefined) {
      set_settings_string(key, defaultSettings[key]);
    }
  });
}

function createWindow() {
  logger.transports.console.level = 'debug';
  logger.transports.file.level = 'debug';
  logger.transports.file.file = __dirname + '/log.txt';
  
  logger.debug("argv: " + process.argv);
  logger.info("Welcome to Td, version " + app_ver);
  console.log = logger.debug;
  mainWindow = new BrowserWindow(winSettings);
  const {app, Menu} = require('electron')
  init_settings();
  const template = [
    {
      label: 'Developer Menu',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {label: 'Copy current URL', click() {wc=window.getFocusedWindow().webContents;copy(wc.history[wc.currentIndex])}},
        {label: 'Version', click() { dialog.showMessageBox({message: "Td version " + app_ver + "\nNode v" + process.versions.node + "\nClient v" + process.versions.electron + "\nRenderer v" + process.versions.chrome + "\nEngine v" + process.versions.v8, buttons: ["OK"] })}},
        {label: 'Settings...', click() { window.getFocusedWindow().webContents.executeJavaScript("td_settings()")}}
      ]
    },
  ];
  
  const menu = Menu.buildFromTemplate(template)
  mainWindow.setMenu(get_settings_string("devmode")=="1" || devMenuOverride ? menu : null);
  Menu.setApplicationMenu(get_settings_string("devmode")=="1" || devMenuOverride ? menu : null);
  var user = process.argv.length>=3 ? process.argv[2] : "";
  mainWindow.loadURL("https://www.twitch.tv/" + user);
  
  mainWindow.on('ready-to-show', () => {
    injectScripts(mainWindow)
  });
  
  mainWindow.webContents.on('new-window', newWindow);
  
  mainWindow.once('closed', () => {
    logger.debug("unloading");
    mainWindow = null;
  });
}



app.on('ready', createWindow);

app.on('window-all-closed', () => {
  logger.debug("window-all-closed, quitting");
  logger.info("App quit triggered, closing");
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null)
  createWindow();
});

DiscordRPC.register(ClientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();


var share=true;


async function setActivity() {
  if (!rpc || !mainWindow)
  return;
  
  await mainWindow.webContents.executeJavaScript("new Promise((r,x)=>{\
    r(document.querySelector('[data-a-target=share-activity-toggle]').getAttribute('data-a-value')=='true');})").then((r)=>{
      share=r;
    }); 
    
    if (!share) {
      rpc.setActivity({
        largeImageKey: "glitchy",
        largeImageText: "Twitch",
        instance: false,
      });
    } else {
      const boops = await mainWindow.webContents.executeJavaScript('window.boops');
      logger.debug("Location: " + mainWindow.webContents.history[mainWindow.webContents.currentIndex])
      var status = dispatchUrl(mainWindow.webContents.history[mainWindow.webContents.currentIndex])
      logger.debug(status.details + "/" + status.state + "/" + status.largeImageKey + "/" + status.largeImageText + "/" + status.smallImageKey + "/" + status.smallImageText);
      logger.debug("Setting RPC activity.");
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
  }
  
  const ws = {
    width: 800,
    height: 600,
    resizable: true,
    titleBarStyle: 'hidden',
    webPreferences: { nativeWindowOpen: true,  preload: path.join(__dirname,'ipc.js'), webSecurity: false },
    icon: path.join(__dirname, 'assets/icons/64x64.png'),
    
  };
  


  function showsettings() {
    nwin = new BrowserWindow(ws);
    //nwin.setMenu(null);
    
    nwin.loadURL(url.format({
      pathname: path.join(__dirname, 'assets', 'html', 'settings.html'),
      protocol: 'file:',
      slashes: true
    }));
    nwin.show();
  }
  
  rpc.on('ready', () => {
    setActivity();
    
    // activity can only be set every 15 seconds
    setInterval(() => {
      setActivity();
    }, 15e3);
  });
  
  logger.info("Attempt to connect to Discord RPC");
  rpc.login(ClientId).catch(logger.error);
  
  ipcMain.on('sync', (event,arg) => {
    logger.debug("Received synchronous RPC call " + arg);
    if (arg.length >=10 && arg.substring(0,9) == "gsettings") {
      event.returnValue = get_settings_string(arg.substring(10));
      return;
    };
    switch (arg) {
      case "app_ver":
        event.returnValue = app_ver;
        break;
      case "node_ver":
        event.returnValue = process.versions.node;
        break;
      case "electron_ver":
        event.returnValue = process.versions.electron;
        break;
      case "chrome_ver":
        event.returnValue = process.versions.chrome;
        break;
      case "v8_ver":
        event.returnValue = process.versions.v8;
        break;  
      default:
        logger.error("ERROR: no handler for RPC call " + arg);
        event.returnValue = null;
        break;
    }
  });

  ipcMain.on('async', (event, arg) => {
    logger.debug("Received asynchronous RPC call " + arg);

    if (arg.length >= 10 && arg.substring(0,9) == "wsettings") {
      set_settings_string(arg.substring(10, arg.indexOf(',')),arg.substring(arg.indexOf(',')+1));
      return;
    }
    switch (arg) {
      case "openSettings":
        showsettings();
        break;
        
      case "deleteSettings":
        delete_settings();
        break;
      default:
        logger.error("ERROR: no handler for RPC call " + arg);
        break;
    }
  });
  