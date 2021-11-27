
// Define earthquakes plates GeoJSON url variable
let earthquakeQueryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// createMap function to hold all baseMaps and overlays
function createMap(earthquakes){
  // Create tile layer
  let grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
  });


  // Create the map, giving it the grayscaleMap and earthquakes layers to display on load
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [grayscaleMap, earthquakes]
  });


  // add a legend
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels=[];
        div.innerHTML += "<p style='text-align: center'><b>Depth (km)</b></p>"
        // loop through our depth intervals and generate a label with a colored square for each interval  
        for (let i = 0; i < depths.length; i++) {
          console.log(chooseColour(depths[i] + 1));
          div.innerHTML +=
              '<i style="background:' + chooseColour(depths[i] + 1) + '"></i> ' +
              depths[i] + (depths[i + 1] ? '–' + depths[i + 1] + '<br>' : '+');
        }
        div.innerHTML += "<p style='text-align: center'><b>Marker Size</br> by Magnitude</b></p>"

    return div;
  };

  legend.addTo(myMap);


};

// colour of marker based on depth
function chooseColour(depth) {
  switch(true) {
    case depth > 90:
      return "red";
    case depth > 70:
      return "orangered";
    case depth > 50:
      return "orange";
    case depth > 30:
      return "gold";
    case depth > 10:
      return "yellow";
    default:
      return "lightgreen";
  };
};

// Create the earthquake markers
function createMarkers(earthquakeData){
  // Create earthquake layerGroup
  let earthquakes = L.layerGroup();

  //Create a GeoJSON layer containing the features array
  // Each feature a popup describing the place and time of the earthquake
  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, 
        // Set the style of the markers based on properties.mag
        {
          radius: feature.properties.mag*5,
          fillColor: chooseColour(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
      + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(earthquakes);

  createMap(earthquakes);

};

// call the USGS api for earthquake data
d3.json(earthquakeQueryURL).then(function(earthquakeData){
  console.log(earthquakeData);
  console.log("in earthquakedata");
  createMarkers(earthquakeData);
});
