$(document).ready(function() {

    $("#becomeDriver").on('click', function () {
        tripID = $(this).data('id');
        updtateDriver(tripID);
    });

    $("#removeDriver").on('click', function () {
        tripID = $(this).data('id');
        removeDriver(tripID);
    });

    function updtateDriver(tripID) {
        $.get("tripdetails.php", {driver: tripID}).done(function (data) {
            if (data)
                location.reload();
            else {
                $('#driverModal').modal('show');
            }
        });
    }

    function removeDriver(tripID) {
        $.get("tripdetails.php", {removeDriver: tripID}).done(function (data) {
            if (data)
                location.reload();
            else {
                $('#driverModal').modal('show');
            }
        });
    }
});