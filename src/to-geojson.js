/**
 * Converts Google Maps overlays into GeoJSON
 */

(function(){

  if(typeof google.maps.geojson === 'undefined') {
    google.maps.geojson = {};
  }

  google.maps.geojson.toGeoJSON = function(overlay){
    
    var geoJson;
    
    // Switch on overlay type
    if(overlay instanceof google.maps.Marker){
      geoJson = _convertLatLng(overlay.getPosition());
    }
      
    // Return resulting GeoJSON
    return geoJson;
  };
  
  /**
   * Convert a google.maps.LatLng into a GeoJSON Point
   */
  function _convertLatLng(latLng){
    return {
      "type": "Point",
      "coordinates": [latLng.lng(), latLng.lat()]
    };
  };
   
}());