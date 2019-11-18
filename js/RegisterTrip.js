let $btnNext, $btnPrev, $btnSubmit;
let $inputDeparture, $inputDestination, $inputDate, $inputTime;
let $outputDeparture, $outputDestination, $outputDateTime;
let $tripStepper;
let $tripSelectHour, $tripSelectMin;

$(document).ready(function() {
    init();
});

function overrides() {
    let oShow = $.fn.show;
    $.fn.show = function() {
        this.removeClass("d-none");
        return oShow.apply(this, arguments);
    };

    let oHide = $.fn.hide;
    $.fn.hide = function() {
        this.addClass('d-none');
        return oHide.apply(this, arguments);
    };
}

function init() {
    setVars();
    restrictDate();
    overrides();

    $.each($('.trip-pref'), function () {
        let $this = $(this);
        let id = $this.attr('id');
        $this.prop('indeterminate', true);

        $("label[for='" + id + "']").on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            let $this = $('#' + id);
            if ($this.prop('indeterminate')) {
                $this.prop('indeterminate', false);
                $this.prop( "checked", true );
            } else if ($this.prop('checked') === true) {
                $this.prop('checked', false);
            } else {
                $this.prop('indeterminate', true);
            }
        });
    });

    attachChangeHandler($inputDeparture);
    attachChangeHandler($inputDestination);


    $inputDate.on('change', function() {
        checkDateTimeBelowMap();
        verifyAvailableHours();
    });

    $inputTime.on('change', function() {
        checkDateTimeBelowMap();
    });

    $inputDate.trigger('change');
    $inputTime.trigger('change');

    setupOutputBelowMap();

    $btnNext.click(function(){
        $tripStepper.find('.nav-item > .active').parent().nextAll('li:first').find('a').click();
   });

    $btnPrev.click(function(){
        $tripStepper.find('.nav-item > .active').parent().prevAll('li:first').find('a').click();
    });

    $tripStepper.find('a').click(function(){
        let tabId = $(this).attr('href');
        fixButtons(tabId);
        if (tabId === "#tab-trip-confirm") {
            validateInput();
            $outputDeparture.text($inputDeparture.val());
            $outputDestination.text($inputDestination.val());
            let formattedDate = new Date($inputDate.val()).toLocaleDateString();
            $outputDateTime.text(formattedDate + ", " + $inputTime.val());
        }

        $(this).tab('show');

    });

    $tripStepper.find('a:first').click();

    $tripSelectMin.change(function() {
        $inputTime.val($tripSelectHour.val() + ":" + $(this).val());
        $inputTime.trigger('change');
    });

    $tripSelectHour.change(function() {
        $inputTime.val($(this).val() + ":" + $tripSelectMin.val());
        $inputTime.trigger('change');
    });


}

function setupIndeterminateCheckbox(id) {
    $('#' + id).prop('indeterminate', true);

    $("label[for='" + id + "']").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        let $this = $('#' + id);
        if ($this.prop('indeterminate')) {
            $this.prop('indeterminate', false);
            $this.prop( "checked", true );
        } else if ($this.prop('checked') === true) {
            $this.prop('checked', false);
        } else {
            $this.prop('indeterminate', true);
        }
    });
}

function restrictDate() {
    let today = new Date();
    let nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    $inputDate.attr('min', getDateString(today));
    $inputDate.attr('max', getDateString(nextYear));
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

function setVars() {
    $btnNext = $("#register-trip-btn-next");
    $btnPrev = $("#register-trip-btn-prev");
    $btnSubmit = $('#register-trip-btn-submit');

    $btnPrev.hide();
    $btnSubmit.hide();

    $inputDeparture = $("#trip-input-departure");
    $inputDestination = $("#trip-input-destination");
    $inputDate = $("#trip-input-date");
    $inputTime = $("#trip-input-time");

    $outputDeparture = $("#trip-output-departure");
    $outputDestination = $("#trip-output-destination");
    $outputDateTime = $("#trip-output-datetime");

    $tripStepper = $('#trip-stepper');
    $tripSelectHour = $('#trip-select-hour');
    $tripSelectMin = $('#trip-select-min');
}


function fixButtons(activeTab) {
    $btnNext.show();
    $btnPrev.show();
    $btnSubmit.hide();
    $btnSubmit.attr('disabled', 'disabled');

    $($(activeTab).find('input:first')).focus();

    switch(activeTab) {
        case('#tab-trip-locations'):
            setTitle("Rute");
            $btnPrev.hide();
            break;
        case ('#tab-trip-date'):
            setTitle("Ankomst");
            break;
        case('#tab-trip-confirm'):
            setTitle("Bekreft registrering");
            $btnNext.hide();
            $btnSubmit.show();
            break;
        default:
            break;
    }

}

function setTitle(title) {
    let $titleElement = $("#trip-card-title");
    if ($titleElement.text().trim() !== title) {
        $titleElement.fadeOut(200, function() {
            $titleElement.text(title);
            $titleElement.fadeIn(200);
        });
    }
}

function attachChangeHandler(field) {
    field.on('change', function() {
        if ((field.val().length > 0 || field.text().length > 0) && validate(field) === 0) {
            field.addClass('is-invalid');
        } else {
            field.removeClass('is-invalid');
        }
    });
}

function setupOutputBelowMap() {

    $inputDeparture.on('focusout', function() {
       checkOutputBelowMap();
    });

    $inputDestination.on('focusout', function() {
        checkOutputBelowMap();
    });

    $tripSelectHour.on('change', function() {
        if ($inputDate.val().length === 0) return;

        let nowWithoutHours = new Date();
        let inputDate = new Date($inputDate.val());
        nowWithoutHours.setHours(0, 0, 0, 0);
        inputDate.setHours(0,0,0,0);
        verifyAvailableMinutes(inputDate > nowWithoutHours || inputDate < nowWithoutHours);
    });
}

function verifyAvailableHours() {
    let nowWithoutHours = new Date();
    let inputDate = new Date($inputDate.val());
    nowWithoutHours.setHours(0, 0, 0, 0);
    inputDate.setHours(0,0,0,0);

    if (!(inputDate > nowWithoutHours || inputDate < nowWithoutHours)) {
        let now = new Date();
        let hour = now.getHours();

        $.each($tripSelectHour.find('option'), function() {
            let $this = $(this);
            if ($this.val() < hour) {
                $this.addClass('d-none');
            }
        });

        let selectedOption = $tripSelectHour.find('option:selected(selected):first');
        let firstValidOption = $tripSelectHour.find('option:not(.d-none):first');

        if (selectedOption.val() < firstValidOption.val()) {
            $tripSelectHour.val(firstValidOption.val());
        }

    } else {
        $.each($tripSelectHour.find('option.d-none'), function() {
            let $this = $(this);
            $this.removeClass('d-none');
        });
    }

    $tripSelectHour.trigger('change');
}

function verifyAvailableMinutes(skipChecks) {

    if (skipChecks) {
        $.each($tripSelectMin.find('option.d-none'), function() {
            let $this = $(this);
            $this.removeClass('d-none');
        });
        return;
    }

    let now = new Date();
    let hours = now.getHours();
    let selectedHour = $tripSelectHour.val();

    if (selectedHour <= hours) {
        let minutes = now.getMinutes();

        $.each($tripSelectMin.find('option'), function() {
            let $this = $(this);
            if ($this.val() < minutes) {
                $this.addClass('d-none');
            }
        });

        let selectedMinute = $tripSelectMin.find('option:selected(selected):first');
        let firstValidMinute = $tripSelectMin.find('option:not(.d-none):first');

        if (selectedMinute.val() < firstValidMinute.val()) {
            $tripSelectMin.val(firstValidMinute.val());
        }
    } else {
        $.each($tripSelectMin.find('option.d-none'), function() {
            let $this = $(this);
            $this.removeClass('d-none');
        });
    }
}

function checkOutputBelowMap() {
    if ($("#map-from").text().length > 0 && $("#map-to").text().length > 0) {
        $("#map-no-route").hide();
        $("#map-route").show();
    } else {
        $("#map-no-route").show();
        $("#map-route").hide();
    }
}

function checkDateTimeBelowMap() {
    if ($inputDate.val().length > 0 && $inputTime.val().length > 0) {
        $("#map-date").text(new Date($inputDate.val()).toLocaleDateString() + ", " + $inputTime.val());
        $("#map-no-date").hide();
        $("#map-date-container").show();
    } else {
        $("#map-date-container").hide();
        $("#map-no-date").show();
    }
}

function validate(field) {
    let inDate, now;

    switch (field) {
        case $inputDeparture:
        case $inputDestination:
            // TODO: Validering.
            return 1;
        case $inputDate:
            try {
                let val = $inputDate.val();
                console.log(val);
                if (val.length === 0) return 0;
                inDate = new Date($inputDate.val()).setHours(0, 0, 0, 0);
                now = new Date().setHours(0, 0, 0, 0);
                let max = new Date($inputDate.attr('max'));

                if (inDate >= now && inDate <= max) {
                    if ($inputTime.val() !== '') $inputTime.trigger('change');
                    return 1;
                }
                return 0;
            } catch (e) {
                return 0;
            }
        case $inputTime:
            try {
                let val = $inputTime.val();
                if (val.length === 0) return 0;
                inDate = new Date($inputDate.val());
                now = new Date();
                let inputhm = $inputTime.val().replace(/:/g, '');
                let h = now.getHours();
                let m = now.getMinutes();
                let hm = (h < 10 ? '0' : '' + h) + (m < 10 ? '0' : '' + m);

                if (sameDay(inDate, now)) {
                    if (inputhm < hm) {
                        return 0;
                    }
                    return 1;
                }
                return 1;
            } catch (e) {
                return 1;
            }
        default:
            return -1;
    }
}

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

function validateInput() {
    let $outputInvalid = $("#trip-output-invalid");
    let $output = $('#trip-output');

    let departureIsValid = validate($inputDeparture) === 1;
    let destinationIsValid = validate($inputDestination) === 1;
    let dateIsValid = validate($inputDate) === 1;
    let timeIsValid = validate($inputTime) === 1;

    if (departureIsValid && destinationIsValid && dateIsValid && timeIsValid) {
        $outputInvalid.hide();
        $output.show();
        $btnSubmit.removeAttr("disabled");
    } else {
        let $existingUl = $outputInvalid.find('ul');
        if ($existingUl) $existingUl.remove();

        let $ul = $('<ul/>');
        $ul.addClass("text-danger");

        if (!departureIsValid) {
            $ul.append($('<li/>').append("Ugyldig avgangssted"));
            $inputDeparture.trigger('change');
        }
        if (!destinationIsValid) {
            $ul.append($('<li/>').append("Ugyldig destinasjon"));
            $inputDestination.trigger('change');
        }
        if (!dateIsValid) {
            $ul.append($('<li/>').append("Dato mangler"));
            $inputDate.trigger('change');
        }
        if (!timeIsValid) {
            $ul.append($('<li/>').append("Ugyldig tidspunkt"));
            $inputTime.trigger('change');
        }
        $outputInvalid.append($ul);
        $outputInvalid.show();

        $output.hide();
        $btnSubmit.attr('disabled', 'disabled');
    }
}