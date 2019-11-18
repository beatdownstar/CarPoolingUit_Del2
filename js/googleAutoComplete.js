const DEPARTURERADIUS = 2000;
let departureInput;
let destinationInput;
let departureAutocomplete;
let destinationAutocomplete;

let map;
let departureMarker = null;
let destinationMarker = null;
let directionsService;
let directionsDisplay;
let tripDuration = -1;
let tripDurationText;
let userGeoLocation = null;


function activatePlacesSearch() {
    departureInput = document.getElementById('trip-input-departure');
    destinationInput = document.getElementById('trip-input-destination');

    $(departureInput).on('keydown', function() {
        resetDeparture();
        console.log("Departure input");
        $('#map-from').text('');
        checkOutputBelowMap();
    });

    $(destinationInput).on('keydown', function() {
       resetDestination();
       console.log("Destination input");
       $('#map-to').text('');
       checkOutputBelowMap();
    });

    let options = {
        componentRestrictions: {country: 'no'},
        language: {languageCode: 'no'}
    };

    departureAutocomplete = new google.maps.places.Autocomplete(departureInput, options);
    destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, options);

    let fields = ['place_id', 'geometry', 'name', 'address_components', 'types'];

    departureAutocomplete.setFields(fields);
    destinationAutocomplete.setFields(fields);


    departureAutocomplete.addListener('place_changed', function() {
        let place = departureAutocomplete.getPlace();

        let address = '';
        if (place.address_components) {
            address = [
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[0] && place.address_components[0].short_name || '')
            ].join(' ');
        }
        let placeName = place.name + ", " + address;

        document.getElementById('trip-input-departure-id').value = place.place_id;
        document.getElementById('trip-input-departure-name').value = placeName;
        console.log('Log: ' + place.name);
        setDeparture({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
        $("#map-from").text(place.name);
        $(departureInput).trigger('focusout');
    });

    destinationAutocomplete.addListener('place_changed', function() {
        let place = destinationAutocomplete.getPlace();

        let address = '';
        if (place.address_components) {
            address = [
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[0] && place.address_components[0].short_name || '')
            ].join(' ');
        }
        let placeName = place.name + ", " + address;

        document.getElementById('trip-input-destination-id').value = place.place_id;
        document.getElementById('trip-input-destination-name').value = placeName;
        setDestination({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
        $("#map-to").text(place.name);
        $(destinationInput).trigger('focusout');
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(userlocation) {
            if (userlocation != null && typeof userlocation !== "undefined") {
                userGeoLocation = {
                    lat: userlocation.coords.latitude,
                    lng: userlocation.coords.longitude
                };
                let circle = new google.maps.Circle(
                    {center: userGeoLocation, radius: userlocation.coords.accuracy + DEPARTURERADIUS});
                departureAutocomplete.setBounds(circle.getBounds());
                initMap(userGeoLocation, 6);
            } else {
                initMap();
            }
        }, function() {
            initMap();
        });
    } else {
        initMap();
    }
}





function initMap(latlng = {lat: 65, lng: 12.5}, zoom = 3) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: latlng,
        streetViewControl: false,
        zoom: zoom,
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
    if (departureMarker instanceof google.maps.Marker)
        departureMarker.setMap(null);

    if (directionsDisplay instanceof google.maps.DirectionsRenderer)
        directionsDisplay.setMap(null);
}

function resetDestination() {
    if (destinationMarker instanceof google.maps.Marker)
        destinationMarker.setMap(null);

    if (directionsDisplay instanceof google.maps.DirectionsRenderer)
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
            map.setZoom(7);
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
            map.setZoom(7);
        } else {
            showRoute();
        }
    }
}

function showRoute() {
    if (!departureMarker || !destinationMarker || !departureMarker.getMap() || !destinationMarker.getMap())
        return;
    

    let request = {
        origin: departureMarker.getPosition(),
        destination: destinationMarker.getPosition(),
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
    };

    directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
            tripDuration = response.routes[0].legs[0].duration.value;
            tripDurationText = response.routes[0].legs[0].duration.text;
            let bounds = new google.maps.LatLngBounds();

            bounds.extend(departureMarker.getPosition());
            bounds.extend(destinationMarker.getPosition());
            map.fitBounds(bounds);
        } else {
            console.error("Feil ved innhenting av rute fra Google Maps: " + status);
        }
    });
}