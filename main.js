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
const {dialog} = require('electron');
const {copy, paste} = require('copy-paste')
const ClientId = '442789695038947328';
const window = require('electron').BrowserWindow;
const dispatchUrl = require('./dispatcher').dispatchUrl;
const {ipcMain} = require('electron');
const {get_settings_string,set_settings_string,delete_settings} = require("./settings");
const Discord = require('discord-game');
var userscripts = "";
// TODO: dynamic loading on user request
var logger = require('electron-log');
var devMenuOverride = false; 

const winSettings = {
  width: 800,
  height: 600,
  resizable: true,
  titleBarStyle: 'visible',
  show: false,
  webPreferences: { nodeIntegration: false, preload: path.join(__dirname,'preload.js'), nativeWindowOpen: true },
  icon: path.join(__dirname, 'assets/icons/64x64.png')
};

let mainWindow = null;

function getUserscriptInjectors() {
  var injectors = "";
  usc = userscripts.split(',');
  for (var i = 0; i < usc.length; i++) {
    injectors = injectors + "var script = document.createElement('script');\
    script.type = 'text/javascript';\
    script.src = '" + usc[i] + "';\
    var head = document.getElementsByTagName('head')[0];\
    if (!head) return;\
    head.appendChild(script);";
  }
  //injectors = injectors + ";setTimeout(function a(){ document.querySelector('.tw-link').outerHTML=document.querySelector('.tw-link').outerHTML + '<a href=\'javascript:td_settings()\'><img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABqAAAAagB3kHSRQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAO9SURBVGiB7ZpPaBRXHMe/v9+4JHUTWhZpYppJbGoV1BBQjBdptrV/wEK9FVpCDyq2FwWF0ksPHnrwIJTqTSRCKyIeC6WiFLeV1qY0bY1JSk2Jlk3MSjKrMbvNZrPzXg+zO7uTnbfZ2WpmhP3Awu/93u/N/r7z3mN+b3aBOv5Cqo4P37rYI4n6iLlVaMzMBDAAZgBsjWQGM1s+hsMGyI6x4oq2HUMMRt4uvX4+XjIJyZyAQOyL493DVQk49PqlDqGJASLaQ0T5CxIs22oXbQIRl9ju8f93PBFBMl01Q6H9pz95ebI0X3Ym/2WHhHmDJPZ4m8gnDwFvaGZu8Nhnf+ulfocAIbQBAG2rmpkHCGiDljtb6rMF7H/1qx5Q8O58OfTm0RN/dhdatgBNIupLPjXArEVtu2BI4ud9yaYGhKDWgl3cA1Kya3QQYWHn+vQkraAuwG/WqDoa14bQG+0AiAAiEMG2rQ/y/mKblvXf/GMWqbSJLVsjiEQalOMzWYH0gonE/Qwepc3HI6D52Qb0H97h6WLLmYwPIZVOoS/ahq3bIlWNmZpewI+/GBj8/QFEFfGBW0IvrH8G7+5rx5EDL6EprLy/NoETUKBTX4uP+jdAY2XBDCDAAgBrNnb3Vl56yjnK/LuE699OFDdcvr7ftG0dWtqaHLHJ2QWM3TKsRmFDg5Cazyq/OB5P46/xOYAIoRBD18Po6mwqi+vteQ4/DCa9C5ifW8T500Nl9fkHh7eXCZj8Zx4XBkbV5wEXJu7M4+tv4o7zwL697XjtlRZH3PqWRqzRCDnpnmegltBvNx+U+QhAc5N6MwdKwGLW/RnAFTZyoATUQl2A39QF+E2gBDQ2aK5+KRUPAQRMwM7t7mVDqkKJvXK594ToerEZ77yt50sJDRs6w+jUw2VxM8ksskvCelq74JsAXQ9Dd0l4OUPDDyv2B2oJLWfGWMS1G0bFGN9mYCUSMxmcOX8X2SVhFYYKAidgZnYRP/1q4PqgAVNCWc0W8Czg51gcd8YfOg7lSSNTccz3sXu4NWwoD/WmANIZE9OJBSTncs5yfAU8C7g9amB8LOn6fl/F2GjS2+8DHgj0Jq6GugC/KQogquY9UjAQbOdaOgP3fUilJphlwraLXor5kUwtEPG1gm0LOPvd+8MArvqSkTcun/x440ih4djEpsYHANxb9ZSqZ0qaOFjqcAg4d+W9uMyZuwBcWdW0qoIuQ/Cuzz/dPOXwqsIP7b3UTZKikrlVMjQ//mogSDOh8bQUFDt1fMuIKtc6fvIf1OP5z7PWnygAAAAASUVORK5CYII=\' alt=\'TD settings\' /></a>' },1000);";
  injectors = injectors + ";setTimeout(function a(){ document.querySelector('.tw-link').outerHTML=document.querySelector('.tw-link').outerHTML + '<a href=\"javascript:td_settings()\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABqAAAAagB3kHSRQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAO9SURBVGiB7ZpPaBRXHMe/v9+4JHUTWhZpYppJbGoV1BBQjBdptrV/wEK9FVpCDyq2FwWF0ksPHnrwIJTqTSRCKyIeC6WiFLeV1qY0bY1JSk2Jlk3MSjKrMbvNZrPzXg+zO7uTnbfZ2WpmhP3Awu/93u/N/r7z3mN+b3aBOv5Cqo4P37rYI4n6iLlVaMzMBDAAZgBsjWQGM1s+hsMGyI6x4oq2HUMMRt4uvX4+XjIJyZyAQOyL493DVQk49PqlDqGJASLaQ0T5CxIs22oXbQIRl9ju8f93PBFBMl01Q6H9pz95ebI0X3Ym/2WHhHmDJPZ4m8gnDwFvaGZu8Nhnf+ulfocAIbQBAG2rmpkHCGiDljtb6rMF7H/1qx5Q8O58OfTm0RN/dhdatgBNIupLPjXArEVtu2BI4ud9yaYGhKDWgl3cA1Kya3QQYWHn+vQkraAuwG/WqDoa14bQG+0AiAAiEMG2rQ/y/mKblvXf/GMWqbSJLVsjiEQalOMzWYH0gonE/Qwepc3HI6D52Qb0H97h6WLLmYwPIZVOoS/ahq3bIlWNmZpewI+/GBj8/QFEFfGBW0IvrH8G7+5rx5EDL6EprLy/NoETUKBTX4uP+jdAY2XBDCDAAgBrNnb3Vl56yjnK/LuE699OFDdcvr7ftG0dWtqaHLHJ2QWM3TKsRmFDg5Cazyq/OB5P46/xOYAIoRBD18Po6mwqi+vteQ4/DCa9C5ifW8T500Nl9fkHh7eXCZj8Zx4XBkbV5wEXJu7M4+tv4o7zwL697XjtlRZH3PqWRqzRCDnpnmegltBvNx+U+QhAc5N6MwdKwGLW/RnAFTZyoATUQl2A39QF+E2gBDQ2aK5+KRUPAQRMwM7t7mVDqkKJvXK594ToerEZ77yt50sJDRs6w+jUw2VxM8ksskvCelq74JsAXQ9Dd0l4OUPDDyv2B2oJLWfGWMS1G0bFGN9mYCUSMxmcOX8X2SVhFYYKAidgZnYRP/1q4PqgAVNCWc0W8Czg51gcd8YfOg7lSSNTccz3sXu4NWwoD/WmANIZE9OJBSTncs5yfAU8C7g9amB8LOn6fl/F2GjS2+8DHgj0Jq6GugC/KQogquY9UjAQbOdaOgP3fUilJphlwraLXor5kUwtEPG1gm0LOPvd+8MArvqSkTcun/x440ih4djEpsYHANxb9ZSqZ0qaOFjqcAg4d+W9uMyZuwBcWdW0qoIuQ/Cuzz/dPOXwqsIP7b3UTZKikrlVMjQ//mogSDOh8bQUFDt1fMuIKtc6fvIf1OP5z7PWnygAAAAASUVORK5CYII=\" alt=\"TD settings\" /></a>'; },1000);";
  return injectors;
}

function injectScripts(window) {
  logger.debug("ready-to-show fired, attempt to inject userscripts");
  logger.debug("userscripts: " + userscripts);
  window.webContents.executeJavaScript("new Promise((r,x)=>{" + getUserscriptInjectors() + "r();})").then((r)=>{logger.debug("userscripts injected successfully");}).catch((r)=>{logger.debug("error injecting userscripts:" + r)});
  window.show();
}

function newWindow(event,url) {
  logger.debug("new-window, url:" + url);
  if (url=="about:blank") return;
  event.preventDefault();
  const win = new BrowserWindow(winSettings)	
  win.loadURL(url);	
  win.on('ready-to-show', () => injectScripts(win));	
  win.webContents.on('new-window', newWindow);	
  win.on('closed', () => {	
    logger.debug('closing child');	
  });	
  event.newGuest = win;
  return;
}

const defaultSettings = {
  devmode: "1",
  sharelink: "1",
  safemode: "0",
  extensionslist: "https://cdn.betterttv.net/betterttv.js,https://cdn.frankerfacez.com/script/script.min.js"
};

function init_settings() {
  Object.keys(defaultSettings).map((key) => {
    if (get_settings_string(key)=="undefined" || get_settings_string(key)==undefined) {
      set_settings_string(key, defaultSettings[key]);
    }
  });
  userscripts = get_settings_string("extensionslist");
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
    init()
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

function init() {
  const isRequireDiscord = true;
  console.log(`Trying to connect to Discord (Client ID: ${ClientId}}`);
  const rpc = Discord.create(ClientId, isRequireDiscord);
  console.log(rpc);
  setActivity(rpc);

// activity can only be set every 15 seconds
  setInterval(() => {
    setActivity(rpc);
  }, 15e3);
  const startTimestamp = new Date();
}




var share=true;


async function setActivity(rpc) {
  if (!rpc || !mainWindow)
  return;
  
  await mainWindow.webContents.executeJavaScript("new Promise((r,x)=>{\
    r(document.querySelector('[data-a-target=share-activity-toggle]').getAttribute('data-a-value')=='true');})").then((r)=>{
      share=r;
    }); 
    
    if (!share) {
      Discord.Activity.update({
        assets: {
          largeImageKey: "glitchy",
          largeImageText: "Twitch",
        }
      }).then(() => {
        console.log("set RPC activity OK");
      });
    } else {
      const boops = await mainWindow.webContents.executeJavaScript('window.boops');
      logger.debug("Location: " + mainWindow.webContents.history[mainWindow.webContents.currentIndex])
      var status = dispatchUrl(mainWindow.webContents.history[mainWindow.webContents.currentIndex])
      logger.debug(status.details + "/" + status.state + "/" + status.largeImageKey + "/" + status.largeImageText + "/" + status.smallImageKey + "/" + status.smallImageText);
      logger.debug("Setting RPC activity.");
      Discord.Activity.update({
        details:  status.details,
        state: status.state,
        timestamps: {
          startAt: startTimestamp
        },
        assets: {
          largeImageKey: status.largeImageKey,
          largeImageText: status.largeImageText,
          smallImageKey: status.smallImageKey,
          smallImageText: status.smallImageText,
        }
      }).then(() => {
        console.log("set RPC activity OK");
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
  