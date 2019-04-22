var map;

function setMap(zipCode) {

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
      componentRestrictions: {
        country: 'US',
        postalCode: zipCode
      }
    }, function(results, status) {
      if (status == 'OK') {
        map = new google.maps.Map(
            document.getElementById('map'), {zoom: 4, center: results[0].geometry.location});
        var request = {
            location: map.getCenter(),
            radius: document.getElementById('radius').value / 0.00062137,
            type: ['gym']
            };    
    
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, nearbySearchCallback);
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  
}

function nearbySearchCallback(results, status){
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i], map);
            console.log(results[i])
        }
        map.setCenter(results[0].geometry.location);
        map.setZoom(15);
      }
}

function createMarker(resultObj, map){
    var loc = resultObj.geometry.location;
    new google.maps.Marker({position: loc, map: map})
}

document.getElementById('searchButton').addEventListener('click', function(){
    var zipCode = document.getElementById('zipCode').value;
    setMap(zipCode);
});  