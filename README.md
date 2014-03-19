# GeoJSON to Google Maps

## **Read This! **

Google Maps now has [proper support for GeoJSON](https://developers.google.com/maps/documentation/javascript/examples/layer-data-simple), so you should probably use that instead.

### version 1.0

### Jason Sanford

#### Overview
GeoJSON is used to create Google Maps API v3 vectors (Marker, Polyline, Polygon) from GeoJSON objects (Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, Feature, GeometryCollection, FeatureCollection). Specifically, I'm translating some GeoJSON types to arrays of Google Maps vectors as there aren't really Google Maps equivalents of MultiPoint, MultiLineString, etc.

#### Constructor Parameters
@param {Object} geojson
A valid GeoJSON object. One of Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, Feature, GeometryCollection, FeatureCollection. See the [official GeoJSON spec](http://geojson.org) for more details. GeoJSON examples below.
		
@param? {Object} options - Optional
Options for the specific type of Google Maps vector (Marker, Polyline, Polygon). If none specified, boring black vectors and red markers will be created - Optional. Samples Below.

#### GeoJSON -> Google Maps equivalents
<table>
<tr><th>GeoJSON Type</th><th>Output</th></tr>
<tr><td>Point</td><td>google.maps.Point</td></tr>
<tr><td>LineString</td><td>google.maps.Polyline</td></tr>
<tr><td>Polygon</td><td>google.maps.Polygon</td></tr>
<tr><td>MultiPoint</td><td>Array of google.maps.Point</td></tr>
<tr><td>MultiLineString</td><td>Array of google.maps.Polyline</td></tr>
<tr><td>MultiPolygon</td><td>Array of google.maps.Polygon</td></tr>
<tr><td>Feature</td><td>google.maps.[Point,Polyline,Polygon] (depends on Feature geometry type)</td></tr>
<tr><td>FeatureCollection</td><td>Array of google.maps.[Point,Polyline,Polygon] (depends on Feature geometry type)</td></tr>
<tr><td>GeometryCollection</td><td>Array of google.maps.[Point,Polyline,Polygon] (depends on geometry type)</td></tr>
</table>

#### GeoJSON Examples
	// GeoJSON Point
	{
		"type": "Point",
		"coordinates": [
			-80.66252,
			35.04267
		]
	}
	
	// GeoJSON LineString
	{
		"type": "LineString",
		"coordinates": [
			[-80.661983228058659, 35.042968081213758],
			[-80.662076494242413, 35.042749414542243],
			[-80.662196794397431, 35.042626481357232],
			[-80.664238981504525, 35.041175532632963]
		]
	}
	
	// GeoJSON Polygon
	{
		"type": "Polygon",
		"coordinates": [
			[
				[-80.662120612605904, 35.042875219905184],
				[-80.662141716053014, 35.042832740965068],
				[-80.662171938563816, 35.042789546962993],
				[-80.662209174653029, 35.042750233165179],
				[-80.662250709107454, 35.042716920859959],
				[-80.662627586829899, 35.043072078075667],
				[-80.662595574310288, 35.043162322407341],
				[-80.662142312824884, 35.043015448098977],
				[-80.662145396323511, 35.042970839922489],
				[-80.662117972448982, 35.042908385949438],
				[-80.662120612605904, 35.042875219905184]
			]
		]
	}
	
	// GeoJSON Feature
	{
		"type": "Feature",
		"id": 9876,
		"geometry": {
			"type": "Point",
			"coordinates": [
				-80.66252,
				35.04267
			]
		},
		"properties": {
			"condition": "Satisfactory",
			"has_garage": false,
			"number_of_bedrooms": 3
		}
	}
	
	// GeoJSON FeatureCollection
	{
		"type": "FeatureCollection",
		"features": [
			{
				"type": "Feature",
				"id": 9876,
				"geometry": {
					"type": "Point",
					"coordinates": [
						-80.66252,
						35.04267
					]
				},
				"properties": {
					"condition": "Satisfactory",
					"has_garage": false,
					"number_of_bedrooms": 3
				}
			},{
				"type": "Feature",
				"id": 9875,
				"geometry": {
					"type": "Point",
					"coordinates": [
						-80.66262,
						35.04277
					]
				},
				"properties": {
					"condition": "Excellent",
					"has_garage": true,
					"number_of_bedrooms": 4
				}
			}
		]
	}

#### Sample Google Maps Vector Options
	// google.maps.Polyline
	{
		"strokeColor": "#FFFF00",
		"strokeWeight": 7,
		"strokeOpacity": 0.75
	}
	
	// google.maps.Polygon
	{
		"strokeColor": "#FF7800",
		"strokeOpacity": 1,
		"strokeWeight": 2,
		"fillColor": "#46461F",
		"fillOpacity": 0.25
	}
	
	// google.maps.Marker
	{
		"icon": "img/marker-house.png"
	}

#### Error Handling (Invalid GeoJSON)

I've made an attempt to check for properly formatted GeoJSON. If something doesn't look quite right I return a very simple error object.

	{
		"error": true,
		"message": "Invalid GeoJSON object: Feature object missing \"properties\" or \"geometry\" member."
	}

It would be in your best interest to first check the returned object to see if it's error free.
	
	var myGoogleVector = new GeoJSON(myGeoJSON, options);
	
	if (myGoogleVector.error){
		// Handle the error.
	}else{
		myGoogleVector.setMap(myMap);
	}
