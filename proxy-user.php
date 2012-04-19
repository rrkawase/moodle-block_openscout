<?php
// Set your return content type
header('Content-type: json');

$function = $_GET['function'];

session_start();
session_id();

$username = '';
$password = '';
$firstname = '';
$lastname = '';
$email = '';

if( isset($_GET['username']))
	$username = $_GET['username'];

if( isset($_GET['password']))
	$password = $_GET['password'];
	

if( isset($_POST['username']))
	$username = $_POST['username'];

if( isset($_POST['password']))
	$password = $_POST['password'];

if( isset($_POST['firstname']))
	$firstname = $_POST['firstname'];

if( isset($_POST['lastname']))
	$lastname = $_POST['lastname'];

if( isset($_POST['email']))
	$email = $_POST['email'];

// Website url to open
$daurl = 'http://learn.openscout.net/userManagement.php?function='.$function;
 
 $strCookie = 'PHPSESSID='.session_id(); //'PHPSESSID=AAA';
 
 define('POSTVARS', 'username='.$username.'&password='.$password.'&firstname='.$firstname.'&lastname='.$lastname.'&email='.$email);  // POST VARIABLES TO BE SENT		

 $ch = curl_init($daurl );
 curl_setopt($ch, CURLOPT_POST      ,1);
 curl_setopt($ch, CURLOPT_POSTFIELDS    ,POSTVARS);
 curl_setopt($ch, CURLOPT_FOLLOWLOCATION  ,1); 
 curl_setopt($ch, CURLOPT_HEADER      ,0);  // DO NOT RETURN HTTP HEADERS 
 curl_setopt($ch, CURLOPT_RETURNTRANSFER  ,1);  // RETURN THE CONTENTS OF THE CALL
 curl_setopt($ch, CURLOPT_COOKIE, $strCookie ); 
 $Rec_Data = curl_exec($ch);

echo  $Rec_Data;

?>