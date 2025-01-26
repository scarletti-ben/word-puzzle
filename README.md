# Overview
This project started as a learning exercise to improve and practice my `HTML`, `CSS` and `JavaScript`. 

# Project Structure
```
word-puzzle/
├── answers.js
├── dictionary.txt
├── index.html
├── script.js
├── styles.css
└── styles.css
```
Important files:
- `index.html`
- `script.js`
- `styles.css`

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

The simple batch file included in this project, `LocalServer.bat` automates the process to speed things up a little
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

### CSS Class Selectors
```css
.grid.row.square {
  margin: 0px;
}

.grid .row {
  margin: 0px;
}

.grid .row .square {
  margin: 0px;
}
```

- `.grid.row.square` selects an element that has all three classes `grid`, `row` and `square`
```
<div class="grid row square"></div>
```
- `.grid .row` selects all `row` elements that are children of a `grid` element
```
<div class="grid">
  <div class="row"></div>
  <div class="row"></div>
</div>
```
- `.grid .row .square` selects all `square` elements that are children of a `row` element, if the `row` element is itself a child of a `grid` element
```
<div class="grid">
  <div class="row">
    <div class="square"></div>
  </div>
  <div class="row">
    <div class="square"></div>
  </div>
</div>
```
- `#grid .row` would select all `row` elements that are children of the specific ID: `grid`

`>` is the child combinator in CSS. It selects only the direct children of the specified parent element.
```css
.container > .box > .item {
  color: red;
}
```
- `.container > .box` selects `box` elements that are direct children of a `container` element
- `.box > .item` selects `item` elements that are direct children of a `box` element
```html
<div class="container">
  <div class="box">
    <div class="item">This is a direct child of a 'box' element</div>
    <div class="item">This is a direct child of a 'box' element</div>
    <div>
      <div class="item">This is not a direct child of a 'box' element</div>
    </div>
  </div>
</div>
```

# Miscellaneous

## Github
- You can revert the last commit made to `GitHub` using the terminal
- You can close an issue directly in the commit message using something like `Fixes #1 - Message`
- You can stop tracking a file or directory that was previously tracked by adding it to `.gitignore` and running `git rm --cached file.txt test.txt` for any number of files, use `git rm -r --cached dir1 dir2` for any number of directories, where the `-r` means recursive and will affect all files and directories in the given directory
```powershell
git rm -r --cached directory
git commit -m "Stopped tracking 'directory' after rule added to .gitignore"
git push
```

## CSS

### CSS Hacks and Learnings
- Often `flex` containers and elements using `margin` can get in each others' way
  - You can be better off without a `flex` parent and using `margin: auto` on child elements
- Using `margin: auto` can fix srolling issues that can occur when trying to scroll a `flex` container than has overflowed, the fix was found [here](https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container)
- Using `z-index: 999` can be useful to make an element appear above all other elements
  - `z-index` can be any value, any elements below that value are rendered below and the reverse for elements with a higher `z-index`
- Do not use `border` on objects as it is placed outside the element and can affect layout
    - Instead opt for `box-shadow: inset 0 0 0 var(--debug-outline) cyan`
    - This also gives the ability to toggle outlines on all elements using `--debug-outline`
- Use `box-shadow: inset 0 -1px 0 0px grey;` to add a `1px` grey line below an element
- `box-sizing: border-box` is the fix for many layout issues and padding issues where items seem to take up space greater than their set widths and heights
- `flex-shrink: 0` stops an element being shrunk by parent `flex` container
- `flex-grow: 1` tells an element to expand into free space in its parent's `flex` container
- For the `body` / `html` elements, `100vw` is the full width including the scrollbar, `100%` is the full width excluding the scrollbar
- Using the class below, you can apply a hidden scrollbar to an element if `overflow: auto` or `overflow: scroll` are already enabled
```css
.hidden-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hidden-scrollbar::-webkit-scrollbar {
  display: none;
}
```
- When actually testing things make sure scrollbars for that element are not disabled, and you have `overflow: visible` as otherwise it makes it hard to see what is overflowing its container
- `row-gap: 0px` defines the space between rows in a grid or flex container
  - Similar in effect to `margin: 0px` on elements, but this is space between and controlled by the parent, rather than space around and controlled by the child
- `column-gap: 0px` defines the space between columns in a grid or flex container
  - Similar in effect to `margin: 0px` on elements, but this is space between and controlled by the parent, rather than space around and controlled by the child
- `justify-content` property of flex-box aligns the items inside a flex container along the main axis just like `align-items` does along the cross axis
- `align-items` property of flex-box aligns the items inside a flex container along the cross axis just like `justify-content` does along the main axis
- `align-content` is for multi-line boxes where content has wrapped over to a new line eg. using `flex-wrap: wrap`
- Instead of making a class selector that is defined on its own, you can instead define styles for just certain multi-class combinations, allowing you to control exactly what the class, say `adaptive` does to each other class
```css
.theme-a {
  background: #dca;
}
.theme-a.adaptive {
  background: #753;
}
.theme-b {
  background: #447;
}
.theme-b.adaptive {
  background: #bcd;
}
```
instead of
```css
.adaptive {
  background: #bcd;
}
.theme-a {
  background: #dca;
}
```
- You can set styles that apply for `dark mode` and `light mode` within `styles.css`, below any squares that are multi-classed with the empty selector `adaptive` will adapt based on user preference
```css
.square {
  background: blue;
}
@media (prefers-color-scheme: dark) {
  .square.adaptive {
    background: black;
  }
}
@media (prefers-color-scheme: light) {
  .square.adaptive {
    background: grey;
  }
}
```
- You can change the entire stylesheet based on colour scheme also, by splitting `dark mode` and `light mode` into `dark.css` and `light.css`
  - You can then add them to your `index.html` with
```html
<link rel="stylesheet" href="light.css" media="(prefers-color-scheme: light)">
<link rel="stylesheet" href="dark.css" media="(prefers-color-scheme: dark)">
```

#### CSS Transitions
```css
.square {
  transition: all 0.3s ease;
}
```
The above snippet means that any transitions that happen to `square` elements will happen over 0.3 seconds, and will follow a smooth curve defined by `ease`, a few examples of things that might be subject to a transition are in the class `new` below
```css
.thing {
  transform: scale(1.2);
  opacity: 0.5;
  height: 200px;
  background-color: red;
}
```
Applying the `thing` class to a `square` would mean each of the 4 styles would follow the transition style defined in `.square`, and similarly they would reverse if you remove the `thing` class

You can also define specific rules for each style change eg. `transform 0.3s ease-in, opacity 0.5s ease-out, height 0.4s linear, background-color 0.6s ease-in-out`

You can also set a **delay** which means the transition will not start until the end of the delay, for `transform 0.3s ease-in 0.5s` the `transform` transition will not start until the 0.5 seconds are up, and will then take 0.3 seconds, for a total of 0.8 seconds

#### CSS `nth-child(n)` Pseudo-Class
- Using `.square:nth-child(2)` will select the 2nd `square` in the parent container that contains `square`
- Using `.square:nth-child(even)` will select every even numbered child in the parent container that contains `square`
```html
<div class="container">
  <div class="square">First</div>
  <div class="square">Second</div>
  <div class="square">Third</div>
</div>
```

An example usage would be for elements in a row where you wanted them to transition one at a time, or offset times, left to right, you might set different `transition-delay` for each nth child of the row they are in
```css
#grid .row .square {
  transition: transform 2s ease-in-out, background-color 0.2s ease-in-out 2.2s;
  
}
#grid .row .square:nth-child(1) { 
  transition-delay: 0s; 
}
#grid .row .square:nth-child(2) { 
  transition-delay: 0.3s; 
}
#grid .row .square:nth-child(3) { 
  transition-delay: 0.6s; 
}
```

#### Resolutions, Viewports, Devices and "dpi"
- [here](https://whatismyviewport.com/)
- [here](https://blisk.io/)

When working with `CSS` you will find that sites look vastly different on different devices. This is usually due to the size of the device's screen, and means that layouts need to adjust depending on the device, or the width or height. 

The space available for viewing the content on your site is called the `viewport` and is what viewport units `vh` and `vw` use when calculating.

It seems common to say that sites should be designed using a `mobile-first` CSS design pattern because it can be very hard to make a site that was designed for a wide desktop screen look even half decent on a mobile screen.

Whilst mobiles, and modern screens, may have much higher resolutions (such as `3840x2160`) this doesn't mean that their viewport matches their resolution. Usually they will have some sort of `dpi` (dots per inch) scaling so that a `CSS` "pixel" might map to say 2 physical pixels on their screen for a device at `2.0dpi`, this means that a device at `1920x1080` with `1.0dpi` would see the website almost exactly the same as a `3840x2160` device at `2.0dpi`. This does make it somewhat easier as designing a site for `1920x1080` should also work for larger resolution displays.

You can target specific devices using `CSS Media Queries`, which allow you to apply styling if certain resolutions, dpi scaling, or orientations are applied

Some examples of `CSS Media Queries`
- `@media only screen and (orientation: portrait) {}`
- `@media only screen and (orientation: landscape) {}`
- `@media only screen and (max-width: 1920px) {}`
- `@media only screen and (min-height: 1080px) {}`
- `@media only screen and (min-device-pixel-ratio: 2) {}`
- `@media only screen and (resolution: 150dpi) {}`
- `@media only screen and (min-resolution: 2x) {}`
- `@media only screen and (min-height: 720px) and (max-height: 1080px) {}`

The use of `screen` stops the styling from applying to print versions of the site, and the use of `only` is just a hack to stop older devices from parsing the query at all.

### JavaScript
Some of the most useful queries to the `HTML` document from within your `JavaScript` file are below
- `document.querySelector('.square')` selects the first element with class `square`
- `document.getElementsByClassName('square')` selects all elements with class `square`
- `document.getElementById('square')` selects the element with ID `square`
- `document.getElementsByTagName('div')` selects elements based on tag type
- `document.getElementsByName('username')` selects elements where `name='username'`
- `document.querySelectorAll('#keyboard .row .key')` selects all `key` elements inside `row` elements  in ID `keyboard` element
- `document.querySelector(':hover')` selects all elements based on `hover` state
- `square.querySelector(':nth-child(2)')` is the second child of the `square` element, where the `square` element is found using `document.getElementById('square')`
  - `square.querySelector(':first-child')` is the first child of the `square` element
  - `square.querySelector(':last-child')` is the last child of the `square` element

An example usage might be
```javascript
const keys = document.querySelectorAll('#keyboard .row .key');
for (const key of keys) {
    key.onclick = pressed
}
```

- You could find the element with the ID `square` (`<div id="square"></div>`) and then query it to find child elements of class `thing`, convert that to an array, and then log to console as below
```javascript
let squareElement = document.getElementById("square");
let thingElements = squareElement.querySelectorAll('.thing');
let thingArray = Array.from(thingElements);
console.log(thingArray);
```

- You can make a simple hotkey section with something similar to the snippet below
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
- You can toggle a class on and off for an element using `element.classList.toggle('classname')`

# Assets
- `NotoSans.ttf` is an open-source `monospaced` font from `Google Fonts` that can be found [here](https://fonts.google.com/noto/specimen/Noto+Sans)
- `material-128x128.ico` is an open-source icon from the `Google Material Icons` site which can be found [here](https://fonts.google.com/icons)
    - `Google Material Icons` offer a selection of icons that you can access via their api, or copy the `SVG` code directly

# Disclaimer
- The aim of this project was to learn, and as such, the result was not intended for any commercial purposes
- This project, is not affiliated with, nor endorsed in any way by, the puzzle [Wordle](https://www.nytimes.com/games/wordle/index.html) on the `New York Times` website