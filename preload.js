var logger = require('electron-log');

window.console.log = logger.log;
window.console.warn = logger.warn;
window.console.info = logger.info;
window.console.error = logger.error;
window.console.debug = logger.debug;