var map;
var rawResults = [];

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
            rawResults.push(results[i]);
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

document.getElementById('rankButton').addEventListener('click', function(){

    var rankedList = document.getElementById("rankedList");
    service = new google.maps.places.PlacesService(map);

    for(i=0; i<rawResults.length; i++){
        var request = {
            placeId: rawResults[i].place_id,
            fields: ['name', 'rating']
        }
        
        service.getDetails(request, function(place, status){
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                name = place.name;
                rating = place.rating;
                var newListItem = document.createElement("li");
                var newListItemValue = document.createTextNode(name + " " + rating);
                newListItem.appendChild(newListItemValue);
                rankedList.appendChild(newListItem);
            } else {
                console.log(status)
            }
        });

    }
});