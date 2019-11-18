let table;

$(document).ready(function () {


     var firstName;
     var lastName;
     var Email;
     var userId;
     var feideUser;

   /* $('#mytable').DataTable({
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
    });*/

    $("#editUser").hide();

    $(".userInfo").on('click', function () {
        firstName = $(this).find('td').eq(0).text();
        lastName = $(this).find('td').eq(1).text();
        Email = $(this).find('td').eq(2).text();
        userId = $(this).data('id');
        feideUser = $(this).find('td').eq(3).data('id');
        $("#chooseUser").prop("disabled", false);
        $("#delChoose").prop("disabled", false);
        $(".userInfo").removeClass('alert alert-secondary selected');
        $(this).addClass('alert alert-secondary selected').data('id');
    });

    $("#chooseUser").on('click', function () {
        $("#showUser").hide();
        $("#editUser").show();
        $("#userId").val(userId);
        $("#firstName").val(firstName);
        $("#lastName").val(lastName);
        $("#email").val(Email);
        $("#name").text(firstName + " " + lastName);

        if(feideUser == 1) {
            $("#feideWarning").show();
            $("#firstName").prop("disabled", true);
            $("#lastName").prop("disabled", true);
            $("#email").prop("disabled", true);
            $("#passcheck").hide();
            $("#passLabel").hide();
        }
        else {
            $("#feideWarning").hide();
            $("#firstName").prop("disabled", false);
            $("#lastName").prop("disabled", false);
            $("#email").prop("disabled", false);
            $("#passcheck").show();
            $("#passLabel").show();
        }
    });

    $("#previous").on('click', function () {
        $("#editUser").hide();
        $("#showUser").show();
    });

    $("#passcheck").on('click', function () {
        if ($(".password").prop("disabled") == true){
            $(".password").prop("disabled", false);
        } else {
            $(".password").prop("disabled", true);
        }

    });

    $("#remove").on('click', function () {
        if(feideUser)
            message('Kan ikke slette feide brukere', 'danger');
        else
            deleteUser(userId);
    });

    function deleteUser(id) {
        $.get('editUser.php', {delUser: id}).done(function (data) {
            if (data) {
                message('Brukeren ble slettet', 'success');
                table.row('.selected').remove().draw(false);
                $("#chooseUser").prop("disabled", true);
                $("#delChoose").prop("disabled", true);
            }
        });
    }

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

});

$(document).ready(function () {

    $(".prefInfo").on('click', function () {
        $("#choosePreference").removeClass('disabled');
        $("#deletePreference").removeClass('disabled');
        $(".prefInfo").removeClass('alert alert-secondary');
        $(this).addClass('alert alert-secondary').data('id');

        var prefid = $(this).data('id');
        $("#fillPrefId").val(prefid);

        var description = $(this).find("td").eq(0).html();
        $("#fillPrefDescription").val(description);

    });
});

$(document).ready(function () {

    $(".reasonInfo").on('click', function () {
        $("#chooseReason").removeClass('disabled');
        $("#deleteReason").removeClass('disabled');
        $(".reasonInfo").removeClass('alert alert-secondary');
        $(this).addClass('alert alert-secondary').data('id');

        var reasonid = $(this).data('id');
        $("#fillReasonId").val(reasonid);

        var description = $(this).find("td").eq(0).html();
        $("#fillReasonDescription").val(description);

    });
});



$(document).ready(function () {

    $(".bannedUserInfo").on('click', function () {
        $("#chooseBannedUser").removeClass('disabled');
        $("#chooseAktivUser").removeClass('disabled');
        $(".bannedUserInfo").removeClass('alert alert-secondary');
        $(this).addClass('alert alert-secondary').data('id');

        var userid = $(this).data('id');
        $("#fillId").val(userid);

        var epost = $(this).find("td").eq(2).html();
        $("#fillepost").val(epost);

    });
});


