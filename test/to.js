test("google.maps.Marker -> GeoJSON Point", function(){
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(53.45821, -13.195, true)
  });
  var geoJson = google.maps.geojson.toGeoJSON(marker);
  
  deepEqual(geoJson, {"type":"Point","coordinates":[-13.195,53.45821]}, "Passed!" );
});

test("google.maps.Polyline -> GeoJSON LineString", function(){
  var polyline = new google.maps.Polyline({
    path: [
      new google.maps.LatLng(0, 0),
      new google.maps.LatLng(1, 0),
      new google.maps.LatLng(1, 1),
      new google.maps.LatLng(0, 2)
    ]
  });
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(polyline);
  var expectedGeoJSON = {
    "type": "LineString",
    "coordinates": [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 0]
    ]
  };
  
  deepEqual(convertedGeoJSON, expectedGeoJSON, "Passed!" );
});

test("google.maps.Polygon with one path -> GeoJSON Polygon", function(){
  var polygon = new google.maps.Polygon({
    paths: [
      new google.maps.LatLng(0, 0),
      new google.maps.LatLng(1, 0),
      new google.maps.LatLng(1, 1),
      new google.maps.LatLng(0, 1)
    ]
  });
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(polygon);
  var expectedGeoJSON = {
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
  };
  
  deepEqual(convertedGeoJSON, expectedGeoJSON, "Passed!" );
});

test("google.maps.Polygon with two paths -> GeoJSON Polygon", function(){
  var polygon = new google.maps.Polygon({
    paths: [
      [
        new google.maps.LatLng(0, 0),
        new google.maps.LatLng(1, 0),
        new google.maps.LatLng(1, 1),
        new google.maps.LatLng(0, 1)
      ],
      [
        new google.maps.LatLng(.25, .25),
        new google.maps.LatLng(.75, .25),
        new google.maps.LatLng(.75, .75),
        new google.maps.LatLng(.25, .75)
      ]
    ]
  });
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(polygon);
  var expectedGeoJSON = {
    "type": "Polygon",
    "coordinates": [
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0]
      ],
      [
        [0.25, 0.25],
        [0.25, 0.75],
        [0.75, 0.75],
        [0.75, 0.25],
        [0.25, 0.25]
      ]
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
  console.log(geoJson);
  ok(geoJson.type === 'Error', "Detected an unsupported object type");
});