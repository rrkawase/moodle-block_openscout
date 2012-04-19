function createInfoBar(data){
	var pagination = createPagination(data['numberOfPages']);
	if(keyword.length == 0){
		var html = '<b>Total results: '+data['totalResultCount']+pagination+'</b>';
	}
	else{
		var html = '<h2>'+data['totalResultCount']+' results found for : <span id="current_keyword">'+keyword+'</span> '+pagination+'</h2>';
	}
	return html;
}

function createPagination(total_pages){
	if(total_pages <= 1){ return '';}
	
	current_page = page;
	var selected = '';
	var html = '<div id="pagination" style="display:block; float:right; ">';
		
	if(current_page != 1){
		html += '<span rel="enabled" style="vertical-align:middle; margin-left:5px;" id="pleft" class="ui-icon ui-icon-carat-1-w ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button"><span class="ui-button-text"></span></span>';
	}
	else { 
		html += '<span rel="disabled" style="vertical-align:middle; margin-left:5px;" id="pleft" class="ui-icon ui-icon-carat-1-w ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button"><span class="ui-button-text"></span></span>';
	}

	html +=	'<select onchange="ajaxGetPage(this.options[this.selectedIndex].value); return false;" name="page">';
			
	for(var i=1; i<=total_pages; i++) {
		if(i == current_page){
			selected = 'SELECTED';
		}
		else { selected = ''; }
		
		html += '<option value="'+i+'" '+selected+'>'+i+'/'+total_pages+'</option>';	
	}	
	
	html += '</select>';
	if(total_pages != current_page){
		html += '<span rel="enabled" style="vertical-align:middle; margin-left:5px;" id="pright" class="ui-icon ui-icon-carat-1-e ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button"><span class="ui-button-text"><span class="ui-button-text"></span></span></span>';
	}
	else{
		html += '<span rel="disabled" style="vertical-align:middle; margin-left:5px;" id="pright" class="ui-icon ui-icon-carat-1-e ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button"><span class="ui-button-text"></span></span>';
	}
	
	html += '</div>';
	
	return html;
}

function ajaxSearchSuccess(data, textStatus, xhr) {
	//alert(data['status']);
	if(data['status'] == 1){	
		$('#results').html(createResultsError(data['error']));
	}
	else if(data['numberOfPages'] <= 0){
		//$('#results').html(createResultsError('0 results found <span id="current_keyword">'+keyword+'</span>'));
		$('#results').html(createResultsError('0 results found'));		
	}
	else {	
		var results = createResults(data);
		$('#results').html(results);
		$('a[rel="external"]').attr('target','_blank');	
		
        try{
		    $('.fancybox_default').fancybox({
			    'transitionIn'		:	'elastic',
			    //'transitionOut'	:	'elastic',
			    //'speedIn'		:	600, 
			    //'speedOut'		:	200, 
			    //'overlayShow'	:	false,
			    //'modal'		:	true
			    //'autoScale'		:	false,
			    'cyclic'		:	true,
			    'overlayColor'		:	'#aaaaaa',
			    'overlayOpacity'	:	'0.2',
			    'titlePosition'		:	'inside'

		    });
    		
		    $('.fancybox_iframe').fancybox({
			    'transitionIn'		:	'elastic',
			    'type'			:	'iframe',
			    'cyclic'		:	true,
			    'overlayColor'		:	'#aaaaaa',
			    'overlayOpacity'	:	'0.2',
			    'titlePosition'		:	'inside'

		    });		
		}
		catch(e)
		{;}
				
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
			className: 'tip-yellowsimple',
			showTimeout: 1,
			alignTo: 'target',
			alignX: 'center',
			offsetY: 5,
			allowTipHover: false

			//bgImageFrameSize: 11,
			//offsetX: -25,
			//showTimeout:100,
			//hideTimeout: 1
		});

	}
	//$('html, body').scrollTop(260);	

}


function ajaxSearchError(data, textStatus, xhr) {
	
}