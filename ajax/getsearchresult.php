<?php
require_once '../vendor/autoload.php';

$loader = new Twig_Loader_Filesystem('../templates');
$twig = new Twig_Environment($loader);

spl_autoload_register(function ($class_name) {
    require_once '../classes/' . $class_name . '.php';
});

@session_start();

$host = "kark.uit.no";
$dbname = "stud_v19_norus";
$username = "stud_v19_norus";
$password = "norus.uit";

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
} catch (PDOException $e) {

    print($e->getMessage());
}

$database = new Database_queries($db);

$options = isset($_POST['options']) ? $_POST['options'] : null;

if (is_null($options)) {
    returnError();
    die();
}

$prefs = null;
$hasDriver = null;
$flexibility = isset($options['flexibility']) ? $options['flexibility'] : 0;

foreach ($options['filter'] as $key => $value) {
    $prefPrefix = 'search-pref-';
    $statePrefix = 'search-state-';

    if (strpos($key, $prefPrefix) !== false) {
        if (substr($key, 0, strlen($prefPrefix)) == $prefPrefix) {
            $prefs[substr($key, strlen($prefPrefix))] = $value;
        }
    } else if (strpos($key, $statePrefix) !== false) {
        switch(substr($key, strlen($statePrefix))) {
            case 'driver': {
                $hasDriver = $value;
                break;
            }

        }
    } else {
        continue;
    }
}

$trips = $database->showAlternativeTrips($_SESSION['trip'], 1, $flexibility, $prefs, $hasDriver);

$template = $twig->loadTemplate('search.twig');
echo $template->renderBlock('nextPage', array('currentPage' => 1, 'trips' => $trips));

function returnError($code = -1) {
    echo $code;
}