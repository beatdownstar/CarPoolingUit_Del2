let $password, $passwordRepeat;

$(document).ready(function () {
    init();
});

function init() {

    $('#changePass, #changePassRepeat').on('keyup', function () {
        $password = $("#changePass").val();
        $passwordRepeat = $("#changePassRepeat").val();
if ($password!=0 && $passwordRepeat!=0) {
    if ($password == $passwordRepeat) {
        $("h6").html('Passord er like').css('color', 'green');
        $('#submit').removeAttr("disabled");
    } else {
        $("h6").html('Passord er ikke like').css('color', 'red');
        $('#submit').attr("disabled", "disabled");
    }
}
    else
    $("h6").html('');

    });

    $("form input[type=submit]").click(function (e) {

        $password = $("#changePass").val();

        if (!checkPassword($password) && $password !="") {

            $("h6").html('Passord er for svak, må inneholde minst en stor bokstav, et siffer, et spesielt symbol og inneholde minst 8 symboler').css('color', 'red');
            e.preventDefault();
        }

    });


}


function checkPassword(str)
{
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
}


