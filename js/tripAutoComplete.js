class Point {

    constructor(id, address, point_name) {
        this._id = id;
        this._address = address;
        this._name = point_name;
    }

    get id() {
        return this._id;
    }

    get address() {
        return this._address;
    }

    get name() {
        return this._name;
    }
}

let predictions = [];
let points = [];

let $tripInputDeparture, $tripInputDestination;

$(document).ready(function() {

    $tripInputDeparture = $("#trip-input-departure");
    $tripInputDestination = $("#trip-input-destination");

    for (let index in pointsJson) {
        let p = new Point(
            pointsJson[index].id,
            pointsJson[index].address,
            pointsJson[index].name
        );

        points.push(p);
        predictions.push(p._name);
    }

    if (predictions.length > 0) predictions.sort();

    autoComplete($tripInputDeparture, predictions);
    autoComplete($tripInputDestination, predictions);

    $tripInputDeparture.on('change', function() {
        let id = getPointId($tripInputDeparture.val());
        $("#trip-input-departure-id").val(id);
    });

    $tripInputDestination.on('change', function() {
        let id = getPointId($tripInputDestination.val());
        $("#trip-input-destination-id").val(id);
    });

});

$(window).on('load', function() {
    $tripInputDeparture.trigger('change').trigger('focusout');
    $tripInputDestination.trigger('change').trigger('focusout');
});


function getPointId(userInput) {
    let index = -1;
    let match = false;
    while (!match) {
        index++;
        if (index === points.length) return "";
        match = points[index]._name === userInput;
    }
    return points[index]._id;
}


// Hentet fra https://www.w3schools.com/howto/howto_js_autocomplete.asp og modifisert
function autoComplete($input, predictions) {
    let currentFocus = -1;

    $input.on('focusout', function() {
        currentFocus = -1;
        closeAllLists();
    });

    $input.on('input', function() {
        let matches, match, val = this.value;
        closeAllLists();

        if (!val || val.length < 2) { return false;}
        currentFocus = -1;

        matches = document.createElement("DIV");
        matches.setAttribute("id", this.id + "autocomplete-list");
        matches.setAttribute("class", "autocomplete-list mx-3 mt-2 shadow-sm");

        this.parentNode.appendChild(matches);

        let matchCount = 0;

        for (let i = 0; i < predictions.length && matchCount < 3; i++) {
            let prediction = predictions[i];

            if (predictions[i].toUpperCase().includes(val.toUpperCase())) {
                matchCount ++;
                let matchStartIndex = prediction.toUpperCase().indexOf(val.toUpperCase());
                let matchEndIndex = matchStartIndex + val.length;

                let prefixStr = prediction.substr(0, matchStartIndex);
                let matchStr = prediction.substr(matchStartIndex, val.length);
                let affixStr = prediction.substr(matchEndIndex, prediction.length);

                match = document.createElement("DIV");
                match.innerHTML = prefixStr;
                match.innerHTML += "<strong>" + matchStr + "</strong>";
                match.innerHTML += affixStr;
                match.innerHTML += "<input type='hidden' value='" + predictions[i] + "'>";

                $(match).on('mousedown click', function() { // TODO: Kontroller at dette fungerer på mobil.
                    $input.val($(this).find('input:first').val());
                    closeAllLists();
                });

                matches.appendChild(match);
            }


        }
    });

    $input.on('keydown',function(e) {
        let x = $("#" + this.id + "autocomplete-list");
        if (x) x = x.find("div");
        if (e.keyCode === 40 && x.length > 0) {
            e.preventDefault();
            currentFocus++;
            addActive(x);
        } else if (e.keyCode === 38 && x.length > 0) {
            e.preventDefault();
            currentFocus--;
            addActive(x);
        } else if (e.keyCode === 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
                $input.trigger('change');
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1)
        $(x[currentFocus]).addClass("autocomplete-active");
    }
    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists($target) {
        let $lists = $(".autocomplete-list");

        for (let i = 0; i < $lists.length; i++) {
            if ($target == null || (!$target.is($lists[i]) && !$target.is($input))) {
                $lists[i].remove();
            }
        }
    }

    $(document).on('click', function(e) {
        closeAllLists($(e.target));
    });

}