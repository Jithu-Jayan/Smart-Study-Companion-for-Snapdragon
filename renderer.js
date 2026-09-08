const { ipcRenderer } = require('electron');

let mediaRecorder;
let audioChunks = [];

document.getElementById('startBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');

  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

    mediaRecorder.onstop = async () => {
      const fs = require('fs');
      const path = require('path');
      const os = require('os');

      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const arrayBuffer = await audioBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const filePath = path.join(os.tmpdir(), 'recording.webm');
      fs.writeFileSync(filePath, buffer);

      status.innerText = 'Transcribing...';

      try {
        const transcript = await ipcRenderer.invoke('transcribe-audio', filePath);
        document.getElementById('transcript').innerText = transcript;
        status.innerText = 'Done.';
      } catch (err) {
        console.error(err);
        status.innerText = 'Error: ' + err;
      }
    };

    mediaRecorder.start();
    status.innerText = 'Listening...';
    document.getElementById('startBtn').innerText = 'Stop Listening';
  } else {
    mediaRecorder.stop();
    status.innerText = 'Stopped';
    document.getElementById('startBtn').innerText = 'Start Listening';
  }
});