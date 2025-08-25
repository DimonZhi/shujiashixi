import * as d3 from "d3";
import {Gen} from "./test1.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("regenerate").addEventListener("click", refresh);
    refresh();
});
function refresh() {
    const contours = new Gen().RunCellularAutomata(100, 100, 65, 5, 5, 5);
    drawMap(contours);
}
function drawMap(contours){
    const width = 600;
    const height = 600;

    d3.select("#map").html("");
    let allPoints = [];
    contours.forEach(contour => {
        contour.coordinates.forEach(polygonGroup => {
            polygonGroup.forEach(polygon => {
                allPoints.push(...polygon);
            });
        });
    });
    const minX = Math.min(...allPoints.map(p => p[0]));
    const minY = Math.min(...allPoints.map(p => p[1]));
    const maxX = Math.max(...allPoints.map(p => p[0]));
    const maxY = Math.max(...allPoints.map(p => p[1]));

    const scaleX = width / (maxX - minX);
    const scaleY = height / (maxY - minY);
    const svg = d3.select("#map")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid #ccc");
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#2563eb");
        contours.forEach(contour => {
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