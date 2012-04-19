// handler for hash change trigger facets and search 
var onHashChange = function(event) {
    //get hash function
	var getHashValue = function() {
		var arr = window.location.hash.split("#");
		var hasValue = arr[1];
		//sets default
		if (typeof hasValue == "undefined") {
			return false;
		}
		var hashLen = hasValue.indexOf("?");
		if(hashLen>0){
			hasValue = hasValue.substring(0,hashLen);
		}
		return hasValue;

	}
	//last hash
	var lastHash = getHashValue();
	//checker
	(function watchHash() {
		var hash = getHashValue();

		if (hash !== lastHash) {
			event();
			lastHash = hash;
		}
		var t = setTimeout(watchHash, 100);

	})();

} 

// check for null search 
function search_is_null(keyword, filters){

	if(keyword.length == 0 && filters.length == 0){return true;}
	return false;
}

// filter handling functions
function get_current_filters(){
	if(decodeURIComponent(getUrlVars()['filters']) != 'undefined'){
		return create_filters_array(decodeURIComponent(getUrlVars()['filters']));
	}
	else {
		var empty = new Array();
		return empty;
	}
}

function is_page_valid(tstring){
	var reg = new RegExp('^[1-9][0-9]*');
	return (reg.test(tstring));
}

function add_filter(lomfield, value, filters){
	var filter = new Array(lomfield,value);
	filters.push(filter);
	return filters;
}

function remove_filter(lomfield, value, filters){

    if(!filters)
        return filters;

	for(i = 0; i < filters.length; i++){
		if(filters[i][0] == lomfield && filters[i][1] == value){
			filters.splice(i, 1); 
		} 
	}
	return filters;
}

function remove_filters(lomfield, filters){

    if(!filters)
        return filters;
        
	for(i = 0; i < filters.length; i++){
		if(filters[i][0] == lomfield){
			filters.splice(i, 1); 
		} 
	}
	return filters;
}

function filter_is_active(lomfield, value, filters){

    if(!filters)
        return false;
        
	for(i = 0; i < filters.length; i++){
		if(filters[i][0] == lomfield && filters[i][1] == value){
			return true; 
		} 
	}
	return false;
}

function create_filter_query(filters){
	var filterstring = ''; 
	
    if(!filters)
        return filterstring;

	for(i = 0; i < filters.length; i++){
		if(filters[i][0] == 'lom.classification.taxonpath.taxon.competency.eqf'){
			filterstring += ' AND '+filters[i][0]+':'+filters[i][1];
		}
		else{
			filterstring += ' AND '+filters[i][0]+':'+'"'+filters[i][1]+'"';
		}
		
	}
	return filterstring;
}

function create_filters_hash(filters){
	var filtershash = '';
	if(filters != undefined){
		for(i = 0; i < filters.length; i++){
			filtershash += 'field/'+filters[i][0]+','+filters[i][1];
			//filtershash += filters.join(',');
			//alert(filtershash);
		}
	}
		
	return filtershash;
}

function create_filters_array(filtershash){
	var hashesarray = cleanArray(filtershash.split('field/'));
	var filtersarray = new Array();

    if(!hashesarray)
        return filtersarray;	
        
	if(hashesarray.length > 0){	
	//got at least one filter
		for(i = 0; i < hashesarray.length; i++){
			var filter = hashesarray[i].split(',');
			filtersarray.push(filter);
		}
	
	}
	return filtersarray;	
}

function cleanArray(actual){
  var newArray = new Array();
  
    if(!actual)
        return newArray;	
          
  for(var i = 0; i<actual.length; i++){
      if (actual[i]){
        newArray.push(actual[i]);
    }
  }
  return newArray;
}

// hash creator 
function createUrlHash(page, keyword, filters){

	window.location.hash = '#page='+page+'&search_keyword='+encodeURIComponent(keyword)+'&filters='+encodeURIComponent(create_filters_hash(filters));

}

// ajax search
function ajaxSearch(page, keyword, filters, type, cbSuccessFunction){

	keyword = $.trim(keyword);
	var lucene_keyword = 'lom.solr:all';
	if(keyword.length != 0){
		lucene_keyword = '('+keyword+')';
	}
	var query = lucene_keyword+create_filter_query(filters);
	
	if(query == last_query && type == 'solr'){
		return; 
	}
	last_query = query;
	
	if(type == 'lom'){
		$('#ajax_loader').html('<img src="images/ajax-loader-circle.gif" alt="ajax loader" height="16" width="16">'); 
	}
	$.ajax({
		url: 'harvesterServices/search.php',
		type: 'POST',
		dataType: 'json',
		data: 'luceneString='+query+'&resultType='+type+'&page='+page,
		cache: false,
		success: function(data, textStatus, xhr){cbSuccessFunction(data, textStatus, xhr, keyword, filters, page);},
		error: function(xhr, textStatus, errorThrown){
			var xhr_object = '';
			for (property in xhr) {
			  xhr_object += '<br />'+'<span style="color:blue;">'+property+'</span>: '+xhr_object[property]+';';
			}
			
			var dmessage = '<strong>xhr: </strong>'+xhr_object+'<br /><strong>textStatus: </strong>'+textStatus+'<br /><strong>errorThrown:</strong>'+errorThrown;
			createModalMessageDialog('Server error',dmessage);		
		},
		beforeSend: function(xhr, settings){},
		complete: function(xhr, textStatus){$('#ajax_loader').empty();}
	});
	
}
	
// SEARCH RESULT CREATION ***********************************
function createSearchResults(data, textStatus, xhr, keyword, filters, page) {

	if(data['status'] == 1){	
		$('#results').html(data['error']);
	}
	else {	
		page = parseInt(page);
		var results = createResultsHTML(data, keyword, filters, page);
		$('#results').html(results);
		
		//onchange="ajaxGetPage(this.options[this.selectedIndex].value); return false;"
		
		$('#page_select').change(function () {
			createUrlHash($(this).attr('value'), keyword, filters);
		});
		
		$('a[rel="external"]').attr('target','_blank');	
                //$('select[name="page"]').selectmenu();

		$('.fancybox_default').fancybox({
			'transitionIn'		:	'elastic',
			//'transitionOut'	:	'elastic',
			//'speedIn'		:	600, 
			//'speedOut'		:	200, 
			//'overlayShow'	:	false,
			//'modal'		:	true
			//'autoScale'		:	false,
			'cyclic'		:	true,
			'overlayColor'		:	'#000',
			'overlayOpacity'	:	'0.8',
			'titlePosition'		:	'over',
			'titleFormat'		:	formatTitle

		});
		
		$('.fancybox_iframe').fancybox({
			'transitionIn'		:	'elastic',
			'type'			:	'iframe',
			'cyclic'		:	true,
			'overlayColor'		:	'#000',
			'overlayOpacity'	:	'0.8',
			'titlePosition'		:	'over',
			'titleFormat'		:	formatTitle

		});		
				
		createTips();
		var query = keyword+create_filter_query(filters);
		ajaxStoreCAM('action=storeFilteredSearchEvent&luceneString='+query);
		
		$('.disabled').button({disabled:true});	
			
		$('#previous_page').button().click(function () {createUrlHash(page - 1, keyword, filters);});
		$('#first_page').button().click(function () {createUrlHash(1, keyword, filters);});

		$('.page_button').button().click(function () {createUrlHash($(this).text(), keyword, filters);});
				
		$('#last_page').button().click(function () {createUrlHash(data['numberOfPages'], keyword, filters);});
		$('#next_page').button().click(function () {createUrlHash(page + 1, keyword, filters);});
		
		$('#fprevious_page').button().click(function() {$('#previous_page').click();});
		$('#fnext_page').button().click(function() {$('#next_page').click();});
								
	}
	//$('html, body').scrollTop(260);	
}

function formatTitle(title, currentArray, currentIndex, currentOpts) {

    var title_end = title.indexOf('::', 0);
    var stitle = title.substring(0, title_end);
    var sdescription = title.substring(title_end+2);
    
    return '<div style="padding:5px; background-color:#174189; zoom: 1; filter: alpha(opacity=90); opacity: 0.9;"><strong>'+stitle+'</strong><br />'+sdescription+'</div>';
    //return '<div id="tip7-title"><span><a href="javascript:;" onclick="$.fancybox.close();"><img src="/data/closelabel.gif" /></a></span>' + (title && title.length ? '<b>' + title + '</b>' : '' ) + 'Image ' + (currentIndex + 1) + ' of ' + currentArray.length + '</div>';
}

function highlight(str, keyword){

	//var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g"); // .*+?|()[]{}\
	//ckeyword =  keyword.replace(specials, '');
	var ckeyword = keyword.replace(/[^a-zA-Z 0-9]+/g,'');
	var matches = str.match(RegExp(ckeyword, "gi"));
	if(matches){

		var umatches = eliminateDuplicates(matches);
		var nstr = '';
		
        if(!umatches)
            return str;	
        		
		for(var i=0; i<umatches.length; ++i){
			
			nstr = str.replace(umatches[i], '<span style="font-weight:bold; color:blue; font-size:100%;">'+umatches[i]+'</span>');

		}
		return nstr;
	}	
	return str;	
}

function eliminateDuplicates(arr) {
	var i,len=arr.length,out=[],obj={};

	for (i=0;i<len;i++) {
	        obj[arr[i]]=0;
	}
	for (i in obj) {
		out.push(i);
	}
	return out;
}

function createResultsHTML(data, keyword, filters, page){

	var html = createInfoBar(data, keyword, filters, page);
	if(data['numberOfPages'] < page){ return html;}	
	var results = data['lomResponse'];
	var footer = createFooterPagination(parseInt(data['numberOfPages']), page);

	for(var i=0; i<results.length; i++) {	
		//alert(encodeURIComponent(results[i]['uid']));
		var title = shorten(escapeHTMLentities(results[i]['title']), 50);
		var description = shorten(escapeHTMLentities(results[i]['description']), 210);
		
		var caption_title = escapeHTMLentities(results[i]['title']);		
		var caption = caption_title+'::'+shorten(escapeHTMLentities(results[i]['description']), 250);
		
		var resource_image = results[i]['image'];
		var resource_location = results[i]['location'];
		
		if(resourceHasThumbnail(results[i]['image'])){
			var thumbnail = '<a rel="group1" href="'+resource_image+'" class="fancybox_default" title="'+caption+'"><img class="img_border" src="'+results[i]['image']+'" alt="'+translate('resource screenshot')+'" width="120" height="82" /></a>';				
		}
		else if(resourceIsVideo(results[i]['image'])){
			if (navigator.appVersion.indexOf("Win")!=-1){
				// NOT WORKING IFRAME FOR WIN NEEDS FIXING OR REMOVAL
				//var thumbnail = '<a rel="group1" href="utils/mediaplayer.php?url='+resource_location+'" class="fancybox_iframe" title="'+caption+'"><img class="img_border" src="'+results[i]['image']+'" alt="resource screenshot" width="120" height="82" /></a>';
				//DEFAULT
				var thumbnail = '<img class="img_border" src="'+resource_image+'" title="'+caption+'" alt="'+translate('resource screenshot')+'" width="120" height="82" />';
				

			}
			else{
				var thumbnail = '<a rel="group1" href="'+resource_location+'" class="fancybox_iframe" title="'+caption+'"><img class="img_border" src="'+results[i]['image']+'" alt="'+translate('resource screenshot')+'" width="120" height="82" /></a>';
			}
		}
		else{
			var thumbnail = '<img class="img_border" src="'+resource_image+'" title="'+caption+'" alt="'+translate('resource screenshot')+'" width="120" height="82" />';
		}
		
		var lang_icon = getLangIcon(results[i]['language']);
		if(lang_icon != false){
			
			var langname = getFullLangName(results[i]['language']);
			lang_icon = '<img class="lang_icon" width="16" height="11" src="images/flags/png/'+lang_icon+'" title="'+translate('language of this resource is')+' '+langname+'">';

		}
		
		html += '\
				<div class="bg"></div>\
				<div id="result">\
					'+thumbnail+'\
					<p>'+lang_icon+'\
						<span style="font-weight:bold; color:#000; font-size:14px;">'+highlight(title, keyword)+'</span><br />\
						'+highlight(description, keyword)+'\
						<br />\
					</p>\
					<div class="clr"></div>\
					<ul>\
						<li style="background-image:url(\'images/metadata.png\');"><a class="ptip" href="resource.html?loid='+encodeURIComponent(results[i]['uid'])+'" title="'+translate('view OpenScout metadata for')+' : &lt;span style=&quot;color:#9dc21b;&quot; &gt;'+results[i]['title']+'&lt;/span&gt;">'+translate('find out more')+'</a></li>\
					</ul>\
					<ul>\
						<li style="background-image:url(\'images/gnome-session.png\');"><a class="ptip" href="'+results[i]['location']+'" title="'+translate('open')+' &lt;span style=&quot;color:#9dc21b;&quot; &gt;'+results[i]['title']+'&lt;/span&gt; '+translate('in a new browser tab')+'" rel="external">'+translate('view now')+'</a></li>\
					</ul>\
				</div>\
				<div class="clr"></div>';
	}
	html += '<div class="bg"></div>';
	html += footer;	
	return html;

}

function createInfoBar(data, keyword, filters, page){
	keyword = escapeHTMLentities(keyword);
	var pagination = createPagination(data['numberOfPages'], data['totalResultCount'], page);
	var s = 'results';
	if(data['totalResultCount'] == 1){
		s = 'result';
	}
	var plus = ' + ';
	if(keyword.length == 0){
		plus = '';
	}	
	
	if(filters)
	{
	    if(filters.length > 0){
		    var filterstring = '';
		    for(var i=0; i < filters.length; i++) {
			    if(filters[i][0] == 'lom.classification.taxonpath.taxon.id.competence_category'){	
				    filterstring += '<span style="color:#97be1a;">'+getDomainByID(filters[i][1])+'</span>';
			    }
			    else if(filters[i][0] == 'lom.classification.taxonpath.taxon.id.competency'){
				    filterstring += '<span style="color:#97be1a;">'+getCompetenceByID(filters[i][1])+'</span>';
			    }
			    else if(filters[i][0] == 'lom.classification.taxonpath.taxon.competency.eqf'){
				    filterstring += createCompetenceSearchFilterString(filters[i][1]);	
			    }
			    else{
				    filterstring += '<span style="color:#97be1a;">'+filters[i][1]+'</span>';
			    }
			    if (i+1 < filters.length){
				    filterstring += ' + ';
			    }
    		
		    }
		    if(data['totalResultCount'] == 0){
			    var html = '<h2 style="padding-bottom:5px;">'+translate('Nothing found for')+' : <span id="current_keyword">'+keyword+'</span>'+plus+filterstring+'</h2>'+pagination;
		    }
		    else{
			    var html = '<h2 style="padding-bottom:5px;">'+data['totalResultCount']+' '+translate(s)+' '+translate('found for')+' : <span id="current_keyword">'+keyword+'</span>'+plus+filterstring+'</h2>'+pagination;
		    }
	    }
	    else{
    	
		    if(data['totalResultCount'] == 0){
			    var html = '<h2 style="padding-bottom:5px;">'+translate('Nothing found for')+' : <span id="current_keyword">'+keyword+'</span></h2>'+pagination;
		    }
		    else{
			    var html = '<h2 style="padding-bottom:5px;">'+data['totalResultCount']+' '+translate(s)+' '+translate('found for')+' : <span id="current_keyword">'+keyword+'</span></h2>'+pagination;
		    }
    	
	    }
	}
	return html;
}

function createFooterPagination(total_pages, current_page){

	if(total_pages <= 1){ return '';}	
	var pagination_html = '<ul class="pagination_list" aria-labelledby="paginglabel" role="navigation">';
	if(current_page - 1 > 0){
		pagination_html += '<li style="float:left;"><button id="fprevious_page">'+translate('Prev')+'</button></li>';
	}
	else{
		pagination_html += '<li style="float:left;"><button class="disabled">'+translate('Prev')+'</button></li>';	
	}
	
	if(current_page + 1 > total_pages){
		pagination_html += '<li style="float:right;"><button class="disabled">'+translate('Next')+'</button></li>';
	}
	else{
		pagination_html += '<li style="float:right;"><button id="fnext_page">'+translate('Next')+'</button></li>';
	}	
	
	pagination_html += '</ul>'
	return pagination_html;	
}

function createPagination(total_pages, total_results, current_page){

	if(total_pages <= 1){ return '';}
	total_pages = parseInt(total_pages);
	total_results = parseInt(total_results);
	current_page = parseInt(current_page);

	var pages = new Array();
	for(var i = current_page - 2; i <= current_page + 2; i++){
		if(i < 1) continue;
		if(i > total_pages) break;
		pages.push(i);
	}
	
	//alert(pages);
	var pagination_html = '<ul class="pagination_list" aria-labelledby="paginglabel" role="navigation">';
	
	if(current_page - 1 > 0){
		pagination_html += '<li style="float:left;"><button id="previous_page">'+translate('Prev')+'</button></li>';
	}
	else{
		pagination_html += '<li style="float:left;"><button class="disabled">'+translate('Prev')+'</button></li>';	
	}
	
	pagination_html +='<li>';
	
	if(current_page == 1){
	
		pagination_html += '<button style="margin-right:10px;" class="disabled">1</button>';
	}
	else{
		pagination_html += '<button style="margin-right:10px;" id="first_page">1</button>';
	}
	
	for(var i = 0; i < pages.length; i++){
	
		if(pages[i] != 1  && pages[i] != total_pages && pages[i] != current_page){
			pagination_html += '<button class="page_button">'+pages[i]+'</button>';
		}
		if(pages[i] == current_page && pages[i] != 1  && pages[i] != total_pages){
			pagination_html += '<button class="disabled">'+pages[i]+'</button>';
		}		
	
	}
	
	if(current_page == total_pages){
	
		pagination_html += '<button style="margin-left:10px;" class="disabled">'+total_pages+'</button>';
	}
	else{
		pagination_html += '<button style="margin-left:10px;" id="last_page">'+total_pages+'</button>';
	}	
	
	pagination_html +='</li>';
	
	//ie7 hack for pagination
	var next_page_class = 'next_page'; if($.browser.msie && $.browser.version == 7){ next_page_class = 'next_page_ie' };
	
	if(current_page + 1 > total_pages){
		pagination_html += '<li class="'+next_page_class+'"><button class="disabled">'+translate('Next')+'</button></li>';
	}
	else{
		pagination_html += '<li class="'+next_page_class+'"><button id="next_page">'+translate('Next')+'</button></li>';
	}	
	
	pagination_html += '</ul>'
	
	return pagination_html;

}