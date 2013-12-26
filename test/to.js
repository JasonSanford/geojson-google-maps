module("Google Maps -> GeoJSON");

test("google.maps.Marker -> GeoJSON Point", function(){
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(0, 1, true)
  });
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(marker);
  var expectedGeoJSON = {"type":"Point","coordinates":[1,0]};
  
  deepEqual(convertedGeoJSON, expectedGeoJSON, "Passed!" );
});

test("[google.maps.Marker] -> GeoJSON MultiPoint", function(){
  var markers = [
    new google.maps.Marker({
      position: new google.maps.LatLng(0, 1, true)
    }),
    new google.maps.Marker({
      position: new google.maps.LatLng(3, 5, true)
    })
  ];
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(markers);
  var expectedGeoJSON = {
    "type":"MultiPoint",
    "coordinates": [
      [1,0],
      [5,3]
    ]
  };
  
  deepEqual(convertedGeoJSON, expectedGeoJSON, "Passed!" );
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

test("[google.maps.Polyline] -> GeoJSON LineString", function(){
  var polylines = [
    new google.maps.Polyline({
      path: [
        new google.maps.LatLng(0, 0),
        new google.maps.LatLng(1, 0),
        new google.maps.LatLng(1, 1),
        new google.maps.LatLng(0, 2)
      ]
    }),
    new google.maps.Polyline({
      path: [
        new google.maps.LatLng(0, -1),
        new google.maps.LatLng(1, 2),
        new google.maps.LatLng(4, 1),
        new google.maps.LatLng(0, -2)
      ]
    })
  ];
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(polylines);
  var expectedGeoJSON = {
    "type": "MultiLineString",
    "coordinates": [
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 0]
      ],
      [
        [-1, 0],
        [2, 1],
        [1, 4],
        [-2, 0]
      ]
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

test("[google.maps.Polygon] with one path -> GeoJSON Polygon", function(){
  var polygons = [
    new google.maps.Polygon({
      paths: [
        new google.maps.LatLng(0, 0),
        new google.maps.LatLng(1, 0),
        new google.maps.LatLng(1, 1),
        new google.maps.LatLng(0, 1)
      ]
    }),
    new google.maps.Polygon({
      paths: [
        new google.maps.LatLng(0, 0),
        new google.maps.LatLng(-3, 0),
        new google.maps.LatLng(5, 6),
        new google.maps.LatLng(3, -1)
      ]
    })
  ];
  var convertedGeoJSON = google.maps.geojson.toGeoJSON(polygons);
  var expectedGeoJSON = {
    "type": "MultiPolygon",
    "coordinates": [
      [
        [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
          [0, 0]
        ]
      ],
      [
        [
          [0, 0],
          [0, -3],
          [6, 5],
          [-1, 3],
          [0, 0]
        ]
      ]
    ]
  };
  
  deepEqual(convertedGeoJSON, expectedGeoJSON, "Passed!" );
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
  console.log(geoJson);
  ok(geoJson.type === 'Error', "Detected an unsupported object type");
});