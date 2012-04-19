<?php
  
  require_once("config.php");
  header('Content-Type: text/html; charset=utf-8');
 
  $loid = $_GET['loid'];
      
  // this is like the search but with the fixed UID as keyword to get one result.
?>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>
<script type="text/javascript" src="<?php echo $OS_SERVER?>/js/portal.js"></script>
<script type="text/javascript" src="js/site_search.js"></script>
<script type="text/javascript" src="js/openscout.js"></script>
<script type="text/javascript" src="js/user.js"></script>
<script type="text/javascript" src="js/search.js"></script>

<html>
<input id="advanced_search_keyword" name="advanced_search_keyword" type="text" value="<?php echo $loid?>" style="display:none" /></input>

<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1/themes/redmond/jquery-ui.css" rel="stylesheet" type="text/css" media="screen" />
<link href="<?php echo $OS_SERVER?>/js/poshytip-1.1/tip-darkgray/tip-darkgray.css" rel="stylesheet" type="text/css" media="screen" />
<link href="style/style.css" rel="stylesheet" type="text/css" media="screen" />

<script>
searchOne();

parent.logUserMD('viewResource', '<?php echo $loid?>/');


function goBack()
{
  var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  if(is_chrome)
    history.go(-1);
  else
    history.go(-2);
}

function createResults(data){

	var html = "";
	var results = data['lomResponse'];		
  var OS_SERVER = '<?php echo $OS_SERVER?>/';


	for(var i=0; i<results.length; i++) {	
		html += '\
				<div class="bg" ></div>\
				<div id="result" style="margin:20px; font-size:12px;">\
					<img class="img_border" style="float:left;margin:10px" src="'+OS_SERVER+results[i]['image']+'" alt="resource screenshot" width="80" height="60" />\
						<span style="font-weight:bold; color:#000; font-size:12px;">'+highlight(shorten(results[i]['title'],60), window.keyword)+'</span><br />\
						'+highlight(shorten(results[i]['description'].replace(/<\/?[^>]+(>|$)/g, ""),130), window.keyword)+'\
						<br /><br />\
					<div class="clr"></div>\
          <div style="padding:0px 15px 0px 15px;" id="resource_metadata">\
          <dl>\
						<dt>Publisher:</dt><dd id="publisher">'+results[i]["publisher"]+'</dd>\
						<dt>Publish Date:</dt><dd id="publish_date">'+results[i]["publish_date"]+'</dd>\
						<dt>Language:</dt><dd id="language">'+results[i]["language"]+'</dd>\
						<dt>Conten type:</dt><dd id="content_type">'+results[i]["content_type"]+'</dd>\
						<dt>Resource URL:</dt><dd id="location">'+results[i]["location"]+'</dd>\
						<dt>License:</dt><dd id="license">'+results[i]["license"]+'</dd>\
					</dl>\
          </div><br></br>\
          <img src="images/back.png" />\
            <a class="block_link" target="stage" onClick="goBack()">back</a> &nbsp;&nbsp;&nbsp;&nbsp;\
					<img src="images/gnome-session.png" />\
						<a class="block_link" onclick="readNow(\''+results[i]['location']+'\', \''+results[i]['uid']+'\')" title="open '+results[i]['title']+' in a new browser tab" rel="external">read now</a> &nbsp;&nbsp;&nbsp;&nbsp;\
					<img src="images/link.png" />\
            <a class="block_link" title="Get Link" onclick="getLink(\''+results[i]['uid']+'\', \''+i+'\');" >Get Link</a>\
            <input type="text" id="link_'+i+'" style="display:none;width:250px" value="'+results[i]['location']+'" />\
        </div>\
        <div class="clr"></div>';
	}	
	return html;

}

function readNow(location, loid)
{
  window.open(location,'newtab');
  parent.logUserMD('readNow', loid);
}

function getLink(loid, i)
{
  if(document.getElementById("link_"+i).style.display=="")
    document.getElementById("link_"+i).style.display="none";
  else
  {
    document.getElementById("link_"+i).style.display="";
    // log only if click to show
    parent.logUserMD('getResourceLink', loid);
  }
  
}

</script>

<div id="results" style="align:center;margin:20px; ">

</div>
  </html>