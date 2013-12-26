test("google.maps.Marker -> GeoJSON Point", function() {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(53.45821, -13.195, true)
  });
  var geoJson = google.maps.geojson.toGeoJSON(marker);
  
  deepEqual(geoJson, {"type":"Point","coordinates":[-13.195,53.45821]}, "Passed!" );
});