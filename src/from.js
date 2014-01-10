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
        exteriorDirection = _cw(path);
        paths.push(path);
      }else if(i == 1){
        interiorDirection = _cw(path);
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
   * Determines whether a given path is clockwise.
   * It's exposed externally so that we can unit test it.
   */
  var _cw = google.maps.geojson.from._cw = function(path){
    return _area(path) >= 0;
  };
  
  /**
   * Calculates the signed area of a path. Used by _ccw
   */
  var _area = google.maps.geojson.from._area = function(path){
    var a = 0;
    var i;
    for(i = 0; i < path.length-1; i++){
      a += (path[i+1].lat() + path[i].lat()) * (path[i+1].lng() - path[i].lng());
    }
    a += (path[i].lat() + path[0].lat()) * (path[i].lng() - path[0].lng());
    return a;
  };

}());

