import * as d3 from "d3";
import { CAMapGenerator } from "./main.js";
import { ControlsManager } from "./control.js";

document.addEventListener("DOMContentLoaded", () => {
  const defaultParams = {
    gridWidth: 120,        
    gridHeight: 120,       
    spawnChance: 65,       
    createLimit: 5,        
    destroyLimit: 5,       
    iterations: 5,        
    threshold: 0.5         
  };

  const controlsManager = new ControlsManager(
    "controls-panel",       
    defaultParams          
  );

  controlsManager.onRegenerate(() => {
    const currentParams = controlsManager.getParameters();
    refresh(currentParams);
  });
  const originalRegenBtn = document.getElementById("regenerate");
  if (originalRegenBtn) {
    originalRegenBtn.addEventListener("click", () => {
      const currentParams = controlsManager.getParameters();
      refresh(currentParams);
    });
  }
  refresh(defaultParams);
});

function refresh(params) {
  const gen = new CAMapGenerator();
  const contours = gen.generatePoints(
    params.gridWidth,    
    params.gridHeight,  
    params.spawnChance,
    params.createLimit, 
    params.destroyLimit, 
    params.iterations,  
    params.threshold     
  );
  drawMap(contours);
}

function drawMap(contours) {
  const width = 600;  
  const height = 600;

  const container = d3.select("#map");
  container.html("");
  const allPoints = [];
  contours.forEach(contour => {
    if (!contour.coordinates) return;
    contour.coordinates.forEach(polygonGroup => {
      polygonGroup.forEach(polygon => {
        allPoints.push(...polygon);
      });
    });
  });
  const xs = allPoints.map(p => p[0]);
  const ys = allPoints.map(p => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const spanX = Math.max(1e-6, maxX - minX);
  const spanY = Math.max(1e-6, maxY - minY);

  const scaleX = width / spanX;
  const scaleY = height / spanY;

  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid #ccc");

  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#2563eb");

  contours.forEach(contour => {
    if (!contour.coordinates) return;
    contour.coordinates.forEach(polygonGroup => {
      polygonGroup.forEach(polygon => {
        const scaledPoints = polygon.map(([x, y]) => [
          (x - minX) * scaleX,
          (y - minY) * scaleY
        ]);
        const pointsStr = scaledPoints.map(p => p.join(",")).join(" ");

        svg.append("polygon")
          .attr("points", pointsStr)
          .attr("fill", "#4ade80")
          .attr("stroke", "#0f766e")
          .attr("stroke-width", 2)
          .attr("fill-opacity", 0.8);
      });
    });
  });
}