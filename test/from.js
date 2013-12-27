module("GeoJSON -> Google Maps");

QUnit.assert.polygonsEqual = function(testPolygon, expectedPolygon, message){
  var testPaths = testPolygon.getPaths(),
      expectedPaths = expectedPolygon.getPaths();

  QUnit.push(testPaths.getLength() === expectedPaths.getLength(), testPaths.getLength(), expectedPaths.getLength(), "Polygon has correct number of paths");
  for(var i = 0; i < testPaths.getLength(); i++){
    QUnit.push(testPaths.getAt(i).getLength() === expectedPaths.getAt(i).getLength(), testPaths.getAt(i).getLength(), expectedPaths.getAt(i).getLength(), "Paths " + i + " are the same length");
    deepEqual(testPaths.getAt(i), expectedPaths.getAt(i), "Paths " + i + " are equal");
  }
};

test("GeoJSON Point -> google.maps.Marker", function(){
  var convertedOverlay = google.maps.geojson.fromGeoJSON(geojsonExamples.Point);  
  var expectedOverlay = overlayExamples.Marker;
  
  ok(convertedOverlay instanceof google.maps.Marker, "Overlay is a Marker");
  deepEqual(convertedOverlay, expectedOverlay, "Deep equal compare");
});

test("GeoJSON MultiPoint -> [google.maps.Marker]", function(){
  var convertedOverlay = google.maps.geojson.fromGeoJSON(geojsonExamples.MultiPoint);
  var expectedOverlay = overlayExamples.Markers;

  ok(convertedOverlay.length === 2, "Two Markers");
  ok(convertedOverlay[0] instanceof google.maps.Marker, "First Marker");
  ok(convertedOverlay[1] instanceof google.maps.Marker, "Second Marker");
  deepEqual(convertedOverlay, expectedOverlay, "Deep equal compare");
});

test("GeoJSON LineString -> google.maps.Polyline", function(){
  var convertedOverlay = google.maps.geojson.fromGeoJSON(geojsonExamples.LineString);
  var expectedOverlay = overlayExamples.Polyline;

  ok(convertedOverlay instanceof google.maps.Polyline, "Overlay is a Polyline");
  deepEqual(convertedOverlay, expectedOverlay, "Deep equal compare");
});

test("GeoJSON MultiLineString -> [google.maps.Polyline]", function(){
  var convertedOverlay = google.maps.geojson.fromGeoJSON(geojsonExamples.MultiLineString);
  var expectedOverlay = overlayExamples.Polylines;

  ok(convertedOverlay.length === 2, "Two Polylines");
  ok(convertedOverlay[0] instanceof google.maps.Polyline, "First Polyline");
  ok(convertedOverlay[1] instanceof google.maps.Polyline, "Second Polyline");
  deepEqual(convertedOverlay, expectedOverlay, "Deep equal compare");
});

test("GeoJSON Polygon -> google.maps.Polygon", function(){
  var convertedOverlay = google.maps.geojson.fromGeoJSON(geojsonExamples.Polygon);
  var expectedOverlay = overlayExamples.Polygon;

  ok(convertedOverlay instanceof google.maps.Polygon, "Overlay is a Polygon");
  QUnit.assert.polygonsEqual(convertedOverlay, expectedOverlay, "Deep equal compare");
});

test("GeoJSON Polygon with hole -> google.maps.Polygon", function(){
  var convertedOverlay = google.maps.geojson.fromGeoJSON(geojsonExamples.Polygon_hole),
      expectedOverlay = overlayExamples.Polygon_hole;

  ok(convertedOverlay instanceof google.maps.Polygon, "Overlay is a Polygon");
  QUnit.assert.polygonsEqual(convertedOverlay, expectedOverlay, "Polygon is correct");
});

test("GeoJSON MultiPolygon -> [google.maps.Polygon]", function(){
  var convertedOverlay = google.maps.geojson.fromGeoJSON(geojsonExamples.MultiPolygon),
      expectedOverlay = overlayExamples.Polygons;
      
  for(var i = 0; i < 2; i++){
    ok(convertedOverlay[i] instanceof google.maps.Polygon, "Overlay is a Polygon");
    QUnit.assert.polygonsEqual(convertedOverlay[i], expectedOverlay[i], "Polygon is correct");
  }
});