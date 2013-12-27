module("Google Maps -> GeoJSON");

var COMPARISON_THRESHOLD = 0.0000000000001;

test("google.maps.Marker -> GeoJSON Point", function(){
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(overlayExamples.Marker);
  var expectedGeoJSON = geojsonExamples.Point;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("[google.maps.Marker] -> GeoJSON MultiPoint", function(){
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(overlayExamples.Markers);
  var expectedGeoJSON = geojsonExamples.MultiPoint;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("google.maps.Polyline -> GeoJSON LineString", function(){
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(overlayExamples.Polyline);
  var expectedGeoJSON = geojsonExamples.LineString;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("[google.maps.Polyline] -> GeoJSON LineString", function(){
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(overlayExamples.Polylines);
  var expectedGeoJSON = geojsonExamples.MultiLineString;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("google.maps.Polygon with one path -> GeoJSON Polygon", function(){
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(overlayExamples.Polygon);
  var expectedGeoJSON = geojsonExamples.Polygon;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("google.maps.Polygon with two paths -> GeoJSON Polygon", function(){
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(overlayExamples.Polygon_hole);
  var expectedGeoJSON = geojsonExamples.Polygon_hole;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("[google.maps.Polygon] with one path -> GeoJSON Polygon", function(){
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(overlayExamples.Polygons);
  var expectedGeoJSON = geojsonExamples.MultiPolygon;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("multiple overlays -> GeoJSON GeometryCollection", function(){
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(0, 1, true)
  });
  var polyline = new google.maps.Polyline({
    path: [
      new google.maps.LatLng(0, 0),
      new google.maps.LatLng(1, 0),
      new google.maps.LatLng(1, 1),
      new google.maps.LatLng(0, 2)
    ]
  });
  var polygon = new google.maps.Polygon({
    paths: [
      new google.maps.LatLng(0, 0),
      new google.maps.LatLng(1, 0),
      new google.maps.LatLng(1, 1),
      new google.maps.LatLng(0, 1)
    ]
  });
  var convertedGeoJSON = google.maps.geojson.toGeoJSON([marker, polyline, polygon]);
  var expectedGeoJSON = {
    "type": "GeometryCollection",
    "geometries": [
      {"type":"Point","coordinates":[1,0]},
      {
        "type": "LineString",
        "coordinates": [
          [0, 0],
          [0, 1],
          [1, 1],
          [2, 0]
        ]
      },
      {
        "type": "Polygon",
        "coordinates": [
          [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0]
          ]
        ]
      }
    ]
  };
  
  deepEqual(convertedGeoJSON, expectedGeoJSON, "Passed!" );
});

test("Unsupported google maps feature", function(){
  var unsupported = new google.maps.Circle({
    radius: 5,
    center: new google.maps.LatLng(-1, 1)
  });
  var geoJson = google.maps.geojson.toGeoJSON(unsupported);
  ok(geoJson.type === 'Error', "Detected an unsupported object type");
});

/**
 * We use this instead of QUnit's deepEqual() because we need
 * to do threshold comparisons on lat/lon since the coordinates
 * get rounded/modified inside of the Google Maps objects.
 */
function geoJSONCompare(testGeo, expectedGeo){
  strictEqual(testGeo.type, expectedGeo.type, "Types match");
  QUnit.push(coordsCompare(testGeo.coordinates, expectedGeo.coordinates), testGeo.coordinates, expectedGeo.coordinates, "Comparing coordinates");
};

/**
 * Compare two arrays of coordinates. It will recursively handle
 * different depths of nested coordinates to account for the
 * different GeoJSON coordinate structures
 */
function coordsCompare(testCoords, expectedCoords){
  
  // Base case is two numbers
  if(typeof testCoords === 'number' && typeof expectedCoords === 'number'){
    return thresholdCompare(testCoords, expectedCoords);
  }
  
  // No need to compare actual coordinates if the two arrays
  // are not the same length
  if(testCoords.length !== expectedCoords.length) return false;
  
  for(var i = 0; i < testCoords.length; i++){
    if(!coordsCompare(testCoords[i], expectedCoords[i])) return false;
  }
  
  // Tests passed if we reach this point
  return true;
};
function thresholdCompare(testCoord, expectedCoord){
  return Math.abs(testCoord - expectedCoord) < COMPARISON_THRESHOLD;
};
/*
function coordsCompare(testCoords, expectedCoords){
  
  // Base case is two numbers
  if(typeof testCoords === 'number' && typeof expectedCoords === 'number'){
    thresholdCompare(testCoords, expectedCoords);
    return;
  }
  
  // No need to compare actual coordinates if the two arrays
  // are not the same length
  QUnit.push(testCoords.length === expectedCoords.length, testCoords, expectedCoords, "Coordinate arrays are the same length");
  
  for(var i = 0; i < testCoords.length; i++){
    coordsCompare(testCoords[i], expectedCoords[i]);
  }
};
function thresholdCompare(testCoord, expectedCoord){
  QUnit.push(Math.abs(testCoord - expectedCoord) < COMPARISON_THRESHOLD, testCoord, expectedCoord, "Numbers within threshold");
};
*/