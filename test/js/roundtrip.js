module("Round-trip");

test("Point", function(){
  var original = geojsonExamples.Point,
      converted = roundTrip(original);
  geoJSONCompare(converted, original);
});

test("MultiPoint", function(){
  var original = geojsonExamples.MultiPoint,
      converted = roundTrip(original);
  geoJSONCompare(converted, original);
});

test("LineString", function(){
  var original = geojsonExamples.LineString,
      converted = roundTrip(original);
  geoJSONCompare(converted, original);
});

test("MultiLineString", function(){
  var original = geojsonExamples.MultiLineString,
      converted = roundTrip(original);
  geoJSONCompare(converted, original);
});

test("Polygon", function(){
  var original = geojsonExamples.Polygon,
      converted = roundTrip(original);
  geoJSONCompare(converted, original);
});

test("Polygon with hole", function(){
  var original = geojsonExamples.Polygon_hole,
      converted = roundTrip(original);
  geoJSONCompare(converted, original);
});

test("MultiPolygon", function(){
  var original = geojsonExamples.MultiPolygon,
      converted = roundTrip(original);
  geoJSONCompare(converted, original);
});

function roundTrip(geoJson){
  return google.maps.geojson.toGeoJSON(google.maps.geojson.fromGeoJSON(geoJson));
};