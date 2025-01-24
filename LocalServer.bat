@ECHO off & @REM Disable posting of commands to terminal
CD /d "%~dp0" & @REM Set the current working directory to the directory of this file
start http://localhost:8000 & @REM Open the local server in the default web browser
CALL python -m http.server & @REM Activate local server on http://localhost:8000/