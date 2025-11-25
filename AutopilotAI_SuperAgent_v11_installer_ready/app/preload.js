const { contextBridge, ipcRenderer, shell } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url)=> shell.openExternal(url),
  send: (channel, data)=> ipcRenderer.send(channel, data),
  on: (channel, func)=> ipcRenderer.on(channel, (e, ...args)=> func(...args))
});
