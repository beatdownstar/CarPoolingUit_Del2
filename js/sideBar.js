$(document).ready(function () {

    var time = false;

    $("#sideBar").on('click', function () {
        $(".admin-navbar").css("min-width", "180px");
        $(".admin-navbar").css("width", "12%");
        $(".admin-menu").css("display", "block");
    });

    $("#closeBar").on('click', function () {
        $(".admin-navbar").css("width", "0")
        $(".admin-navbar").css("min-width", "0")
        $(".admin-menu").css("display", "none")
    });

    $(".arrow").on('click', function () {
        if ($(this).children().children().hasClass('fas fa-caret-left') && time === false) {
            time = true;
            $(this).children().children().removeClass('fas fa-caret-left');
            $(this).children().children().addClass('fas fa-caret-down');
            setTimeout(function () {
                time = false
            }, 350);
        }
        else if ($(this).children().children().hasClass('fas fa-caret-down') && time === false) {
            time = true;
            $(this).children().children().removeClass('fas fa-caret-down');
            $(this).children().children().addClass('fas fa-caret-left');
            setTimeout(function () {
                time = false
            }, 350);
        }
    });

});