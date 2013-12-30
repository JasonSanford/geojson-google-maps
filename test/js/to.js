module("Google Maps -> GeoJSON");

test("google.maps.Marker -> GeoJSON Point", function(){
  var convertedGeoJSON = google.maps.geojson.to(overlayExamples.Marker);
  var expectedGeoJSON = geojsonExamples.Point;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("[google.maps.Marker] length 1 -> GeoJSON Point", function(){
  var convertedGeoJSON = google.maps.geojson.to([overlayExamples.Marker]);
  var expectedGeoJSON = geojsonExamples.Point;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("[google.maps.Marker] -> GeoJSON MultiPoint", function(){
  var convertedGeoJSON = google.maps.geojson.to(overlayExamples.Markers);
  var expectedGeoJSON = geojsonExamples.MultiPoint;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("google.maps.Polyline -> GeoJSON LineString", function(){
  var convertedGeoJSON = google.maps.geojson.to(overlayExamples.Polyline);
  var expectedGeoJSON = geojsonExamples.LineString;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("[google.maps.Polyline] -> GeoJSON LineString", function(){
  var convertedGeoJSON = google.maps.geojson.to(overlayExamples.Polylines);
  var expectedGeoJSON = geojsonExamples.MultiLineString;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("google.maps.Polygon with one path -> GeoJSON Polygon", function(){
  var convertedGeoJSON = google.maps.geojson.to(overlayExamples.Polygon);
  var expectedGeoJSON = geojsonExamples.Polygon;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("google.maps.Polygon with two paths -> GeoJSON Polygon", function(){
  var convertedGeoJSON = google.maps.geojson.to(overlayExamples.Polygon_hole);
  var expectedGeoJSON = geojsonExamples.Polygon_hole;
  geoJSONCompare(convertedGeoJSON, expectedGeoJSON);
});

test("[google.maps.Polygon] with one path -> GeoJSON Polygon", function(){
  var convertedGeoJSON = google.maps.geojson.to(overlayExamples.Polygons);
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
  var convertedGeoJSON = google.maps.geojson.to([marker, polyline, polygon]);
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
  var geoJson = google.maps.geojson.to(unsupported);
  ok(geoJson.type === 'Error', "Detected an unsupported object type");
});