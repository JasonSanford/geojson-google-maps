/*
 * @class GeoJSON
 * @version 0.2
 * @author Jason Sanford
 *
 * @fileoverview GeoJSON is used to create Google Maps API v3 vectors (Marker, Polyline, Polygon)
 *		from GeoJSON objects (Point, LineString, Polygon, MultiPolygon). I can't seem to think of
 *		quick and easy way to replicate MultiPoint and MultiLineString GeoJSON objects within the
 *		Google Maps API
 */

/*
 * GeoJSON
 * @constructor
 * @param {Object} geojson
 *		A valid GeoJSON geometry object. See spec at http://geojson.org
 *		Samples:
 *			{ "type": "Point", "coordinates": [-80.66252, 35.04267] }
 *			{ "type": "LineString", "coordinates": [ [-80.661983228058659, 35.042968081213758],	[-80.662076494242413, 35.042749414542243],	[-80.662196794397431, 35.042626481357232], [-80.664238981504525, 35.041175532632963] ] }
 *			{ "type": "Polygon", "coordinates": [ [ [-80.662120612605904, 35.042875219905184], [-80.662141716053014, 35.042832740965068], [-80.662171938563816, 35.042789546962993], [-80.662209174653029, 35.042750233165179], [-80.662250709107454, 35.042716920859959], [-80.662627586829899, 35.043072078075667], [-80.662595574310288, 35.043162322407341], [-80.662142312824884, 35.043015448098977], [-80.66214539632351, 35.042970839922489], [-80.662117972448982, 35.042908385949438], [-80.662120612605904, 35.042875219905184] ] ] }
 * @param? {Object} options
 *		Options for the specific type of Google Maps vector (Marker, Polyline, Polygon). If none
 *			specified, boring black vectors and red markers will be created - Optional
 *		Samples:
 *			{ strokeColor: "#FFFF00", strokeWeight:7, strokeOpacity: 0.75 }
 *			{ strokeColor: "#FF7800", strokeOpacity: 1, strokeWeight: 2, fillColor: "#46461F", fillOpacity: 0.25 }
 *			{ icon: "img/marker-house.png" }
 */
var GeoJSON = function(geojson,options){
	var obj;
	switch (geojson.type){
		case "Point":
			var opts = options || {};
			opts.position = new google.maps.LatLng(geojson.coordinates[1],geojson.coordinates[0]);
			obj = new google.maps.Marker(opts);
			break;
			
		case "LineString":
			var opts = options || {};
			var path = [];
			for (var i=0;i<geojson.coordinates.length;i++){
				var coord = geojson.coordinates[i];
				var ll = new google.maps.LatLng(coord[1],coord[0]);
				path.push(ll);
			}
			opts.path = path;
			obj = new google.maps.Polyline(opts);
			break;
			
		case "Polygon":
			var opts = options || {};
			var paths = [];
			for (var i=0; i<geojson.coordinates.length; i++){
				var path = [];
				for (var j=0; j<geojson.coordinates[i].length; j++){
					var ll = new google.maps.LatLng(geojson.coordinates[i][j][1], geojson.coordinates[i][j][0]);
					path.push(ll)
				}
				paths.push(path);
			}
			opts.paths = paths;
			obj = new google.maps.Polygon(opts);
			break;
			
		case "MultiPolygon":
			var opts = options || {};
			var paths = [];
			for (var i=0; i<geojson.coordinates.length; i++){
				for (var j=0; j<geojson.coordinates[i].length; j++){
					var path = [];
					for (var k=0; k<geojson.coordinates[i][j].length; k++){
						var ll = new google.maps.LatLng(geojson.coordinates[i][j][k][1],geojson.coordinates[i][j][k][0]);
						path.push(ll);
					}
					paths.push(path);
				}
			}
			opts.paths = paths;
			obj = new google.maps.Polygon(opts);
			break;
	}
	return obj;
};
