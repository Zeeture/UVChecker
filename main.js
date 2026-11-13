const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 900,
    minHeight: 650,
    backgroundColor: "#202124",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile("index.html");
}

ipcMain.handle("save-png", async (_event, data) => {
  const result = await dialog.showSaveDialog({
    title: "导出 UV 棋盘格 PNG",
    defaultPath: "UV_Checker.png",
    filters: [{ name: "PNG Image", extensions: ["png"] }]
  });
  if (result.canceled || !result.filePath) return { canceled: true };
  const buffer = Buffer.from(data.replace(/^data:image\/png;base64,/, ""), "base64");
  fs.writeFileSync(result.filePath, buffer);
  return { canceled: false, filePath: result.filePath };
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
