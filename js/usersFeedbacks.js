$(document).ready(function () {
    var FeedbackId;
    var SenderName;
    var SenderSurname;
    var Text;
    var Answered;
    var Date;
    var Epost;

    $("#showFeedback").hide();

    $(".feedbackInfo").on('click', function () {

        FeedbackId = $(this).data('id');
        SenderName = $(this).data('sendername');
        SenderSurname = $(this).data('sendersurname');
        Text = $(this).data('text');
        Answered = $(this).data('answered');
        Epost = $(this).data('epost');

        Date = $(this).find('td').eq(0).text();
        $("#chooseFeedback").removeClass('disabled');
        $(".feedbackInfo").removeClass('alert alert-secondary');
        $(this).addClass('alert alert-secondary').data('id');
    });

    $("#chooseFeedback").on('click', function () {
        $("#showFeedbacks").hide();
        $("#showFeedback").show();
        $("#senderAndDate").text(SenderName + " " + SenderSurname + " " + Date);
        $("#feedbackMessage").text(Text);
        $("#senderEpost").val(Epost);
        $("#feedbackId").val(FeedbackId);
    });

    $("#previous").on('click', function () {
        $("#showFeedback").hide();
        $("#showFeedbacks").show();
    });

});

