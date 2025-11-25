AutopilotAI Desktop (v9) - Electron + Backend


How to run locally on Windows:

1. Install Node.js (18+) and Git.
2. Open terminal (PowerShell) in the project root (this folder).
3. Install root dependencies: (this installs electron-builder dev deps and server deps)
   npm install
   cd app
   npm install
   cd ../server
   npm install

4. Start the app for development:
   cd ../app
   npm start

The Electron main process will spawn the local server (server/index.js) and open the renderer window which loads the UI.

To build an installer for Windows:
- Install electron-builder (dev dependency). Update package.json scripts as needed, then run:
  cd app
  npx electron-builder --win nsis

Security:
- The GEMINI_API_KEY is stored in server/.env for local dev. For production, set it in the host environment variables.
