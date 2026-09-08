Smart Study Companion for Snapdragon is an on-device AI study assistant designed for Snapdragon-powered AI PCs, built to demonstrate how the Snapdragon NPU enables fast, private, and continuous AI workloads without relying on the cloud. The app currently captures live lecture audio through the microphone and transcribes it in real time using a locally-run whisper.cpp speech recognition engine, with ffmpeg handling audio conversion — the entire pipeline runs offline, ensuring sensitive lecture and study data never leaves the device. Built with Electron for the app shell and Node.js for local processing, the project is actively being extended to route inference through the Qualcomm QNN SDK / ONNX Runtime QNN Execution Provider to leverage the Snapdragon NPU directly, alongside planned features like screen-synced note generation via OCR, contextual study insights, and on-device quiz generation — combining computer vision, speech recognition, and multimodal AI into a practical, privacy-first tool that showcases the real-world advantages of local NPU-accelerated inference over traditional cloud-dependent AI applications.


# Smart Study Companion for Snapdragon

An on-device AI study assistant that listens, watches, and helps — built to run entirely locally on Snapdragon-powered AI PCs, using the NPU for fast, private, always-on inference.

## Why on-device?

Lecture recordings, exam-adjacent screen activity, and personal notes are sensitive data students shouldn't have to send to the cloud. Snapdragon's NPU lets this app run continuous AI workloads — speech recognition, screen understanding, note generation — locally, with low latency and zero data leaving the device.

## Current Features

- **Live Speech Transcription** — Records lecture audio via microphone and transcribes it in real time using [whisper.cpp](https://github.com/ggerganov/whisper.cpp), fully offline.
- *(Planned)* Screen-synced notes — OCR-based screen capture linked to transcript timestamps
- *(Planned)* On-device quiz generation from notes
- *(Planned)* NPU-accelerated inference via Qualcomm QNN SDK / ONNX Runtime QNN Execution Provider

## Tech Stack

- **App shell:** Electron (Node.js + Chromium)
- **Speech recognition:** whisper.cpp (C++, compiled locally)
- **Audio processing:** ffmpeg (webm → wav conversion)
- **Target inference backend:** Qualcomm AI Engine Direct (QNN) via ONNX Runtime — *in progress*

## Architecture
Microphone → MediaRecorder (renderer) → recording.webm
→ ffmpeg conversion → recording.wav
→ whisper-cli.exe (whisper.cpp) → transcript text
→ displayed live in app UI


All processing happens locally — no network calls, no cloud APIs.

## Setup

### Prerequisites
- Node.js (LTS)
- CMake
- Visual Studio Build Tools (Desktop development with C++ workload)
- ffmpeg

### Installation

```bash
git clone https://github.com/Jithu-Jayan/Smart-Study-Companion-for-Snapdragon.git
cd Smart-Study-Companion-for-Snapdragon

# Install app dependencies
npm install

# Build whisper.cpp
cd whisper.cpp
cmake -B build
cmake --build build --config Release

# Download the speech model
cd models
curl -L -o ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin
cd ../..
```

### Run

```bash
npm start
```

Click **Start Listening**, speak, click **Stop Listening** — the transcript appears in the app.

## Roadmap

- [ ] Route whisper inference through Snapdragon NPU via QNN Execution Provider
- [ ] Screen capture + OCR for slide/document context
- [ ] Sync transcript timestamps with captured screen content
- [ ] Local LLM-based note structuring and quiz generation
- [ ] Packaged installer for distribution

## Why This Matters for Snapdragon AI PCs

This app is designed to demonstrate what's only possible with on-device NPU acceleration: continuous multimodal AI (speech + vision + context) running for hours during a study session, with no cloud round-trip latency and no sensitive data ever leaving the device.
