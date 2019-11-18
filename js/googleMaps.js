let map;
let departureMarker;
let destinationMarker;
let directionsService;
let directionsDisplay;



function initMap(latlng = {lat: 65, lng: 12.5}) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: latlng,
        streetViewControl: false,
        zoom: 3,
        zoomControl: true,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },
    });

    directionsService = new google.maps.DirectionsService();
    directionsDisplay  = new google.maps.DirectionsRenderer();
}

function resetDeparture() {
    departureMarker.setMap(null);
    directionsDisplay.setMap(null);
}

function resetDestination() {
    destinationMarker.setMap(null);
    directionsDisplay.setMap(null);
}

function setDeparture(latLng = null) {

    if (departureMarker instanceof google.maps.Marker) {
        resetDeparture();
    }

    if (latLng !== null) {
        departureMarker = new google.maps.Marker({
            position: latLng,
            map: map
        });

        if (!(destinationMarker instanceof google.maps.Marker) || destinationMarker.getMap() === null) {
            map.setCenter(latLng);
            map.setZoom(8);
        } else {
            showRoute();
        }
    }

}

function setDestination(latLng = null) {

    if (destinationMarker instanceof google.maps.Marker) {
        resetDestination();
    }

    if (latLng !== null) {
        destinationMarker = new google.maps.Marker({
            position: latLng,
            map: map
        });

        if (!(departureMarker instanceof google.maps.Marker) || departureMarker.getMap() === null) {
            map.setCenter(latLng);
            map.setZoom(8);
        } else {
            showRoute();
        }
    }
}

function showRoute() {
    if (departureMarker === null || destinationMarker === null)
        return;

    let request = {
        origin: departureMarker.getPosition(),
        destination: destinationMarker.getPosition(),
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
            map.fitBounds();
        } else {
            console.error("Feil ved innhenting av rute fra Google Maps: " + status);
        }
    });
}