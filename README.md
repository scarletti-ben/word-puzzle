# WORK IN PROGRESS

# Overview
This project started as a learning exercise to improve and practice my `HTML`, `CSS` and `JavaScript`. 

# Project Structure
Important files:
- `index.html`
- `script.js`
- `styles.css`
- `answers.txt`
- `dictionary.txt`
```
word-puzzle/
├── answers.js
├── dictionary.txt
├── index.html
├── script.js
├── styles.css
└── styles.css
```

# Features
- Colour coded keyboard and keys based on location of the letters in the answer
- New word generated every refresh
- Simple interface with a top bar containing helpful buttons
- A button that adds a hint, giving you a letter in the word
- A button that shows you what the answer is, if you want to check early
- Native mouse and touch functionality, with a virtual keyboard layout that scales based on device
- Native keyboard functionality if using a physical keyboard

# What I Learned in Development of this Project
This list may contain a great many inaccuracies, as the fact that I learned it does not mean that it is true!

### Localhost
- In networking, a `host` is a server
- Putting the server on your computer and allowing said computer to make requests is a `loopback`
- The IP address for `localhost` is found at `127.0.0.1`
- Web hosting sites are `remote hosts`
- Normally a website URL in your browser `https://www.example.com` has an associated IP address `104.26.2.33`
    - The `DNS lookup` for `localhost` leads to `127.0.0.1`
- The number after the IP address is the `port number`, for instance `127.0.0.1:8000` is port `8000`

### Python Local Server
- You can set up a local server in the current folder with the simple command `python -m http.server`
- This will usually open port 8000 on localhost `127.0.0.1:8000`
- If you open this in your browser it should process and render the `index.html` in that folder
- If you open a folder without `index.html` it will open as a directory browser and you can browse files and subfolders
- You can access other files in the root of your server by filename `http://localhost:8000/script.js`
    - You can also access subdirectories `http://localhost:8000/subdirectory`

```batch
@ECHO off & @REM Disable posting of commands to terminal
CD /d "%~dp0" & @REM Set the current working directory to the directory of this file
start http://localhost:8000 & @REM Open the local server in the default web browser
CALL python -m http.server & @REM Activate local server on http://localhost:8000/
```

An example log for a simple server is below
```powershell
PS C:\...\word-puzzle> python -m http.server
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
::1 - - [02/Jan/2025 06:55:52] "GET / HTTP/1.1" 200 -
::1 - - [02/Jan/2025 06:55:52] "GET /styles.css HTTP/1.1" 200 -
::1 - - [02/Jan/2025 06:55:52] "GET /script.js HTTP/1.1" 200 -
::1 - - [02/Jan/2025 06:55:52] "GET /dictionary.txt HTTP/1.1" 200 -
::1 - - [02/Jan/2025 06:55:53] code 404, message File not found
::1 - - [02/Jan/2025 06:55:53] "GET /favicon.ico HTTP/1.1" 404 -
::1 - - [02/Jan/2025 06:56:11] "GET / HTTP/1.1" 304 -
::1 - - [02/Jan/2025 06:59:45] "GET / HTTP/1.1" 304 -
::1 - - [02/Jan/2025 06:59:45] "GET /script.js HTTP/1.1" 200 -
::1 - - [02/Jan/2025 06:59:45] "GET /dictionary.txt HTTP/1.1" 304 -
```
- Status code `200` means **OK**: The request was successful, and the server responded with the requested resource
- Status code `304` means **Not Modified**: The resource hasn't been modified since last access, use cached version
- Status code `404` means **Not Found**: The resource could not be found on the server

### Reasons to Use Local Server
- You can open an `index.html` file in your browser as is, but it will struggle to access other files on your system
    - It will often throw `CORS` related errors
- You can avoid these errors with a local server as you are now allowing `GET` and `POST` events to pass through the server
    - You can now access local files
    - These events can be read in the terminal that ran `python -m http.server`

### Accessing Files
- Sites without a local server can only access files directly referenced in `index.html` and may still have issues
- Sites with a local or remote server can access any files below the root directory of the server, never above
    - A file deeper in the structure can make relative imports from higher directories but still never above the root of the server

### Clearing Browser Cache
When developing a site using `HTML` / `CSS` / `JavaScript` you may make tweaks to files, and want to see the result. In some cases, your browser may not actually update to show the changes as it is still using its cached version of the resource. In cases such as these, browsers have a "hard reload" option that clears the cache and reloads the page. In `Google Chrome` you can right click the refresh button while in `Developer tools` (Hotkey `F12`)


### Use of CSS Variables
Much like other languages, if `CSS` is indeed a language, you can define reusable variables in `CSS`, the easiest way to do this is in the root element `:root`, which points to the highest level element, usually the `<html>` element itself
```css
:root {
  --debug-outline: 0px;
  --colourA: rgba(255, 255, 255, 1.0);
  --colourB: rgb(18, 18, 18);
  --root-fs: 16px;
  --outer-width: 100%;
  --top-height: 8%;
}
```
Above is an example of some simple `CSS` variables that can be used later
```css
#outer {
  width: var(--outer-width);
}
```

### VSCode Custom Macros
You can create custom macros in `VSCode` that chain together different commands by using the `multi-command` extension

Commands for each action in `VSCode` are usually in the format `editor.action.doThing` and an easy way to get them is just looking at current hotkeys for things then right-clicking and selecting `Copy Command ID`
```json
{
    "key": "ctrl+f1",
    "command": "extension.multiCommand.execute",
    "args": { 
        "sequence": [
            "editor.action.insertCursorAtEndOfEachLineSelected",
            "editor.action.commentLine"
        ]
    }
}
```
Above is my custom macro that is especially useful in `CSS` as it will allow for multiple single line comments instead of a single block comment across multiple lines

```css
  /* --keyboard-width: 100%; */
  /* --keyboard-height: 200px; */
  /* --keyboard-margin: 0px 0px 4px 0px; */
  /* --keyboard-rowgap: 0px; */
```
Instead of
```css
  /* --keyboard-width: 100%;
  --keyboard-height: 200px;
  --keyboard-margin: 0px 0px 4px 0px;
  --keyboard-rowgap: 0px; */
```
This removes the issue where you can't toggle a line within the block comment without syntax issues

It also allows toggling two lines at the same time
```css
/* --keyboard-padding: 0px; */
--keyboard-padding: 4px;
```
to
```css
--keyboard-padding: 0px;
/* --keyboard-padding: 4px; */
```

### CSS Hacks
- Do not use `border` on objects as it is placed outside the element and can affect layout
    - Instead opt for `box-shadow: inset 0 0 0 var(--debug-outline) cyan`
    - This also gives the ability to toggle outlines on all elements using `--debug-outline`
- Use `box-shadow: inset 0 -1px 0 0px grey;` to add a `1px` grey line below an element

# Legal Disclaimers
- The aim of this project was to learn, and as such, the result was not intended for any commercial purposes
- This project, is not affiliated with, nor endorsed in any way by, the puzzle [Wordle](https://www.nytimes.com/games/wordle/index.html) on the `New York Times` website

# Miscellaneous
- You can revert the last commit made to `GitHub` using the terminal


# DUMP
`JavaScript`
`CSS`
`HTML`
- `box-sizing: border-box;` is the fix for many issues
- Flex and margin can get in each others' way 
- Transitions and delays
- Rowgap and column gap
- Padding
- Margin
- Scrolling
- Hidden scroll
- JavaScript scroll to
- Media queries
- DPI
- Resolutions
- `flex-shrink: 0` stops an element being shrunk by parent `flex` container
- 100vw : Full width including the scrollbar
- 100% : Full width excluding the scrollbar
- When actually testing things make sure scrollbars for that element are not disabled as it makes it hard to see what is overflowing its container


Applying the class below to an element (with other classes) gives a useful hidden scroll to elements that have `overflow-y: auto` or `overflow-y: scroll` already enabled
```
.hidden-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hidden-scrollbar::-webkit-scrollbar {
  display: none;
}
```

`flex-grow: 1` causes an object to fill available space in a parent flex container
You can hard reload a page on `Firefox` using `Control + Shift + R`

```javascript
document.addEventListener('keydown', function (event) {
  
  var prevent = true;

  if (event.key === 'F1') {
    var message = getValues()
    alert(message);
  }
  else if (event.key === 'F2'){
    toggleDebugOutlines()
  }
  else if (event.key === 'F3'){
    toggleScrollbar('inner')
  }
  else {
    prevent = false
  }

  if (prevent === true) {
    event.preventDefault()
  }

});
```
flex-wrap: no-wrap; /* Prevents wrapping */

Even setting margin via * you might need to manually do it anyway
mobile-first CSS design pattern

- Try
  - light.css
  - dark.css
`<link rel="stylesheet" href="light.css" media="(prefers-color-scheme: light)">`
`<link rel="stylesheet" href="dark.css" media="(prefers-color-scheme: dark)">`

@media only screen and (min-height:0px) and (max-height:410px){}
@media only screen and (min-height:411px) and (max-height:520px){}

`align-items` property of flex-box aligns the items inside a flex container along the cross axis just like justify-content does along the main axis
`align-content` is for multi line flexible boxes. It has no effect when items are in a single line.

```javascript
const keys = document.querySelectorAll('#keyboard .row .key');
for (const key of keys) {
    key.onclick = pressed
}
```

https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container


.grid.row.square
vs
.grid .row .square
in css


[CHORD] Control + K, Control + S to get to settings

# Assets
- `NotoSans.ttf` is an open-source `monospaced` font from [`Google Fonts`](https://fonts.google.com/noto/specimen/Noto+Sans)
- `material-128x128.ico` is an open-source icon from [`Google Material Icons`](https://fonts.google.com/icons)
    - A selection of icons that you can access via the api, or copy the `SVG` code directly

- Local entrypoint is `python -m http.server` for both root and experimental