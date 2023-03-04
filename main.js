const { app, BrowserWindow, ipcMain, Notification, Tray } = require("electron");
const path = require("path");

const FastSpeedtest = require("fast-speedtest-api");

const createWindow = () => {
  const win = new BrowserWindow({
    backgroundColor: "#FFF",
    width: 500,
    height: 500,
    show: false, // n'affiche pas la fenêtre au démarrage
    frame: true, // enlève la barre de titre
    fullscreenable: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      plugins: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  });
  win.loadFile("./public/index.html").then((r) => console.log(r));
  return win;
};

require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});

const token = "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm";

ipcMain.handle("req_speedTest", async () => {
  let speedtest = new FastSpeedtest({
    token: token, // required
    verbose: false, // default: false
    timeout: 1000, // default: 5000
    https: true, // default: true
    urlCount: 5, // default: 5
    bufferSize: 8, // default: 8 is the
    unit: FastSpeedtest.UNITS.Mbps, // default: Bps
  });
  return new Promise((resolve, reject) => {
    speedtest
      .getSpeed()
      .then((s) => {
        console.log(`Speed: ${s} Mbps`);
        resolve(s);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
});

let tray = null;
app.whenReady().then(() => {
  createWindow()
  tray = new Tray("public/networkTemplate.png");
  tray.on("click", () => {
    createWindow().show();
  });
});
