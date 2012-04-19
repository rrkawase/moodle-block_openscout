<?php
  require_once("config.php");
  
    
?>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/user.js"></script>

<input id="advanced_search_keyword" name="advanced_search_keyword" type="text" value="<?php echo $key?>" style="display:none"></input>

<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1/themes/redmond/jquery-ui.css" rel="stylesheet" type="text/css" media="screen" />
<link href="<?php echo $OS_SERVER?>/js/poshytip-1.1/tip-darkgray/tip-darkgray.css" rel="stylesheet" type="text/css" media="screen" />
<link href="style/style.css" rel="stylesheet" type="text/css" media="screen" />

<script>
login();
</script>