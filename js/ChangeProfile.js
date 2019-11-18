let $password, $passwordRepeat;
$(window).on('load', function() {
    init();

});


function init() {

    $btnChooseData = $("#profile-data-btn-choose");
    $btnChooseCar = $("#profile-car-btn-choose");
    $btnChangeData = $("#profile-data-btn-change");
    $btnChangeDataBack = $("#profile-data-btn-updateUserDataGoBack");
    $btnSaveData = $("#profile-data-btn-save");
    $btnChangeCar = $(".profile-car-btn-change");
    $btnSaveCar = $("#profile-car-btn-save");
    $profile_nav = $('#profile_nav');
    $btnNewCar = $("#profile-car-btn-addNewCar");
    $btnNewCarBack = $("#profile-car-btn-addNewCarGoBack");
    $btnChangeCarBack = $(".profile-car-btn-updateUserCarGoBack");




    $btnChangeData.on('click',function() {
        $("#profile-page-1-red").removeClass("d-none");
        $("#profile-page-1").addClass("d-none");

    });



    $("#changeProfileForm").on('submit', function() {
        $("#profile-page-1").removeClass("d-none");
        $("#profile-page-1-red").addClass("d-none");
    });

    $btnChangeDataBack.on('click',function() {
        $("#profile-page-1").removeClass("d-none");
        $("#profile-page-1-red").addClass("d-none");
    });



    $.each($btnChangeCar, function() {
        $(this).on('click',function(){

            $("#edit-car-"+$(this).data("vehicle-id")).removeClass("d-none");
            $("#profile-page-2").addClass("d-none");

        });

    });


    $.each($btnChangeCarBack, function() {
        $(this).on('click',function(){

            $("#profile-page-2").removeClass("d-none");
            $("#edit-car-"+$(this).data("vehicle-id")).addClass("d-none");

        });

    });


    $("#changeCarForm").on('submit', function() {
        $("#profile-page-2").removeClass("d-none");
        $("#profile-page-2-red").addClass("d-none");
    });

    $btnNewCar.on('click',function() {
        $("#profile-page-2-addCar").removeClass("d-none");
        $("#profile-page-2").addClass("d-none");

    });

    $btnNewCarBack.on('click',function() {
        $("#profile-page-2").removeClass("d-none");
        $("#profile-page-2-addCar").addClass("d-none");

    });

    $profile_nav.find('a').click(function(){

        $(this).tab('show');

    });

    $profile_nav.find('a:first').click();


$('#inputCarPhoto').on('change',function(){
//get the file name
    var path = $(this).val();
    var fileName= path.split('\\').pop();
//replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
});

    $('#inputBrukerPhoto').on('change',function(){
//get the file name
        var path = $(this).val();
        var fileName= path.split('\\').pop();
//replace the "Choose a file" label
        $(this).next('.custom-file-label').html(fileName);
    });

    $('#changePass, #changePassRepeat').on('keyup', function () {
        $password = $("#changePass").val();
        $passwordRepeat = $("#changePassRepeat").val();
        if ($password!=0 && $passwordRepeat!=0) {
            if ($password == $passwordRepeat) {
                $("h6").html('Passord er like').css('color', 'green');
                $('#profile-data-btn-save').removeAttr("disabled");
            } else {
                $("h6").html('Passord er ikke like').css('color', 'red');
                $('#profile-data-btn-save').attr("disabled", "disabled");
            }
        }
        else
            $("h6").html('');

    });

    $("form button[type=submit]").click(function (e) {

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

