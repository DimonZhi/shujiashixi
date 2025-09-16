# Cellular Automata Map Generator

A web-based tool for generating 2D maps using cellular automata algorithms. This project visualizes terrain generation through configurable cellular automata rules.

## Features

- Interactive map generation using cellular automata
- Real-time parameter adjustments
- Export generated maps
- Responsive web interface

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DimonZhi/shujiashixi.git
cd shujiashixi
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:5173`

3. Adjust the generation parameters:
   - **Spawn Chance**: Initial cell activation probability
   - **Create Limit**: Neighbors required for cell creation
   - **Destroy Limit**: Neighbors required for cell survival
   - **Iterations**: Number of generation steps
   - **Threshold**: Contour threshold for visualization

4. Click "Generate" to create a new map

## Build for Production

```bash
npm run build
```

The built files will be available in the `dist/` directory.

## Technologies Used

- HTML5/CSS3
- JavaScript (ES6+)
- D3.js for data visualization
- Vite for development and building