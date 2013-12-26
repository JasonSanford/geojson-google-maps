/**
 * Converts Google Maps overlays into GeoJSON
 */

(function(){

  if(typeof google.maps.geojson === 'undefined') {
    google.maps.geojson = {};
  }

  google.maps.geojson.toGeoJSON = function(overlay){
    
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
   
}());