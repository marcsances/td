var logger = require('electron-log');
var mainWindow = require('./main');

window.console.log = logger.log;
window.console.warn = logger.warn;
window.console.info = logger.info;
window.console.error = logger.error;
window.console.debug = logger.debug;

window.td_settings = function() {
    alert("Placeholder");
}