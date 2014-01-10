/**
 * Converts GeoJSON into Google Maps overlays (shapes)
 */

(function(){

  if(typeof google.maps.geojson === 'undefined') {
    google.maps.geojson = {};
  }

  google.maps.geojson.from = function( geojson, options ){

    var obj;
    
    var opts = options || {};
    
    switch ( geojson.type ){
    
      case "FeatureCollection":
        if (!geojson.features){
          obj = _error("Invalid GeoJSON object: FeatureCollection object missing \"features\" member.");
        }else{
          obj = [];
          for (var i = 0; i < geojson.features.length; i++){
            obj.push(_geometryToGoogleMaps(geojson.features[i].geometry, opts, geojson.features[i].properties));
          }
        }
        break;
      
      case "GeometryCollection":
        if (!geojson.geometries){
          obj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
        }else{
          obj = [];
          for (var i = 0; i < geojson.geometries.length; i++){
            obj.push(_geometryToGoogleMaps(geojson.geometries[i], opts));
          }
        }
        break;
      
      case "Feature":
        if (!( geojson.properties && geojson.geometry )){
          obj = _error("Invalid GeoJSON object: Feature object missing \"properties\" or \"geometry\" member.");
        }else{
          obj = _geometryToGoogleMaps(geojson.geometry, opts, geojson.properties);
        }
        break;
      
      case "Point": case "MultiPoint": case "LineString": case "MultiLineString": case "Polygon": case "MultiPolygon":
        obj = geojson.coordinates
          ? obj = _geometryToGoogleMaps(geojson, opts)
          : _error("Invalid GeoJSON object: Geometry object missing \"coordinates\" member.");
        break;
      
      default:
        obj = _error("Invalid GeoJSON object: GeoJSON object must be one of \"Point\", \"LineString\", \"Polygon\", \"MultiPolygon\", \"Feature\", \"FeatureCollection\" or \"GeometryCollection\".");
    
    }
    
    return obj;
    
  };
  
  /**
   * This function converts one GeoJSON geometry to a google maps object
   * or array of google maps objects
   */
  var _geometryToGoogleMaps = function( geojsonGeometry, options, geojsonProperties ){
    
    var googleObj;
    
    switch(geojsonGeometry.type){
      
      case "Point":
        googleObj = _marker(geojsonGeometry.coordinates);
        break;
        
      case "MultiPoint":
        googleObj = [];
        for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
          googleObj.push(_marker(geojsonGeometry.coordinates[i]));
        }
        break;
        
      case "LineString":
        googleObj = _polyline(geojsonGeometry.coordinates);
        break;
        
      case "MultiLineString":
        googleObj = [];
        for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
          googleObj.push(_polyline(geojsonGeometry.coordinates[i]));
        }
        break;
        
      case "Polygon":
        googleObj = _polygon(geojsonGeometry.coordinates);
        break;
        
      case "MultiPolygon":
        googleObj = [];
        for(var i = 0; i < geojsonGeometry.coordinates.length; i++){
          googleObj.push(_polygon(geojsonGeometry.coordinates[i]));
        }
        break;
        
      case "GeometryCollection":
        googleObj = [];
        if (!geojsonGeometry.geometries){
          googleObj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
        }else{
          for (var i = 0; i < geojsonGeometry.geometries.length; i++){
            googleObj.push(_geometryToGoogleMaps(geojsonGeometry.geometries[i], opts, geojsonProperties || null));
          }
        }
        break;
        
      default:
        googleObj = _error("Invalid GeoJSON object: Geometry object must be one of \"Point\", \"LineString\", \"Polygon\" or \"MultiPolygon\".");
    }
    
    // Set options and properties
    if(Object.prototype.toString.call(googleObj) === '[object Array]'){
      for(var i = 0; i < googleObj.length; i++){
        _setOptionsProperties(googleObj[i], options, geojsonProperties);
      }
    } else {
      _setOptionsProperties(googleObj, options, geojsonProperties);
    }
    
    return googleObj;
    
  };
  
  function _setOptionsProperties(googleObj, options, properties){
    if(options){
      googleObj.setOptions(options);
    }
    if(properties){
     googleObj.set("geojsonProperties", properties);
    }
  };
  
  /**
   * Creates a Google Maps Polygon from the coordinates list of
   * a GeoJSON Polygon
   */
  function _polygon(coordinates){
    var paths = [];
    var exteriorDirection;
    var interiorDirection;
    for(var i = 0; i < coordinates.length; i++){
      // GeoJSON spec demands that the last point in a polygon ring matches the first point
      var firstPoint = coordinates[i][0],
          lastPoint = coordinates[i][coordinates[i].length-1];
      if(firstPoint[0] !== lastPoint[0] && firstPoint[1] !== lastPoint[1]){
        return _error("First and last points of polygon ring " + (i + 1) + " do not match");
      }
      var path = [];
      for (var j = 0; j < coordinates[i].length-1; j++){
        path.push(_latlng(coordinates[i][j]));
      }
      if(!i){
        exteriorDirection = _ccw(path);
        paths.push(path);
      }else if(i == 1){
        interiorDirection = _ccw(path);
        if(exteriorDirection == interiorDirection){
          paths.push(path.reverse());
        }else{
          paths.push(path);
        }
      }else{
        if(exteriorDirection == interiorDirection){
          paths.push(path.reverse());
        }else{
          paths.push(path);
        }
      }
    }
    return new google.maps.Polygon({paths: paths});
  };
  
  /**
   * Creates a Google Maps Polyline from a list of GeoJSON coordinate
   * pairs such as from a LineString
   */
  function _polyline(coordinates){
    var path = [];
    for(var i = 0; i < coordinates.length; i++){
      path.push(_latlng(coordinates[i]));
    }
    return new google.maps.Polyline({path: path});
  };
  
  /**
   * Creates a Google Maps Marker from a GeoJSON coordinate pair
   */
  function _marker(coordinates){
    return new google.maps.Marker({position: _latlng(coordinates)});
  };
  
  /**
   * Creates a Google Maps LatLng object from a pair of GeoJSON coordinates
   */
  function _latlng(coordinates){
    return new google.maps.LatLng(coordinates[1], coordinates[0]);
  };
  
  /**
   * Formats an error object
   */
  function _error(message){
  
    return {
      type: "Error",
      message: message
    };
  
  };
  
  /**
   * Determines whether a given path is counterclockwise
   */
  function _ccw(path){
    var isCCW;
    var a = 0;
    for (var i = 0; i < path.length-2; i++){
      a += ((path[i+1].lat() - path[i].lat()) * (path[i+2].lng() - path[i].lng()) - (path[i+2].lat() - path[i].lat()) * (path[i+1].lng() - path[i].lng()));
    }
    if(a > 0){
      isCCW = true;
    }
    else{
      isCCW = false;
    }
    return isCCW;
  };

}());/**
 * Converts Google Maps overlays into GeoJSON
 */

(function(){

  if(typeof google.maps.geojson === 'undefined') {
    google.maps.geojson = {};
  }

  google.maps.geojson.to = function(overlays){
    
    // If an array of overlays was given and it's
    // length is 1 then distill to just the overlay
    if(_isArray(overlays) && overlays.length === 1){
      overlays = overlays[0];
    }
    
    // Array of overlays
    if(_isArray(overlays)){
      
      // Convert each overlay to GeoJSON
      var geoms = [];
      for(var i = 0; i < overlays.length; i++){
        geoms.push(_convertOverlay(overlays[i]));
      }
      
      // Determine what type of GeoJSON collection should be returned
      var multiPoint = true,
          multiLineString = true,
          multiPolygon = true;
      for(var i = 0; i < geoms.length; i++){
        var geo = geoms[i];
        if(geo.type === "Point") {
          multiLineString = false;
          multiPolygon = false;
        }
        else if(geo.type === "LineString") {
          multiPoint = false;
          multiPolygon = false;
        }
        else if(geo.type === "Polygon") {
          multiPoint = false;
          multiLineString = false;
        }
      }
      
      // Convert to and return the propery GeoJSON collection type
      if(multiPoint) {
        return _createMultiPoint(geoms);
      } else if(multiLineString){
        return _createMultiLineString(geoms);
      } else if(multiPolygon){
        return _createMultiPolygon(geoms);
      } else {
        return {
          "type": "GeometryCollection",
          "geometries": geoms
        };
      }
    }
    
    // Single overlay
    else {
      return _convertOverlay(overlays);
    }
    
  };
  
  /**
   * Convert one Google Maps overlay to GeoJSON
   */
  function _convertOverlay(overlay){
    // Markers
    if(overlay instanceof google.maps.Marker){
      return _convertMarker(overlay);
    }
    
    // Polylines
    else if(overlay instanceof google.maps.Polyline){
      return _convertPolyline(overlay);      
    }
    
    // Polygons
    else if(overlay instanceof google.maps.Polygon){
      return _convertPolygon(overlay);
    }
    
    // Error catchall
    else {
      return _error("No conversion to GeoJSON is available for the given object type");
    }
  };
  
  /**
   * Create a GeoJSON MultiPoint from an array of GeoJSON Points
   */
  function _createMultiPoint(points){
    return {
      "type": "MultiPoint",
      "coordinates": _collapseCoordinates(points)
    };
  };
  
  /**
   * Create a GeoJSON MultiLineString from an array of GeoJSON LineStrings
   */
  function _createMultiLineString(lines){
    return {
      "type": "MultiLineString",
      "coordinates": _collapseCoordinates(lines)
    };
  };
  
  /**
   * Create a GeoJSON MultiPolygon from an array of GeoJSON Polygons
   */
  function _createMultiPolygon(polygons){
    return {
      "type": "MultiPolygon",
      "coordinates": _collapseCoordinates(polygons)
    };
  };
  
  /**
   * Given an array of GeoJSON objects that have coordinates,
   * extract the coordinate arrays and return them together
   * in a single array.
   */
  function _collapseCoordinates(geos){
    var coords = [];
    for(var i = 0; i < geos.length; i++){
      coords.push(geos[i].coordinates);
    }
    return coords;
  };
  
  /**
   * Converts a google.maps.Polygon into a GeoJSON Polygon
   */
  function _convertPolygon(polygon){
    var rings = [];
    
    polygon.getPaths().forEach(function(path, i){
      var ring = _convertPath(path);
      
      // The first and last point in a GeoJSON polygon ring 
      // must be the same point 
      ring.push(ring[0]);
      
      rings.push(ring);
    });
    
    return {
      "type": "Polygon",
      "coordinates": rings
    };
  };
  
  /**
   * Converts a google.maps.Polyline into a GeoJSON LineString
   */
  function _convertPolyline(polyline){
    return {
      "type": "LineString",
      "coordinates": _convertPath(polyline.getPath())
    };
  };
  
  /**
   * Converts a google.maps.Marker into a GeoJSON Point
   */
  function _convertMarker(marker){
    return {
      "type": "Point",
      "coordinates": _convertLatLng(marker.getPosition())
    };
  };
  
  /**
   * Converts a Google Maps Path (MVCArray of LatLng) into
   * an array of GeoJSON coordinates
   */
  function _convertPath(path){
    var coords = [];
    path.forEach(function(point, i){
      coords.push(_convertLatLng(point));
    });
    return coords;
  };
  
  /**
   * Convert a google.maps.LatLng into a GeoJSON coordinate array
   */
  function _convertLatLng(latLng){
    return [latLng.lng(), latLng.lat()];
  };
  
  /**
   * Formats an error object
   */
  var _error = function( message ){
  
    return {
      type: "Error",
      message: message
    };
  
  };
  
  /**
   * Returns true if an object is an array
   * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
   */
  function _isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  };
   
}());