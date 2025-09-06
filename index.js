import * as d3 from "d3";
import { CAMapGenerator } from "./main.js";
// 导入 ControlsManager 类（确保 control.js 路径正确）
import { ControlsManager } from "./control.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. 定义默认参数（与原代码参数保持一致，作为滑块初始值）
  const defaultParams = {
    gridWidth: 120,        //对应原 GRID_W
    gridHeight: 120,       //对应原 GRID_H
    spawnChance: 65,       //对应原 SPAWN
    createLimit: 5,        //对应原 CREATE_LIMIT
    destroyLimit: 5,       //对应原 DESTROY_LIMIT
    iterations: 5,         //对应原 ITERATIONS
    threshold: 0.5         //对应原 THRESHOLD
  };

  // 2. 初始化 ControlsManager（关键：挂载到 HTML 中的 controls-panel 容器）
  const controlsManager = new ControlsManager(
    "controls-panel",       //容器 ID（对应 HTML 中 id="controls-panel" 的 div）
    defaultParams           //默认参数（滑块初始值）
  );

  // 3. 绑定「再生地图」事件（滑块调整后点击按钮生效）
  // 绑定自定义的再生按钮（Control 内部创建的按钮）
  controlsManager.onRegenerate(() => {
    // 获取滑块当前参数，传入 refresh 生成地图
    const currentParams = controlsManager.getParameters();
    refresh(currentParams);
  });

  // 兼容原有的再生按钮（如果 HTML 中保留了 id="regenerate" 的按钮）
  const originalRegenBtn = document.getElementById("regenerate");
  if (originalRegenBtn) {
    originalRegenBtn.addEventListener("click", () => {
      const currentParams = controlsManager.getParameters();
      refresh(currentParams);
    });
  }

  // 4. 初始加载地图（使用默认参数）
  refresh(defaultParams);
});

// 5. 核心：地图生成函数（修改参数接收方式，支持从滑块获取动态参数）
function refresh(params) {
  const gen = new CAMapGenerator();
  // 从 params 中获取动态参数（替代原有的固定常量）
  const contours = gen.generatePoints(
    params.gridWidth,    //原 GRID_W
    params.gridHeight,   //原 GRID_H
    params.spawnChance,  //原 SPAWN
    params.createLimit,  //原 CREATE_LIMIT
    params.destroyLimit, //原 DESTROY_LIMIT
    params.iterations,   //原 ITERATIONS
    params.threshold     //原 THRESHOLD
  );
  drawMap(contours);
}

// 6. 地图绘制函数（保持原有逻辑不变）
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