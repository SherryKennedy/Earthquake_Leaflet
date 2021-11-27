
// Define earthquakes plates GeoJSON url variable
// reference: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
let earthquakeQueryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define tectonic plates boundaries GeoJSON url variable
// reference: https://github.com/fraxen/tectonicplates
let tectonicplatesQueryURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// createMap function to hold all baseMaps and overlays
function createMap(earthquakes, tectonicplates){
  // Create tile layers
  // https://docs.mapbox.com/api/maps/styles/#mapbox-styles
  
  //grayscale 
  let grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  renderWorldCopies: false,  // not sure if working
  accessToken: API_KEY
  });
  // satellite
  let satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  renderWorldCopies: false,  // not sure if working
  accessToken: API_KEY
  });
  // dark 
  let darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    renderWorldCopies: false,  // not sure if working
    accessToken: API_KEY
  });
  // outdoor
  let outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  renderWorldCopies: false,  // not sure if working
  accessToken: API_KEY
 });

  // Create a baseMaps object to hold the tile layers.
  let baseMaps = {
    "Satellite": satelliteMap,
    "Outdoors Map": outdoorMap,
    "Gray Scale": grayscaleMap,
    "Dark Map": darkMap
  };

  // Create an overlayMaps object to hold the earthquake and tectonic plates layer.
  let overlayMaps = {
    "Earthquakes (last week)": earthquakes,
    "Tectonic Plate Boundaries": tectonicplates
  };

  // Create the map, giving it the outdoorMap with earthquake and tectonic plate layers to display on load
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [satelliteMap, earthquakes, tectonicplates]
  });


  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  


  // add a legend
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90];
        //labels=[];
        div.innerHTML += "<p style='text-align: center'><b>Depth (km)</b></p>"
        // loop through our depth intervals and generate a label with a colored square for each interval  
        for (let index = 0; index < depths.length; index++) {
          console.log(chooseColour(depths[index] + 1));
          div.innerHTML +=
              '<i style="background:' + chooseColour(depths[index] + 1) + '"></i> ' +
              depths[index] + (depths[index+ 1] ? '–' + depths[index + 1] + '<br>' : '+');
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
function createOverlays(earthquakeData, tpdata){
  // Create 2 layer groups: earthquake and tectonicplates
  let earthquakes = L.layerGroup();
  let tectonicplates = L.layerGroup();

  //Create a GeoJSON layer containing the features array to create markers for earthquake data
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
    //add information to the popup
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
      + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(earthquakes);

  //Create a GeoJSON layer for plates
  L.geoJSON(tpdata, {
      color: "orange",
      weight: 2
  }).addTo(tectonicplates);
  
  createMap(earthquakes, tectonicplates);

};

// call the USGS api for earthquake data
d3.json(earthquakeQueryURL).then(function(earthquakeData){
  console.log(earthquakeData);
  console.log("in earthquakedata");
  //Get the tectonic plate data from tectonicplatesURL
  d3.json(tectonicplatesQueryURL).then(function(tpdata) {
    console.log(tpdata);
    createOverlays(earthquakeData, tpdata);
  });
  
});

