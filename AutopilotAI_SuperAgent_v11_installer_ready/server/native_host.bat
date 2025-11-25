@echo off
REM Native host wrapper - reads from stdin/stdout. Replace with proper native host binary in production.
node "%~dp0\..\server\native_host_entry.js"
