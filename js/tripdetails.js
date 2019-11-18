let $previousPrefList;
let setPrefs = [];
let editMode = false;

function checkSetPrefs() {
    setPrefs = [];

    $.each($('#trip-pref-list li[data-pref-id]'), function() {
        setPrefs.push($(this).data('pref-id'));
    });

    $.each($('#add-pref-dropdown > a'), function() {
        if (setPrefs.includes($(this).data('pref-id'))) {
            $(this).addClass('d-none');
        } else {
            $(this).removeClass('d-none');
        }
    });

    if (editMode && $('#add-pref-dropdown a:not(.d-none)').length) {
        $('#add-prefs-btn').removeClass('d-none');
    } else {
        $('#add-prefs-btn').addClass('d-none');
    }
}

function setEditMode(enabled) {
    editMode = enabled;

    if (enabled) {
        checkSetPrefs();
        considerIfAddingIsPossible();
        $('#edit-prefs-btn').addClass('d-none');
        $('#cancel-prefs-btn').removeClass('d-none');
        $('#save-prefs-btn').removeClass('d-none');
        $previousPrefList = $('#trip-pref-list').clone();

        $.each($('#trip-pref-list li[data-pref-id]'), function() {
            insertPrefCheckbox($(this), $(this).data('pref-id'), true);
        });
    } else {
        $('#trip-pref-list').replaceWith($previousPrefList);
        $('#cancel-prefs-btn').addClass('d-none');
        $('#add-prefs-btn').addClass('d-none');
        $('#edit-prefs-btn').removeClass('d-none');
        $('#save-prefs-btn').addClass('d-none');
    }
}

$(document).ready(function() {

    $('[data-toggle="tooltip"]').tooltip();

    $('#edit-prefs-btn').on('click', function() {
        setEditMode(true);
    });

    $('#save-prefs-btn').on('click', function() {
       savePrefs();
    });

    $('.add-pref').on('click', function() {
        let $this = $(this);
        let pref_id = $this.data('pref-id');

        insertPrefCheckbox($this, pref_id)

        if (!($('#add-pref-dropdown *:not(.d-none)').length)) {
            $('#add-prefs-btn').addClass('d-none');
        } else {
            $('#add-prefs-btn').removeClass('d-none');
        }
    });

    $('#cancel-prefs-btn').on('click', function() {
        setEditMode(false);
    });

    $("#delete").off().click(function () {
        let tripID = findGetParameter('id');
        deleteTrip(tripID);
    });
});

function deleteTrip(tripID) {
    $.get("tripdetails.php", {removeTrip: tripID}).done;
    $.get("tripdetails.php", {deleteTrip: tripID}).done;
    window.location.replace("showMyTrips.php");
}

function insertPrefCheckbox($this, pref_id, remove = false) {
    let $elem = $('#trip-list-item-template').clone().removeAttr('id').removeClass('d-none');
    $elem.attr('data-pref-id', pref_id);
    let $checkbox = $elem.find('div > input');
    let $label = $elem.find('div > label');
    $checkbox.prop('id', 'pref-cb-' + pref_id);

    if (remove) {
        $checkbox.prop('checked', $this.find('i.fa-check').length);
    }

    $label.prop('for', 'pref-cb-' + pref_id);
    $label.text($this.text());

    $elem.find('.close').on('click', function() {

        $('#add-pref-dropdown *[data-pref-id="' + $elem.data('pref-id') + '"]').removeClass('d-none');
        $elem.remove();

        if (!($('#trip-pref-list li:not(li.d-none)').length)) {
            $('#trip-pref-list').addClass('d-none');
        } else {
            $('#trip-pref-list').removeClass('d-none');
        }

        $('#add-prefs-btn').removeClass('d-none');
    });

    $('#trip-pref-list').append($elem);
    $('#trip-pref-list').removeClass('d-none');
    if (remove)
        $this.remove();
    else
        $this.addClass('d-none');

    checkSetPrefs();
}

function findGetParameter(parameterName) {
    let result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function savePrefs() {
    let $prefs = {};
    let trip_id = findGetParameter('id');

    let options = {};
    options['prefs'] = $prefs;
    options['tripId'] = trip_id;

    $.each($('#trip-pref-list > li[data-pref-id]'), function() {
        $prefs[$(this).data('pref-id')] = $(this).find('input').prop('checked') ? 1 : 0;
    });

    $.post("ajax/modifytripprefs.php", {options: options}, function () {})
        .done(function (data) {
            if (data !== '-1') {
                location.reload(true);
            }
        })
        .fail(function (data) {
            alert("En feil oppstod! Vennligst prøv på nytt. (" + data + ")");
        });
}

function considerIfAddingIsPossible() {
    if ($('#add-pref-dropdown > a').length) {
        $('#add-prefs-btn').removeClass('d-none');
    } else {
        $('#add-prefs-btn').addClass('d-none');
    }
}
