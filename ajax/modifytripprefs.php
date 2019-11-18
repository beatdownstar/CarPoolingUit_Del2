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
if ($options == null || !isset($options['tripId'])) return -1;
$prefs = isset($options['prefs']) ? $options['prefs'] : array();

$tripId = $options['tripId'];

$tripObject = $database->getTrip($tripId);
$driver = $tripObject->getDriver();

$hasAuthority = false;

if (isset($driver) && !is_null($driver) && $driver->getUserId() == $_SESSION['userObject']->getUserId()) {
    $hasAuthority = true;
}

if (!$hasAuthority) return -1;

$existingPrefs = $database->getPreferencesFromTrip($tripId);
$existingPrefsSimplified = array();

foreach ($existingPrefs as $pref) {
    $existingPrefId = $pref->getPrefId();
    $existingPrefsSimplified[$existingPrefId] = $pref->getIsActive();
    if (!array_key_exists($existingPrefId, $prefs)) {
        $database->removePreferenceFromTrip($tripId, $existingPrefId);
    }
}

foreach ($prefs as $id => $value) {
    if (!array_key_exists($id, $existingPrefsSimplified)) {
        $database->setNewPreferenceOnTrip($tripId, $id, $value);
    } else {
        $database->updatePreferenceOnTrip($tripId, $id, $value);
    }
}

echo 1;

