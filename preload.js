const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("uvDesktop", {
  savePng: (dataUrl) => ipcRenderer.invoke("save-png", dataUrl)
});
