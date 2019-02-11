// call map and center location
var myMap = L.map("map", {
  center: [37.09, -95.71],
    zoom: 4
  });
  
// Sets the map and zoom
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);


// Link to data
 var link= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


//Function to adjust the circle size for visualization 
function mrkSize(magnitude) {
  return magnitude * 2.5;}

  //Function sets colors of the earthquakes magnitude
  function getColor(d) {
    return d >= 10 ? '#190007' :  
           d > 9 ? '#66001e' :
           d > 8 ? '#800026' :
           d > 7 ? '#BD0026' :
           d > 6 ? '#E31A1C' :
           d > 5 ? '#FC4E2A' :
           d > 4 ? '#FD8D3C' :
           d > 3 ? '#FEB24C' :
           d > 2 ? '#FED976' :
                      '#FFEDA0';
}
  // Transforms the data into usable variables
  d3.json(link, function (geoJson) {
    // Function to interpret GeoJsons
    L.geoJSON(geoJson.features,   {
        pointToLayer: function (geoJsonPoint,latlng) {
            return L.circleMarker(latlng, { 
            radius: mrkSize(geoJsonPoint.properties.mag)
            })
            // Each circle is interactable with display information
            .bindPopup(`Mag: ${geoJsonPoint.properties.mag}<br/>
            Place: ${geoJsonPoint.properties.place}<br/>
            Felt: ${geoJsonPoint.properties.felt}<br/>
            <a href = "${geoJsonPoint.properties.url}" target="_blank">Click here for more Information</a> 
            `);
        },
      // styles each circle
        style: function (geoJsonFeature) {
          return {
              fillColor: getColor(geoJsonFeature.properties.mag),
              fillOpacity: 1,
              weight: 0.3,
              color: 'green'
                }
        }
        

    }).addTo(myMap);
    // adds a legend to the page
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [1, 2, 3, 4, 5, 6, 7, 8,9,10],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML = '<h2>Magnitude</h2>'
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(myMap);


}); 
