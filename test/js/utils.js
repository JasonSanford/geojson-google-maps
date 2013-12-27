var COMPARISON_THRESHOLD = 0.0000000000001

QUnit.assert.polygonsEqual = function(testPolygon, expectedPolygon, message){
  var testPaths = testPolygon.getPaths(),
      expectedPaths = expectedPolygon.getPaths();

  QUnit.push(testPaths.getLength() === expectedPaths.getLength(), testPaths.getLength(), expectedPaths.getLength(), "Polygon has correct number of paths");
  for(var i = 0; i < testPaths.getLength(); i++){
    QUnit.push(testPaths.getAt(i).getLength() === expectedPaths.getAt(i).getLength(), testPaths.getAt(i).getLength(), expectedPaths.getAt(i).getLength(), "Paths " + i + " are the same length");
    deepEqual(testPaths.getAt(i), expectedPaths.getAt(i), "Paths " + i + " are equal");
  }
};

/**
 * We use this instead of QUnit's deepEqual() because we need
 * to do threshold comparisons on lat/lon since the coordinates
 * get rounded/modified inside of the Google Maps objects.
 */
function geoJSONCompare(testGeo, expectedGeo){
  strictEqual(testGeo.type, expectedGeo.type, "Types match");
  QUnit.push(coordsCompare(testGeo.coordinates, expectedGeo.coordinates), testGeo.coordinates, expectedGeo.coordinates, "Comparing coordinates");
};

/**
 * Compare two arrays of coordinates. It will recursively handle
 * different depths of nested coordinates to account for the
 * different GeoJSON coordinate structures
 */
function coordsCompare(testCoords, expectedCoords){
  
  // Base case is two numbers
  if(typeof testCoords === 'number' && typeof expectedCoords === 'number'){
    return thresholdCompare(testCoords, expectedCoords);
  }
  
  // No need to compare actual coordinates if the two arrays
  // are not the same length
  if(testCoords.length !== expectedCoords.length) return false;
  
  for(var i = 0; i < testCoords.length; i++){
    if(!coordsCompare(testCoords[i], expectedCoords[i])) return false;
  }
  
  // Tests passed if we reach this point
  return true;
};
function thresholdCompare(testCoord, expectedCoord){
  return Math.abs(testCoord - expectedCoord) < COMPARISON_THRESHOLD;
};