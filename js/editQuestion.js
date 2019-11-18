$(document).ready(function () {


    var question;
    var answer;
    var questionId;


    $("#editQuestion").hide();

    $(".questionInfo").on('click', function () {
        question = $(this).find('td').eq(0).text();
        answer = $(this).find('td').eq(1).text();
        questionId = $(this).data('id');
        $("#chooseQuestion").removeClass('disabled');
        $("#deleteQuestion").removeClass('disabled');
        $(".questionInfo").removeClass('alert alert-secondary');
        $(this).addClass('alert alert-secondary').data('id');

        $("#fillQuestId").val(questionId);
        $("#fillQuestionText").val(question);
    });

    $("#chooseQuestion").on('click', function () {
        $("#showQuestion").hide();
        $("#editQuestion").show();
        $("#questionId").val(questionId);
        $("#questionText").val(question);
        $("#answerText").val(answer);
    });

    $("#previous").on('click', function () {
        $("#editQuestion").hide();
        $("#showQuestion").show();
    });

    $('#mytable').DataTable();


});