# Generating Maps Using Cellular Automata

Interactive browser-based map generator built with JavaScript, D3.js and cellular automata.

The project generates cave-like / island-like procedural maps from a random grid. A user can adjust generation parameters in the control panel and regenerate the map directly in the browser.

## Features

- Procedural map generation using cellular automata
- Interactive controls for generation parameters
- SVG rendering with D3.js contours
- Responsive layout for desktop and mobile screens
- Separate modules for map generation, rendering and UI controls
- Simple console implementation for testing the cellular automata logic

## Demo Idea

The application starts from a randomly initialized grid. Each cell is either empty or solid. Then the cellular automata rules are applied several times: cells are created or destroyed depending on the number of solid neighbors around them. The final grid is converted into contours and rendered as an SVG map.

## Tech Stack

- JavaScript
- HTML / CSS
- D3.js
- Bun
- Tailwind CSS CLI

## Project Structure

```text
.
├── index.html      # Main HTML page
├── index.js        # Browser entry point: reads parameters and draws the map
├── main.js         # Cellular automata map generator
├── control.js      # UI controls manager
├── test.js         # Console version of the cellular automata algorithm
├── styles.css      # Tailwind CSS input
├── output.css      # Generated CSS output
├── package.json    # Project scripts and dependencies
└── package-lock.json
