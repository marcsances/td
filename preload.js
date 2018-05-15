var logger = require('electron-log');
const path = require('path');
const {ipcRenderer} = require('electron');

window.console.log = logger.log;
window.console.warn = logger.warn;
window.console.info = logger.info;
window.console.error = logger.error;
window.console.debug = logger.debug;

window.td_settings = function() {
    ipcRenderer.send('async', 'openSettings'); // sends rpc message to open settings
}