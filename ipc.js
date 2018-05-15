const {ipcRenderer} = require('electron');

window.ipc_sendQuery = function(message) {
    return ipcRenderer.sendSync('sync', message); // sends rpc message to open settings
}

window.ipc_sendMessage = function(message) {
    ipcRenderer.send('async',message);
}