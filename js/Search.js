const REFRESH_TIMEOUT = 600;

let tripID;
let loading = false;
let checkBoxes = {};
let options = {};
options['filter'] = checkBoxes;
let flexibility = 0;
options['flexibility'] = flexibility;
let prefChangeTimeout;

$(document).ready(function () {
    init();
});

function init() {
    setupCheckBoxes();
    setupFlexibility();

    $(".trip-id").on('click', function () {
        tripID = $(this).data('id');
    });

    $("#new").off().click(function () {
        assignUserToTrip(tripID);
    });

    $("#remove").off().click(function () {
        removeUserFromTrip(tripID);
    });

    $("#delete").off().click(function () {
        deleteTrip(tripID);
    });

    $(".pageSelect").on('click', function () {
        if (!loading) loadNextPage($(this).text());
    });

    $(".select").on('click', function () {
        redirectToMyTrips(tripID)
    });

    function loadNextPage(page){
        loading = true;
        $(".pageSelect").removeClass('active');
        $("#page"+page).addClass('active');
        $("#loading-overlay").addClass("d-flex");
        $.get("registerTrip.php", {page: page}).done(function (data) {
            $(".tripRow").html(data);
            $("#loading-overlay").removeClass("d-flex");
            loading = false;
        });
    }

    function assignUserToTrip(tripID){
        $("h6").html("Vent mens vi registrerer deg");
        $(".modal-footer").html("<div class='spinner-border ml-auto mr-auto'></div>");
        $.get("registerTrip.php", {newTrip: tripID}).done(function (data) {
            if(data == true) {
                $("h6").html("Du er nå meldt på reisen");
                setTimeout(redirectToMyTrips(tripID), 1500);
            }else {
                $("h6").html("Du er allerede meldt på denne reisen, venligst velg en ny");
                setTimeout(refresh, 1500);
            }
        });
    }

    function removeUserFromTrip(tripID) {
        $.get("tripdetails.php", {removeTrip: tripID}).done;
        $(".modal-footer").html("<div class='spinner-border ml-auto mr-auto'></div>");
        window.location.replace("showMyTrips.php");
    }

    function deleteTrip(tripID) {
        $.get("tripdetails.php", {removeTrip: tripID}).done;
        $.get("tripdetails.php", {deleteTrip: tripID}).done;
        window.location.replace("showMyTrips.php");
    }

    function redirectToMyTrips(tripID) {
        window.location.replace("tripdetails.php?id="+tripID);
    }

    function refresh() {
        location.reload()
    }

}

function setupCheckBoxes() {
    $.each($('.search-pref'), function () {
        let $this = $(this);
        let id = $this.attr('id');
        checkBoxes[id] = 0;
        $this.prop('indeterminate', true);

        $("label[for='" + id + "']").on('click', function(e) {

            clearTimeout(prefChangeTimeout);
            e.preventDefault();
            e.stopPropagation();
            let $this = $('#' + id);
            if ($this.prop('indeterminate')) {
                $this.prop('indeterminate', false);
                $this.prop( "checked", true );
                checkBoxes[$this.attr('id')] = 1;
            } else if ($this.prop('checked') === true) {
                $this.prop('checked', false);
                checkBoxes[$this.attr('id')] = -1;
            } else {
                $this.prop('indeterminate', true);
                checkBoxes[$this.attr('id')] = 0;
            }
            prefChangeTimeout = setTimeout(function() {
                refreshSearchResults();
            }, REFRESH_TIMEOUT);
        });
    });
}

function setupFlexibility() {
    let $select = $('#trip-flexibility');
    flexibility = $select.val();
    $select.on('change', function() {
        clearTimeout(prefChangeTimeout);
        flexibility = $select.val();
        prefChangeTimeout = setTimeout(function() {
            refreshSearchResults();
        }, REFRESH_TIMEOUT);
    });
}

function refreshSearchResults() {
    $.post("ajax/getsearchresult.php", {options: options}, function () {})
        .done(function (data) {
            if (data !== '-1') {
                $('#accordion').html(data);
            }
        })
        .always(function () {

        })
        .fail(function (data) {
            alert("Error: " + data);
        });
}
