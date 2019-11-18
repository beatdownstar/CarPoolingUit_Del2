
$(document).ready(function () {
    initNoti();
});

function initNoti() {


    $("#regNewTrip").click(function (e) {
        console.log('regNewTrip is pressed');
        validateTrip();
    });

    $('#new').click(function() {
        validateJoinTrip();
    });

    function notifyUnvalidTrip() {
        $.notify({
            message: 'Ugyldig reise, du har allerede registrerte reiser i dette tidsrommet!'
        }, {
            type: 'danger',
            placement: {
                from: "top",
                align: "center"
            },
            timer: 0
        });
        console.log('hallo tester');
    }

    function validateTrip() {
        console.log('validate kjøres');
        $.get("registerTrip.php", {ajaxValidate: 'test'}).done(function(data){
            console.log('registerTrip is called');
            console.log(data);
            if (data == false) {
                console.log('validate is false');
                notifyUnvalidTrip();
            }
            else {
                $.post("registerTrip.php", {noThanks: 'submit'}, function(){});
                console.log('validate is true');
                window.location.replace("showMyTrips.php");
            }

        });
    }
}

function notifyUnvalidJoin() {
    $.notify({
        message: 'Kan ikke melde på reisen, du har allerede registrerte reiser i dette tidsrommet!'
    }, {
        type: 'danger',
        placement: {
            from: "top",
            align: "center"
        },
        timer: 0
    });
}

function validateJoinTrip() {
    let tripID = findGetParameter('id');
    $.get('registerTrip.php', {validateJoin: tripID}).done(function(data) {
        if (data == false) {
            console.log('validate false');
            console.log(data);
            notifyUnvalidJoin();
        }
        else {
            console.log('user assigned to trip');
            console.log(data);
            assignUserToTrip(tripID);

        }
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

