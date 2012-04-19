<?php
  require_once("config.php");
  
  $key = '';

  if( isset($_GET['search_keyword']) )
    $key = $_GET['search_keyword'];
  
    
?>
<html>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>
<script type="text/javascript" src="<?php echo $OS_SERVER?>/js/portal.js"></script>
<script type="text/javascript" src="js/site_search.js"></script>
<script type="text/javascript" src="js/openscout.js"></script>
<script type="text/javascript" src="js/user.js"></script>
<script type="text/javascript" src="js/search.js"></script>

<input id="advanced_search_keyword" name="advanced_search_keyword" type="text" value="<?php echo $key?>" style="display:none"></input>

<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1/themes/redmond/jquery-ui.css" rel="stylesheet" type="text/css" media="screen" />
<link href="<?php echo $OS_SERVER?>/js/poshytip-1.1/tip-darkgray/tip-darkgray.css" rel="stylesheet" type="text/css" media="screen" />
<link href="style/style.css" rel="stylesheet" type="text/css" media="screen" />


    <div style="margin:30px; color:#0F3A82;">
        <p><b>Welcome to OpenScout</b><br />
        <span style="font-size:12px">Skill-based scouting of open management content. </span>
        <p><span style="font-size:12px"><b>Begin by searching for your interests.</b></span></p>
        
          
    </div>
  
  <br><br><br></br></br></br>
    <div style="margin:30px; color:#0F3A82;font-size:12px">  
      <img src="images/eu.jpg" alt="EU Flag" style="vertical-align:middle;"> © <strong>OpenScout</strong> Consortium 2009-2011. <strong>OpenScout</strong> is co-funded by the European Commission's <em>e</em>Content<em>plus</em> Programme.</p>
    </div>
  <script>
    ajaxOnPageLoad();
  </script>
</html>