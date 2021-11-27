# Earthquake_Leaflet
Mapped weekly earthquake data through an API using Leaflet JavaScript Library

- Includes a Level 1 - basic mapping visualization 
- Level 2 - 2 datasets showing 2 overlays, several tiles to visualize the data on.  

***NOTE:*** Config file: One must supply their own API_KEY from [Map Box](https://www.mapbox.com/)


### Level 1: Basic Visualization

![2-BasicMap](Images/2-BasicMap.png)

Visualized an earthquake data set.

1. **Get your data set**

   ![3-Data](Images/3-Data.png)

   The USGS provides earthquake data in a number of different formats, updated every 5 minutes. Visited the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page and picked a data set to visualize. When one clicks on a data set, for example "All Earthquakes from the Past 7 Days", one will be given a JSON representation of that data. Used the URL of this JSON to pull in the data for this visualization.

   ![4-JSON](Images/4-JSON.png)

2. **Import & Visualize the Data**

   Created a map using Leaflet that plots all of the earthquakes from the data set based on their longitude and latitude.

   * The data markers reflect the magnitude of the earthquake by their size and and depth of the earthquake by colour. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in colour.

   * Included popups that provide additional information about the earthquake when a marker is clicked.

   * Created a legend that will provide context for the map data.

   * The visualization looks something like the map above.

- - -

### Level 2: More Data (Optional)

![5-Advanced](Images/5-Advanced.png)

Plotted a second USGS map with a second data set on the map to illustrate the relationship between tectonic plates and seismic activity. Pulled in a second data set and visualize it alongside your original set of data. Data on tectonic plates can be found at <https://github.com/fraxen/tectonicplates>.

* Plotted a second data set on the map.

* Added a number of base maps to choose from as well as separate out the two different data sets into overlays that can be turned on and off independently.

* Added layer controls to the map.

### Final: 
 * Added additional styling to the popups. 
 * Added a legend that is movable.
 * Added a favicon for USGS.

- - -
___
© 2021  Trilogy Education Services, a 2U, Inc. brand. All Rights Reserved.	