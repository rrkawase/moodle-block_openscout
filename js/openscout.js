filters = '';
pages = '';
results = '';
hashesarray = '';
// Set the keyword and perform the search
function setKeywordAndSearch(key)
{
    $('input[name=advanced_search_keyword]').val(key);
    window.keyword = keyword;
    window.keyword = '"'+keyword+'"';
    //searchOne();
    window.location="/blocks/openscout/search.php?search_keyword="+key;
    //window.location="/blocks/openscout/search.php#page=1&search_keyword="+encodeURIComponent('"'+key+'"');
}

// override search() in the .js file
function search()
{
	try{
		keyword = $('input[name=advanced_search_keyword]').val();
		
		window.keyword = keyword;
		window.page =1;

	  if(getUrlVars()['page'] != undefined){
		  window.page = getUrlVars()['page'];
	  }
    
		window.filters= new Array();
		ajaxSearch();
		return false;
	}
	catch(e)
	{
		alert(e);
	}
}

// This search for a single Id for the resource.php
function searchOne()
{
	try{
    
        keyword = $('input[name=advanced_search_keyword]').val();
		keyword = encodeURIComponent(keyword);
		window.keyword = '"'+keyword+'"';
		window.page =1;

	  if(getUrlVars()['page'] != undefined){
		  window.page = getUrlVars()['page'];
	  }
    
		window.filters= new Array();
		ajaxSearch();
		return false;
	}
	catch(e)
	{
		alert(e);
	}
}

// override ajaxSearch() in the .js file
function ajaxSearch(){

	if(keyword.length > 0){
		 var query = keyword + create_filter_query();
	}
	else{
		var query = 'lom.solr:all' + create_filter_query();
	}
	
	if(is_page_valid(page) == false){
		page = 1;
	}
	
	createUrlHash();
	//window.location.hash = "test";);
	
	$.ajax({
		url: '/blocks/openscout/proxy-search.php',
		type: 'POST',
		dataType: 'json',
		data: 'luceneString='+query+'&resultType=lom&page='+page,
		cache: false,
		success: ajaxSearchSuccess,
		error: ajaxSearchError,
		beforeSend: ajaxSearchBeforeSend
	});
}

// override ajaxSearchBeforeSend() in the .js file
function ajaxSearchBeforeSend(xhr){
	$('#results').html('<h2><img src="images/ajax-loader-bar.gif" alt="ajax loader" /></h2>');
}

// override ajaxGetPage() in the .js file
function ajaxGetPage(cpage){

	if(keyword.length > 0){
		 var query = keyword + create_filter_query();
	}
	else{
		var query = 'lom.solr:all' + create_filter_query();
	}
	page = cpage;
	$('#results').html('<h2 class="title"><img src="images/ajax-loader-bar.gif" alt="ajax loader" /></h2>');
	$.ajax({
		url: '/blocks/openscout/proxy-search.php',
		type: 'POST',
		dataType: 'json',
		data: 'luceneString='+query+'&resultType=lom&page='+page,
		cache: false,
		success: function(data, textStatus, xhr){
			createUrlHash();
			var results = createResults(data);
			$('#results').html(results);
			$('a[rel="external"]').attr('target','_blank');	
			
			$('#pright').button();
			$('#pright').click(function() {
				if($('#pright').attr('rel') == 'enabled'){
					ajaxGetPage(parseInt(current_page)+1);
				}
			});
			$('#pleft').button();
			$('#pleft').click(function() {
				if($('#pleft').attr('rel') == 'enabled'){
					ajaxGetPage(parseInt(current_page)-1);
				}
			});
		
			$('.ptip').poshytip({
				className: 'tip-darkgray',
				bgImageFrameSize: 11,
				offsetX: -25
			});
		},
		error: ajaxGetPageError,
		beforeSend: ajaxGetPageBeforeSend
	});
}


// override shorten() in the .js file
function shorten(x)
{
return(x);
}