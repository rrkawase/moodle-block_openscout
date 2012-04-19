<?php

class block_openscout extends block_base {

    function init() {
      $this->title = get_string('pluginname', 'block_openscout');
    } //init


 function get_content() {
    if ($this->content !== NULL) {
      return $this->content;
    }
 
     $this->content         =  new stdClass;
     
     global $USER;
	
     $this->content->text   = '
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>
<script type="text/javascript" src="/blocks/openscout/js/log.js"></script>

<link href="/blocks/openscout/style/style.css" rel="stylesheet" type="text/css" />
	<div width="100%"  style=" width:100%; position:relative;display:block;float:left;background:url(/blocks/openscout/images/header_bg.gif) repeat-x; padding: 0; margin: 0 auto; border:1px solid black; min-width:520px">
		<div style="display:block;float:left; min-width:30px;">&nbsp;</div>
		<div style="display:block;float:left; cursor:pointer; "><img onclick="javascript:goHome()" src="/blocks/openscout/images/logo.gif" height="32" border="0" alt="logo" /></a></div>
		<div style="display:block;float:left; float:left; margin-left:25px;">
			<div style="float:left; font-size:13px; color:white;"><b>Search <br>OpenScout</b></div>
			<input style="width:110px; line-height:13px; height:13px; float:left; background:white; border:0; padding:6px 2px; margin:0; margin-top:3px; margin-left:10px; font:normal 11px Arial, Helvetica, sans-serif; color:#4c7a91;" id="advanced_search_keyword" name="advanced_search_keyword" onkeydown="if(window.event.keyCode==13)doSearch();" type="text" value="" ></input>
			<input id="search" type="image" src="/blocks/openscout/images/search.gif" style="float:left; margin:0; margin-top:3px; padding:0;" onclick="doSearch();">		
		</div>
		<div style="margin:-10px; width:180px; float:right; height:24px" id="header_buttons"></div>
	</div>
	
	
	<iframe id="openscout_frame" style="border:0px; width: 100%; max-height: 700px; min-height: 400px;" width="100%" height="100%" src="/blocks/openscout/searchIni.php"></iframe>    
	
		<script>
			var userCourses = new Array();
		
			document.getElementById("openscout_frame").parentNode.style.height="100%";
			
			function Course(id, fullname) {
				this.id = id;
				this.fullname = fullname;			
			}
			
			function goHome()
			{
				document.getElementById(\'openscout_frame\').contentWindow.location="/blocks/openscout/searchIni.php";
			}
			
			function doSearch()
			{
				document.getElementById(\'openscout_frame\').contentWindow.location="/blocks/openscout/search.php?search_keyword="+document.getElementById(\'advanced_search_keyword\').value;
				
				//document.getElementById(\'openscout_frame\').contentWindow.setKeywordAndSearch(document.getElementById(\'advanced_search_keyword\').value)
				//document.getElementById(\'openscout_frame\').src="../../blocks/openscout/search.php";
				//document.getElementById(\'openscout_frame\').contentWindow.setKeywordAndSearch(document.getElementById(\'advanced_search_keyword\').value);
				
				
				logUserMD("search", document.getElementById(\'advanced_search_keyword\').value);
			}
			
			function doLogin()
			{
				//document.getElementById(\'openscout_frame\').contentWindow.test();
				document.getElementById(\'openscout_frame\').contentWindow.login();
			}
			
			function doRegister()
			{
				window.open("http://learn.openscout.net","_newtab");
				//document.getElementById(\'openscout_frame\').contentWindow.register("'.$USER->username.'","'.$USER->firstname.'","'.$USER->lastname.'","'.$USER->email.'");
				
			}			

			function doLogout()
			{
				document.getElementById(\'openscout_frame\').contentWindow.logout();
			}	
			
			function logUserMD(action, param)
			{
				try{
					logMD(window.user_id, "'.$USER->id.'", action, param, userCourses);
				}
				catch(e)
				{
					alert(e)
				};
			}				
			
		</script>	
    ';
    


	$courses = enrol_get_my_courses();
	$counter = 0;
	foreach ($courses as $course) {
		$this->content->text .= '<script>var c = new Course("'.$course->id.'", "'.$course->fullname.'"); userCourses['.$counter.']=c;</script>';
		$counter = $counter+1;
	}    
    
    //$this->content->footer = 'Footer here...';

    return $this->content;
  }

	function instance_allow_config() {
	  return true;
	}

}   // Here's the closing curly bracket for the class definition
    // and here's the closing PHP tag from the section above.
?>

