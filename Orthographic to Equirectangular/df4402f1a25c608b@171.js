// https://observablehq.com/@d3/orthographic-to-equirectangular@171
function _1(md){return(
md`# Orthographic to Equirectangular

This notebook demonstrates how to interpolate smoothly between two projections ([orthographic](/@d3/orthographic) and [equirectangular](/@d3/equirectangular)) by blending their raw projection functions.`
)}

function* _canvas(DOM,width,height,d3,projection,rotate,scale,graticule,sphere,equator)
{
  const context = DOM.context2d(width, height);
  const path = d3.geoPath(projection, context);
  while (true) {
    for (let i = 0, n = 480; i < n; ++i) {
      const t = d3.easeCubic(2 * i > n ? 2 - 2 * i / n : 2 * i / n);
      projection.alpha(t).rotate(rotate(t)).scale(scale(t));
      context.clearRect(0, 0, width, height);
      context.beginPath();
      path(graticule);
      context.lineWidth = 1;
      context.strokeStyle = "#aaa";
      context.stroke();
      context.beginPath();
      path(sphere);
      context.lineWidth = 1.5;
      context.strokeStyle = "#000";
      context.stroke();
      context.beginPath();
      path(equator);
      context.lineWidth = 1.5;
      context.strokeStyle = "#f00";
      context.stroke();
      yield context.canvas;
    }
  }
}


function _interpolateProjection(d3){return(
function interpolateProjection(raw0, raw1) {
  const mutate = d3.geoProjectionMutator(t => (x, y) => {
    const [x0, y0] = raw0(x, y), [x1, y1] = raw1(x, y);
    return [x0 + t * (x1 - x0), y0 + t * (y1 - y0)];
  });
  let t = 0;
  return Object.assign(mutate(t), {
    alpha(_) {
      return arguments.length ? mutate(t = +_) : t;
    }
  });
}
)}

function _projection(interpolateProjection,d3,scale,width,height,rotate){return(
interpolateProjection(d3.geoOrthographicRaw, d3.geoEquirectangularRaw)
    .scale(scale(0))
    .translate([width / 2, height / 2])
    .rotate(rotate(0))
    .precision(0.1)
)}

function _rotate(d3){return(
d3.interpolate([10, -20], [0, 0])
)}

function _scale(d3,width){return(
d3.interpolate(width / 4, (width - 2) / (2 * Math.PI))
)}

function _height(width){return(
width / 1.8
)}

function _equator(){return(
{type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]}
)}

function _sphere(){return(
{type: "Sphere"}
)}

function _graticule(d3){return(
d3.geoGraticule10()
)}

function _d3(require){return(
require("d3-geo@2", "d3-interpolate@2", "d3-ease@2")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("canvas")).define("canvas", ["DOM","width","height","d3","projection","rotate","scale","graticule","sphere","equator"], _canvas);
  main.variable(observer("interpolateProjection")).define("interpolateProjection", ["d3"], _interpolateProjection);
  main.variable(observer("projection")).define("projection", ["interpolateProjection","d3","scale","width","height","rotate"], _projection);
  main.variable(observer("rotate")).define("rotate", ["d3"], _rotate);
  main.variable(observer("scale")).define("scale", ["d3","width"], _scale);
  main.variable(observer("height")).define("height", ["width"], _height);
  main.variable(observer("equator")).define("equator", _equator);
  main.variable(observer("sphere")).define("sphere", _sphere);
  main.variable(observer("graticule")).define("graticule", ["d3"], _graticule);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
