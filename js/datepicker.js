const MAX_OFFSET = 6;

let now = new Date();
let offset = 0;
let offsetDate;
let selected;
let iterator = new Date();
let $outputElement;

$(document).ready(function() {
    $outputElement = $("#trip-input-date");

    Date.prototype.addDays = function(days) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    Date.prototype.addMonths = function(months) {
        let date = new Date(this.valueOf());
        date.setMonth(date.getMonth() + months);
        return date;
    };

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    $("#trip-datepicker-next").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        offset += 1;
        rebuild(offset);
    });

    $("#trip-datepicker-prev").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        offset -= 1;
        rebuild(offset);
    });

    build(0);
});

function checkOffset() {
    offsetDate = new Date().addMonths(offset);

    let nextBtn = $("#trip-datepicker-next");
    let prevBtn = $("#trip-datepicker-prev");

    if (offset > MAX_OFFSET - 1)
        nextBtn.attr('disabled', 'disabled');
    else
        nextBtn.removeAttr('disabled');

    if (offset <= 0)
        prevBtn.attr('disabled', 'disabled');
    else
        prevBtn.removeAttr('disabled');

}

function build(offset) {
    checkOffset();
    iterator = new Date().addMonths(offset);
    let title = iterator.toLocaleString("no-NO", { month: "long" }).capitalize() + " " + iterator.getFullYear();
    $("#trip-datepicker-title").text(title);
    iterator.setDate(1);
    iterator.setDate(iterator.getDate() - iterator.getDay() + 1);

    let $parent = $("#trip-datepicker");
    let $container = $("<div></div>").addClass("container-fluid border-bottom border-right");
    $container.append(getHeaderRow());
    let $row = getNewRow();

    for (let i = 0; i < 36; i++) {
        let disabled = (iterator < now || iterator.getMonth() !== offsetDate.getMonth());
        let isToday = (iterator.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0));
        let $button = getNewButton(iterator.getDate(), disabled, isToday);

        if (i % 7 === 0) {
            $container.append($row);
            $row = getNewRow();
        }

        $row.append($button);
        iterator = iterator.addDays(1);
    }

    $parent.append($container);

}

function rebuild(offset) {
    $("#trip-datepicker").empty();
    build(offset);
}

function getHeaderRow() {
    let $row = getNewRow();
    let daysLong = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];
    let daysShort = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

    for (let i = 0; i < 7; i++) {
        let $div = $("<div></div>").addClass("border border-bottom-0 border-right-0 font-weight-bold bg-light p-2 col");
        let $longSpan = $("<span></span>").text(daysLong[i]).addClass("text-center d-none d-lg-block");
        let $shortSpan = $("<span></span>").text(daysShort[i]).addClass("text-center d-lg-none d-block");
        $row.append($div.append($longSpan).append($shortSpan));
    }

    return $row;

}

function getDateString(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10){
        day = '0' + day;
    }

    if (month < 10){
        month = '0' + month;
    }
    return year + '-' + month + '-' + day;
}

function getNewRow() {
    return $('<div></div>').addClass("row justify-content-center align-items-center");
}

function getNewButton(text, disabled, today) {
    let $div = $("<div></div>").addClass("border border-bottom-0 border-right-0 bg-white col p-0");
    let $button = $("<button></button>").text(text).addClass("w-100 border-0 bg-white m-0  p-2");
    if (disabled) $button.attr('disabled', 'disabled').addClass("text-black-25");
    if (today) $button.addClass('font-weight-bold');
    let dateString = getDateString(iterator)
    $button.attr('date', dateString);

    if (selected === dateString)
        $button.addClass("selected");

    $button.on('click', function(e) {
        selected = $button.attr('date');
        $outputElement.val(selected);
        $outputElement.trigger('change');
        $("#trip-datepicker button").removeClass("selected");
        $button.addClass("selected");
        e.preventDefault();
    });

    $div.append($button);
    return $div;
}