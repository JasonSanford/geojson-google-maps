module("GeoJSON -> Google Maps");

test("GeoJSON Point -> google.maps.Marker", function(){
  var convertedOverlay = google.maps.geojson.from(geojsonExamples.Point);  
  var expectedOverlay = overlayExamples.Marker;
  
  ok(convertedOverlay instanceof google.maps.Marker, "Overlay is a Marker");
  deepEqual(convertedOverlay, expectedOverlay, "Deep equal compare");
});

test("GeoJSON MultiPoint -> [google.maps.Marker]", function(){
  var convertedOverlay = google.maps.geojson.from(geojsonExamples.MultiPoint);
  var expectedOverlay = overlayExamples.Markers;

  ok(convertedOverlay.length === 2, "Two Markers");
  ok(convertedOverlay[0] instanceof google.maps.Marker, "First Marker");
  ok(convertedOverlay[1] instanceof google.maps.Marker, "Second Marker");
  deepEqual(convertedOverlay, expectedOverlay, "Deep equal compare");
});

test("GeoJSON LineString -> google.maps.Polyline", function(){
  var convertedOverlay = google.maps.geojson.from(geojsonExamples.LineString);
  var expectedOverlay = overlayExamples.Polyline;

  ok(convertedOverlay instanceof google.maps.Polyline, "Overlay is a Polyline");
  deepEqual(convertedOverlay, expectedOverlay, "Deep equal compare");
});

test("GeoJSON MultiLineString -> [google.maps.Polyline]", function(){
  var convertedOverlay = google.maps.geojson.from(geojsonExamples.MultiLineString);
  var expectedOverlay = overlayExamples.Polylines;

  ok(convertedOverlay.length === 2, "Two Polylines");
  ok(convertedOverlay[0] instanceof google.maps.Polyline, "First Polyline");
  ok(convertedOverlay[1] instanceof google.maps.Polyline, "Second Polyline");
  deepEqual(convertedOverlay, expectedOverlay, "Deep equal compare");
});

test("GeoJSON Polygon -> google.maps.Polygon", function(){
  var convertedOverlay = google.maps.geojson.from(geojsonExamples.Polygon);
  var expectedOverlay = overlayExamples.Polygon;

  ok(convertedOverlay instanceof google.maps.Polygon, "Overlay is a Polygon");
  QUnit.assert.polygonsEqual(convertedOverlay, expectedOverlay, "Deep equal compare");
});

test("GeoJSON Polygon with hole -> google.maps.Polygon", function(){
  var convertedOverlay = google.maps.geojson.from(geojsonExamples.Polygon_hole),
      expectedOverlay = overlayExamples.Polygon_hole;

  ok(convertedOverlay instanceof google.maps.Polygon, "Overlay is a Polygon");
  QUnit.assert.polygonsEqual(convertedOverlay, expectedOverlay, "Polygon is correct");
});

test("GeoJSON MultiPolygon -> [google.maps.Polygon]", function(){
  var convertedOverlay = google.maps.geojson.from(geojsonExamples.MultiPolygon),
      expectedOverlay = overlayExamples.Polygons;
      
  for(var i = 0; i < 2; i++){
    ok(convertedOverlay[i] instanceof google.maps.Polygon, "Overlay is a Polygon");
    QUnit.assert.polygonsEqual(convertedOverlay[i], expectedOverlay[i], "Polygon is correct");
  }
});