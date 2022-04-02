var map = L.map('map', {
  scrollWheelZoom: false
}).setView([51.500, -0.101], 13);

L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/*
  ADDING A NEW PANE TO THE MAP.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  Any Path layers added to this pane (which includes circles, linestrings,
  polygons, and the like) will be traces on scroll.
*/
map.createPane('traced');

// This circle is in the "traced" pane.
var circle = L.circle([51.508, -0.11], {
  pane: 'traced',
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 500
}).addTo(map);

// This path is also in the "traced" pane.
var road1 = L.geoJSON({ "type": "LineString", "coordinates": [ [ -0.14093399047851562, 51.494423485886074 ], [ -0.12514114379882812, 51.48651406499528 ], [ -0.12170791625976562, 51.48597959517428 ], [ -0.11278152465820314, 51.48715542051101 ], [ -0.11106491088867188, 51.488865657782796 ], [ -0.10265350341796875, 51.492072179764314 ], [ -0.10110855102539062, 51.49324784798508 ], [ -0.10059356689453125, 51.49527847622497 ], [ -0.09510040283203125, 51.493995984702835 ], [ -0.08548736572265625, 51.494530360555444 ], [ -0.08291244506835938, 51.492072179764314 ], [ -0.07656097412109375, 51.487689876549595 ], [ -0.06832122802734375, 51.48458994432048 ], [ -0.060253143310546875, 51.48127599060938 ], [ -0.05424499511718749, 51.478496359866696 ], [ -0.04686355590820312, 51.47539580264131 ], [ -0.04634857177734375, 51.47411275179425 ] ] }, {
  pane: 'traced',
  color: 'blue'
}).addTo(map);

// This path is NOT in the "traced" pane; it'll go in the default ("overlay")
// pane.
var road2 = L.geoJSON({ "type": "LineString", "coordinates": [ [ -0.07329940795898438, 51.51440469156112 ], [ -0.07244110107421875, 51.51119974058721 ], [ -0.07381439208984375, 51.50831509192025 ], [ -0.07656097412109375, 51.50404120260676 ], [ -0.07930755615234375, 51.49923259794275 ], [ -0.08016586303710938, 51.49709527744868 ], [ -0.08462905883789061, 51.4949578567272 ], [ -0.08531570434570312, 51.49431661096613 ] ] }, {
  color: 'green'
}).addTo(map);

let tracedPaneEl = document.querySelector('.leaflet-traced-pane');
let bodyEl = document.querySelector('body');

/*
  LISTENING FOR SCROLL ACTIVITY.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  This is the function that actually updates the scrolling. The setTimeout is a
  way to delay the recalculation until after the paths are redrawn at the new
  zoom level (it tells the browser to put the function in the task queue to be
  processed the next time the call stack is empty).

  I just found that redrawing after a zoom didn't quite work right if I didn't
  have the setTimeout.
*/
let updatePathOutlines = function() {
  setTimeout(() => {

    // bodyEl.scrollHeight is the total height of the page body. scrollProgress
    // is a normalized number calculated between 0 and 1 here.
    const scrollProgress = window.scrollY / (bodyEl.scrollHeight - window.innerHeight);

    // Here we retrieve all the SVG path elements in the "traced" pane.
    const tracedPathEls = tracedPaneEl.getElementsByTagName('path');

    for (const pathEl of tracedPathEls) {
      const totalLength = pathEl.getTotalLength();
      // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
      pathEl.style.strokeDasharray = `${totalLength * scrollProgress}, ${totalLength}`;
    }

  }, 0);
}

// Call the function on scroll AND on zoom (since the length of the paths change
// after zooming).
window.addEventListener('scroll', updatePathOutlines)
map.addEventListener('zoom', updatePathOutlines)

updatePathOutlines();
