$(document).ready(function () {

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        var data1 = google.visualization.arrayToDataTable([
            ['Task', 'Reiser'],
            ['Slettet før avreise',     5],
            ['Gjennomførte reiser',      parseInt(previousTrips - 5)],
        ]);

        var data2 = google.visualization.arrayToDataTable([
            ['Task', 'Reiser'],
            ['Tildelt sjåfør',     parseInt(drivers)],
            ['Ingen sjåfør',      parseInt(currentTrips - drivers)],
        ]);

        var campusdata = google.visualization.arrayToDataTable([
            ['Task', 'Reiser per bruker'],
            ['Alta',     20],
            ['Bodø',      10],
            ['Narvik',      30],
            ['Tromsø',      50/100],
            ['Hammarfest',      10]
        ]);

        var options1 = {
            title: 'Tidligere reiser: ' + previousTrips,
            fontName: "Rubik, Helvetica, Arial, sans-serif",
            fontSize: '15',
            width: 400,
            height: 240,
            colors: ['#3D9970','#e0440e'],
            legend: {
                position: 'bottom',
                fontSize: '8',
            },
            chartArea: {
                right: 1,
                left: 6
            },
            is3D: true
        };

        var options2 = {
            title: 'Nåværende reiser: ' + currentTrips,
            fontName: "Rubik, Helvetica, Arial, sans-serif",
            fontSize: '15',
            width: 400,
            height: 240,
            colors: ['#3D9970','#e0440e'],
            legend: {
                position: 'bottom',
                fontSize: '8',
            },
            chartArea: {
                right: 1,
                left: 6
            },
            is3D: true
        };

        var campusOptions = {
            title: "Antall reiser gjennomført per campus",
            fontName: "Rubik, Helvetica, Arial, sans-serif",
            fontSize: '15',
            width: 550,
            height: 500,
            legend: { position: "none" },
            chartArea: {
                width: 500,
                height: 400,


            }
        };

        var chart1 = new google.visualization.PieChart(document.getElementById('piechart1'));
        var chart2 = new google.visualization.PieChart(document.getElementById('piechart2'));
        var campuschart = new google.visualization.ColumnChart(document.getElementById('campuschart'));

        chart1.draw(data1, options1);
        chart2.draw(data2, options2);
        campuschart.draw(campusdata, campusOptions);

    }
});