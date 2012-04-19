<?php
// Set your return content type
header('Content-type: json');

session_start();
session_id();

$function = $_GET['function'];

// Website url to open
$daurl = 'http://openscout.dat.demokritos.gr/toolLibraryServices/user.php?function='.$function;

 $strCookie = 'PHPSESSID='.session_id();

 $ch = curl_init($daurl);
 curl_setopt($ch, CURLOPT_FOLLOWLOCATION  ,1); 
 curl_setopt($ch, CURLOPT_HEADER      ,0);  // DO NOT RETURN HTTP HEADERS 
 curl_setopt($ch, CURLOPT_RETURNTRANSFER  ,1);  // RETURN THE CONTENTS OF THE CALL
 curl_setopt($ch, CURLOPT_COOKIE, $strCookie ); 
 $Rec_Data = curl_exec($ch);

echo  $Rec_Data;
?>


