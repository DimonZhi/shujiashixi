import * as d3 from "d3";
import { CAMapGenerator } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("regenerate").addEventListener("click", refresh);
  refresh();
});

// Параметры генерации
const GRID_W = 120;        // размер решётки для генерации контуров (не SVG!)
const GRID_H = 120;
const SPAWN = 65;          // шанс стены, %
const CREATE_LIMIT = 5;
const DESTROY_LIMIT = 5;
const ITERATIONS = 5;
const THRESHOLD = 0.5;     // порог для d3.contours()

function refresh() {
  const gen = new CAMapGenerator();
  // ВАЖНО: вызываем метод, который возвращает САМИ контуры
  const contours = gen.generatePoints(
    GRID_W, GRID_H,
    SPAWN, CREATE_LIMIT, DESTROY_LIMIT, ITERATIONS,
    THRESHOLD
  );
  drawMap(contours);
}

function drawMap(contours) {
  const width = 600;   // размеры SVG
  const height = 600;

  const container = d3.select("#map");
  container.html("");

  // Если контуров нет — просто рисуем фон и выходим
  if (!Array.isArray(contours) || contours.length === 0) {
    container.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid #ccc")
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#2563eb");
    return;
  }

  // Собираем все точки, чтобы посчитать bbox
  const allPoints = [];
  contours.forEach(contour => {
    // d3.contours() -> объекты вида {value, coordinates: [[[ [x,y], ... ]]]}
    if (!contour.coordinates) return;
    contour.coordinates.forEach(polygonGroup => {
      polygonGroup.forEach(polygon => {
        // polygon — это линейный кольцевой контур: массив [ [x,y], ... ]
        allPoints.push(...polygon);
      });
    });
  });

  if (allPoints.length === 0) {
    // нет точек — та же заглушка
    container.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid #ccc")
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#2563eb");
    return;
  }

  const xs = allPoints.map(p => p[0]);
  const ys = allPoints.map(p => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  // Защита от деления на 0
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
