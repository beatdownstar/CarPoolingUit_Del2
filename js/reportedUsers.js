$(document).ready(function () {
    var RapportId;
    var SenderUserName;
    var SenderSurname;
    var ReportedName;
    var ReportedSurname;
    var ReporteduserId;
    var Reason;
    var Description;
    var Solved;
    var Date;

    $("#showReport").hide();

    $(".raportedUserInfo").on('click', function () {

        RapportId = $(this).data('id');
        SenderUserName = $(this).data('sendername');
        SenderSurname = $(this).data('sendersurname');
        ReportedName = $(this).data('reportedname');
        ReportedSurname = $(this).data('reportedsurname');
        ReporteduserId = $(this).data('reporteduserid');
        Description  = $(this).data('description');
        Reason = $(this).data('reason');
        Solved = $(this).data('solved');

        Date = $(this).find('td').eq(0).text();
        $("#chooseRaport").removeClass('disabled');
        $(".raportedUserInfo").removeClass('alert alert-secondary');
        $(this).addClass('alert alert-secondary').data('id');

    });

    $("#chooseRaport").on('click', function () {
        $("#showReportedUsers").hide();
        $("#showReport").show();
        $("#raportId").val(RapportId);
        $("#sender").text(SenderUserName + " " + SenderSurname + " " + Date);
        $("#description").text(Description);
        $("#reason").text("Bruker " + ReportedName + " " + ReportedSurname + " " + Reason );
    });

    $("#previous").on('click', function () {
        $("#showReport").hide();
        $("#showReportedUsers").show();
    });

});

