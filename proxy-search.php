<?php
// Set your return content type
header('Content-type: json; charset=utf-8');


session_start();
session_id();


$luceneString = $_POST['luceneString'];
$resultType = $_POST['resultType'];
$page = $_POST['page'];

//$luceneString = $_GET['luceneString'];
//$resultType = $_GET['resultType'];
//$page = $_GET['page'];

$luceneString  = urlencode($luceneString);

// Website url to open
$daurl = 'http://learn.openscout.net/harvesterServices/search.php?' . 'luceneString='.$luceneString.'&resultType='.$resultType.'&page='.$page;

 $strCookie = 'PHPSESSID='.session_id();

 $ch = curl_init($daurl);
 curl_setopt($ch, CURLOPT_FOLLOWLOCATION  ,1); 
 curl_setopt($ch, CURLOPT_HEADER      ,0);  // DO NOT RETURN HTTP HEADERS 
 curl_setopt($ch, CURLOPT_RETURNTRANSFER  ,1);  // RETURN THE CONTENTS OF THE CALL
 curl_setopt($ch, CURLOPT_COOKIE, $strCookie ); 
 $Rec_Data = curl_exec($ch);

echo  $Rec_Data;

?>


