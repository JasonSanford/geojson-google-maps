/**
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