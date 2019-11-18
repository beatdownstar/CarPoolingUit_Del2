$(document).ready(function () {

    let tripId;

    $("#mytable .selectedTrip").on('click', function () {
        tripId = $(this).data('id');
        $("#remove").val(tripId);
        $(".selectedTrip").removeClass('alert alert-secondary selected');
        $(this).addClass('alert alert-secondary selected');
        $("#chooseTrip").prop("disabled", false);
    });

    $("#remove").on('click', function () {
        deleteTrip(tripId);
    });

    function deleteTrip(id) {
        $.get('editTrips.php', {delTrip: id}).done(function (data) {
            if(data) {
                message('Reisen ble slettet', 'success');
                table.row('.selected').remove().draw(false);
                $("#chooseTrip").prop("disabled", true);
            }
            else
                message('Du har ikke rettighet til å slette reiser', 'danger');
        });
    }

    // Hentet fra https://datatables.net/examples/api/row_details.html og modifisert {

    function format(passengers, preferences) {

        return '<table class="col-12" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td><strong>Passasjerer:</strong>' + passengers + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td><strong>Preferanser:</strong>' + preferences + '</td>' +
            '</tr>' +
            '</table>';
    }

    $('.info').on('click', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            $(this).find('.icon').removeClass('fas fa-minus-circle');
            $(this).find('.icon').addClass('fas fa-plus-circle');
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            row.child(format($(this).data('pass'), $(this).data('pref'))).show();
            $(this).find('.icon').removeClass('fas fa-plus-circle');
            $(this).find('.icon').addClass('fas fa-minus-circle');
            tr.addClass('shown');
        }
    });

    // Hentet fra https://datatables.net/examples/api/row_details.html og modifisert }

    var table = $('#mytable').DataTable({
        "scrollX": true,
        stateSave: true,
        responsive: true,
        "oLanguage": {
            "sLengthMenu": "Vis _MENU_ resultater per side",
            "sZeroRecords": "Ingen ting funnet",
            "sInfo": "Viser _START_ til _END_ av _TOTAL_ resultater",
            "sInfoEmpty": "Viser 0 til 0 av 0 resultater",
            "sInfoFiltered": "(filtrert fra _MAX_ totale resultater)",
            "sSearch":        "Søk:",
            "oPaginate": {
                "sFirst":    "Første",
                "sLast":    "Siste",
                "sNext":    "Neste",
                "sPrevious": "Forrige"
            },
        }
    });

    function message(text, type){
        $.notify({
            message: text
        }, {
            type: type,
            placement: {
                from: "top",
                align: "center"
            },
            timer: 0
        });
    }

})