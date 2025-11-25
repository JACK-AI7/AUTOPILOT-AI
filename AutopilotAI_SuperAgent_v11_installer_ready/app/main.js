const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const cp = require('child_process');

let serverProcess = null;
function startServer() {
  const serverPath = path.join(__dirname, '..', 'server');
  // start server via node index.js in the server folder
  serverProcess = cp.spawn(process.execPath, [path.join(serverPath, 'index.js')], { cwd: serverPath, stdio: 'inherit' });
  serverProcess.on('error', (e) => console.error('Server error', e));
  serverProcess.on('exit', (code) => console.log('Server exited', code));
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer.html'));

  // open devtools optionally
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  startServer();
  createWindow();
  app.on('activate', function () { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
  if (serverProcess) serverProcess.kill();
});
