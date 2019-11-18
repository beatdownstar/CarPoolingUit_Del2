let $username, $password;

$(document).ready(function () {
    init();
});


function init() {
    $("form input[type=submit]").click(function (e) {
        $username = $("#user").val();
        $password = $("#pass").val();

        if ($username == "" && $password == "") {
            $("#user").css({"border-color": "red"});
            $("#pass").css({"border-color": "red"});
            $("h6").text("Mangler brukernavn og passord");
            e.preventDefault();
        }
        else if ($username == "") {
            $("#user").css({"border-color": "red"});
            $("h6").text("Brukernavn mangler");
            e.preventDefault();
        }
        else if ($password == "") {
            $("#pass").css({"border-color": "red"});
            $("h6").text("Passord mangler");
            e.preventDefault();
        }
    });

    $(".form-control").click(function () {
        $("#user").removeAttr('style');
        $("#pass").removeAttr('style');
        $("h6").text("");
    });
}