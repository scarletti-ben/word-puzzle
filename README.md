# Legal Disclaimers
- This is a recreated design as a personal project for educational purposes, and as such, is not intended for any commercial purposes
- It is not affiliated with [Wordle](https://www.nytimes.com/games/wordle/index.html) on the `New York Times` website

# Overview
- Project to practice `HTML`, `CSS` and `JavaScript`
- This project is primarily for my own use, and information in this README is likely included purely to remind me of things in future

## Project Structure

```
project/
├── index.html       Main HTML file as the entry point
├── styles.css       Main CSS file for styling
└── script.js        Main JavaScript file for functionality
```

It is recommended to use fetch to read dictionary.txt and in testing set up a local server

```powershell
PS C:\Users\kclar\OneDrive\Desktop\python-files\z-christmas\wordleA05> python -m http.server
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
::1 - - [02/Jan/2025 07:00:30] "GET / HTTP/1.1" 200 -
::1 - - [02/Jan/2025 07:00:30] "GET /styles.css HTTP/1.1" 200 -
::1 - - [02/Jan/2025 07:00:30] "GET /script.js HTTP/1.1" 200 -
::1 - - [02/Jan/2025 07:00:30] "GET /dictionary.txt HTTP/1.1" 200 -
```

http://localhost:8000/dictionary.txt
http://localhost:8000/styles.css
http://localhost:8000/script.js
http://localhost:8000/index.html

# New

- Now has answers and dictionary separate
- Shows colours on the keyboard after an answer is submitted
- The answer is random on page load
- Implemented active border outline for current word #565758

- Not implemented: Wordle doesn't show mutlitple letters as both being present if only one occurance is in the word, first occurance in your guess gives info, unless the second one is in the correct position, in which case the first shows absent

- Sort out scaling to the viewport, either scale for Chrome and Firefox, or more manual with multipliers

- Sort out multi-letter
    - Make sure that keyboard colour isn't set twice if same letter twice in a word OR same letter in a new word, with a lower level than what's already given

# NEW MISCELLANEOUS NOTES
In a sense you sort of scroll into the full window as `page` has full view height of `100vh` so scrolling into it you'll find the bottom of the page and be left with exactly the content in the `page` container

You can revert GitHub changes and use tags and releases for version control

Rebuilt with CSS multi-classing such that less repeat code was needed

Colour variables

CSS variables

You can change Hex to RGB by clicking CSS colour-picker in VSCode

`box-sizing: border-box;` is the fix for many issues
