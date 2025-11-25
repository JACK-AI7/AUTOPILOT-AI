
Installer build instructions (Windows - unsigned):
1. Install NSIS (https://nsis.sourceforge.io/Download) and Node.js.
2. From project root, build the Electron app with electron-builder:
   cd app
   npm install
   npm install --save-dev electron-builder electron
   npx electron-builder --win nsis
3. Alternatively, use the provided NSIS script:
   - Ensure app and server folders are present in the installer folder structure.
   - Open NSIS, load installer\autopilot_installer.nsi, and compile to create AutopilotAI-setup.exe
4. The installer will place files in C:\Program Files\AutopilotAI\ and create shortcuts.
5. To register native messaging host, run the included register_native_host.reg (this requires user consent).
6. The installer does NOT automatically install the Chrome extension; it will open a browser window to the extension store page for the user to click 'Add to Chrome'.
