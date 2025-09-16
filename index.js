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

  const controlsManager = new ControlsManager("controls-panel", defaultParams);

  controlsManager.onRegenerate(() => {
    refresh(controlsManager.getParameters());
  });

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
  const container = d3.select("#map");
  const containerNode = container.node();
  if (!containerNode) return;

  const width = Math.max(100, containerNode.clientWidth || 600);
  const height = Math.max(100, containerNode.clientHeight || 600);
  const dimension = Math.max(50, Math.min(width, height) - 20);

  container.html("");

  if (!contours || contours.length === 0) {
    drawEmptyMap(container, dimension, dimension);
    return;
  }

  const allPoints = [];
  contours.forEach(contour => {
    if (!contour.coordinates) return;
    contour.coordinates.forEach(polygonGroup => {
      polygonGroup.forEach(polygon => {
        allPoints.push(...polygon);
      });
    });
  });

  if (allPoints.length === 0) {
    drawEmptyMap(container, dimension, dimension);
    return;
  }

  const xs = allPoints.map(p => p[0]);
  const ys = allPoints.map(p => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const spanX = Math.max(1e-6, maxX - minX);
  const spanY = Math.max(1e-6, maxY - minY);
  const scale = Math.min(dimension / spanX, dimension / spanY);
  const svgWidth = spanX * scale;
  const svgHeight = spanY * scale;

  const svg = container
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  svg.append("rect")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("fill", "#2563eb");

  contours.forEach(contour => {
    if (!contour.coordinates) return;
    contour.coordinates.forEach(polygonGroup => {
      polygonGroup.forEach(polygon => {
        const scaledPoints = polygon.map(([x, y]) => [
          (x - minX) * scale,
          (y - minY) * scale
        ]);
        const pointsStr = scaledPoints.map(p => p.join(",")).join(" ");

        svg.append("polygon")
          .attr("points", pointsStr)
          .attr("fill", "#4ade80")
          .attr("stroke", "#0f766e")
          .attr("stroke-width", 1)
          .attr("fill-opacity", 0.9);
      });
    });
  });
}

function drawEmptyMap(container, width, height) {
  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#2563eb");
}