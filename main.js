const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { execFile } = require('child_process');

const WHISPER_EXE = path.join(__dirname, 'whisper.cpp', 'build', 'bin', 'Release', 'whisper-cli.exe');
const WHISPER_MODEL = path.join(__dirname, 'whisper.cpp', 'models', 'ggml-base.en.bin');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('transcribe-audio', async (event, webmPath) => {
  const wavPath = webmPath.replace('.webm', '.wav');

  return new Promise((resolve, reject) => {
    execFile('ffmpeg', ['-y', '-i', webmPath, '-ar', '16000', '-ac', '1', wavPath], (err) => {
      if (err) {
        reject('ffmpeg error: ' + err.message);
        return;
      }

      execFile(WHISPER_EXE, ['-m', WHISPER_MODEL, '-f', wavPath, '-nt'], (err2, stdout, stderr) => {
        if (err2) {
          reject('whisper error: ' + err2.message);
          return;
        }
        resolve(stdout.trim());
      });
    });
  });
});