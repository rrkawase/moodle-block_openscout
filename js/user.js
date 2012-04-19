function login(){

	$('body').append(login_form());
	
	
	$('#send_password').button();
	$('#send_password').click(function() {
		var email = $('#login_form input[name=email]').val();
		bValid = validate_login_data(email);
		if(bValid){

			$.ajax({
				url: 'proxy-user.php?function=resetpassword',
				type: 'POST',
				dataType: 'json',
				data: 'email='+email,
				cache: false,
				success: function(data){
					if(data['response'] == true){
						updateTips('User details sent, please check you email.');
					}
					else{ 
						updateTips(data['error']);
					}
			
				},
				error: function(){
					updateTips('Error: Could not contact sign-in services!');
			
				}
			});
		}
		return false;
	});
	
	
	
 
	$('#login_form').dialog({
		autoOpen: false,
		height: 360,
		width: 440,
		modal: true,
		buttons: {
			'Login': function() {
				$('.validateTips').html('<img style="border:0;" src="images/ajax-loader-small.gif" alt="ajax loader" />');
				var username = $('#login_form input[name=username]').val();
				var password = $('#login_form input[name=password]').val();
				$.ajax({
					url: 'proxy-user.php?function=login',
					type: 'POST',
					dataType: 'json',
					data: 'username='+username+'&password='+password,
					cache: false,
					success: function(data){
						if(data['response'] == true){
							$(this).dialog('close');
							$('#login_form').remove();
							window.user_id = data['userId'];
							parent.$('#header_buttons').html(createLogoutButtons(data['userName']));
							ajaxGetAvatar();
						}
						else{ 
							updateTips('Wrong username and/or password, please try again.');
							
						}
					
					},
					error: function(){
						updateTips('Error: Could not contact sign-in services!');
					
					}
				});

			},
			Cancel: function() {
				$( this ).dialog('close');
				$('#login_form').empty().remove();
			}
		},
		close: function() {
			$('#login_form').empty().remove();
		}
	});	


	$('#login_form').live('keyup', function(e){
		if (e.keyCode == 13) {
			$(':button:contains("Login")').click();
		}
	});
	
	$('#register_form').remove();
	$('#login_form').dialog('open');
	

}


function validate_login_data(email){

	var username = $('#login_form input[name=username]'),
	password = $('#login_form input[name=password]'),
	email = $('#login_form input[name=email]'),
	allFields = $( [] ).add( username ).add( password ).add( email );
	var bValid = true;
	allFields.removeClass('ui-state-error');
			
	bValid = bValid && checkLength( email, 'email', 6, 80 );
	// From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
	bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "not a valid email address, e.g. johndoe@openscout.net" );
	
	return bValid; 

}

function login_form(){

	var html = '\
		<div class="dforms" id="login_form" title="Sign-in to openscout">\
			<p class="validateTips">Please enter you username and password.</p>\
			<form>\
				<fieldset>\
					<label for="name">Username</label>\
					<input type="text" name="username" class="text ui-widget-content ui-corner-all" />\
					<label for="password">Password</label>\
					<input type="password" name="password" value="" class="text ui-widget-content ui-corner-all" />\
				</fieldset>\
			</form>\
			<form>\
				<fieldset>\
					<label for="email">Forgot password? enter your email below and press reset</label>\
					<input type="text" name="email" style="display:inline; width:80%;" class="text ui-widget-content ui-corner-all" />\
					<input style="display:inline;" type="submit" id="send_password" name="send password" value="Reset">\
				</fieldset>\
			</form>\
		</div>';

	return html;
}


function createLogoutButtons(username){
	var html = '\
		  <div class="header_click" style="text-align:right;  padding:3px">\
			<div id="user_module">\
				<ul style="list-style-type:none; margin:0; padding:0;">\
				    <li style="list-style-type:none;padding-top:5px;"><strong style="color:white;">'+shorten(username,9)+'</strong></li>\
				    <li style="list-style-type:none;"><a href="#" title="click here to sign out" onClick="doLogout(); return false;">logout</a></li>\
				</ul>\
			</div>\
		  </div>';
		  
	return html;
}

function createLoginButtons(){

	var html = '\
			<div style="padding:0px;margin-top:0px;">\
				<ul style="" id="loginul">\
					<li><a href="#" onClick="doLogin(); return false;" title="sign-in to openscout"><img src="/blocks/openscout/images/start-here.png" style="width:24px;height:24px;"alt="picture" width="24" height="24" /><span>login</span></a></li>\
					<li><a href="#" onClick="doRegister(); return false;" title="registration"><img src="/blocks/openscout/images/config-users.png" style="width:24px;height:24px;" alt="picture" width="24" height="24" /><span>register</span></a></li>\
				</ul>\
			</div>';	
	return html;
}



//################<avatar>###################################################

function ajaxGetAvatar(){
	$.ajax({
		url: 'proxy-toollibrary-user.php?function=avatar',
		type: 'POST',
		dataType: 'json',
		cache: true,
		success: ajaxGetAvatarSuccess,
		error: ajaxGetAvatarError,
		beforeSend: ajaxGetAvatarBeforeSend
	});
}

function ajaxGetAvatarSuccess(data, d, x){
	if(data['status'] == 0){
		//$('#my_avatar').attr('src',''+data['result']+'');	
		parent.$('#user_module').prepend('<img style="float:right;" class="img_border" id="my_avatar" src="'+data['result']+'" alt="my avatar" width="24" height="24" />');
	}
	else {
		parent.$('#user_module').prepend('<img style="float:right;" class="img_border" id="my_avatar" src="/blocks/openscout/images/avatar-default.png" alt="my avatar" width="24" height="24" />');
	}
	return false;
}
function ajaxGetAvatarError(){
return 0;
}
function ajaxGetAvatarBeforeSend(){
return 0 ;
}

//################register###################################################

function register(username, firstname, lastname, email){
	$('body').append(register_form(username, firstname, lastname, email));
	var name = $('#name'),
		email = $('#email'),
		firstname = $('#firstname'),
		lastname = $('#lastname'),		
		password = $('#password'),
		rpassword = $('#rpassword'),
		allFields = $( [] ).add( name ).add( firstname ).add( lastname ).add( email ).add( password );

	$('#register_form').dialog({
		autoOpen: false,
		height: 530,
		width: 400,
		modal: true,
		buttons: {
			'Create account': function() {
				var bValid = true;
				allFields.removeClass('ui-state-error');

				bValid = bValid && checkLength( name, 'username', 3, 16 );
				bValid = bValid && checkLength( firstname, 'First Name', 3, 20 );
				bValid = bValid && checkLength( lastname, 'Last Name', 3, 20 );				
				bValid = bValid && checkLength( email, 'email', 6, 80 );
				bValid = bValid && checkLength( password, 'password', 5, 16 );

				bValid = bValid && checkRegexp( name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );

				bValid = bValid && checkRegexp( firstname, /^[a-z]([0-9a-z_-]|\s)+$/i, "First Name may consist of a-z, 0-9, underscores, spaces, hyphens, begin with a letter." );
				bValid = bValid && checkRegexp( lastname, /^[a-z]([0-9a-z_-]|\s)+$/i, "Last Name may consist of a-z, 0-9, underscores, spaces, hyphens, begin with a letter." );


				// From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
				bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "not a valid email address, e.g. johndoe@openscout.net" );
				bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, 'Password field only allow : a-z 0-9');
				bValid = bValid && comparePass( rpassword, 'Passwords do not match');

				if ( bValid ) {
					$('.validateTips').html('<img style="border:0;" src="images/ajax-loader-small.gif" alt="ajax loader" />');
					$.ajax({
					    url: 'proxy-user.php?function=createUser',
						type: 'POST',
						dataType: 'json',
						data: 'username='+name.val()+'&firstname='+firstname.val()+'&lastname='+lastname.val()+'&password='+password.val()+'&email='+email.val(),
						cache: false,
						success: function(data){
							if(data['response'] == true){
								$(this).dialog('close');
								$('#register_form').remove();
								window.user_id = data['userId'];
								
								document.location.reload(true);
								// var login_module = createLogoutModule(data['userName']);	
								// $('#login_module').html(login_module);	
								
							}
							else{
								updateTips(data['error']);
							}
						},
						error: function(){
						
							updateTips('Register service appears to be down.');
						}
					});
				}
			},
			Cancel: function() {
				$( this ).dialog('close');
				$('#register_form').empty().remove();
			}
		},
		close: function() {
			allFields.val('').removeClass('ui-state-error');
			$('#register_form').empty().remove();
		}
	});	

	$('#register_form').live('keyup', function(e){
		if (e.keyCode == 13) {
			$(':button:contains("Create account")').click();
		}
	});

	$('#login_form').remove();
	$('#register_form').dialog('open');
	
}


function register_form(username, firstname, lastname, email){

	var html = '\
		<div class="dforms" id="register_form" title="Create new account">\
			<p class="validateTips">All form fields are required.</p>\
			<form>\
			<fieldset>\
				<label for="name">Username</label>\
				<input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" value="'+username+'" />\
				<label for="name">First Name</label>\
				<input type="text" name="firstname" id="firstname" class="text ui-widget-content ui-corner-all" value="'+username+'" />\
				<label for="name">Last Name</label>\
				<input type="text" name="lastname" id="lastname" class="text ui-widget-content ui-corner-all" value="'+lastname+'" />\
				<label for="email">Email</label>\
				<input type="text" name="email" id="email" class="text ui-widget-content ui-corner-all" value="'+email+'" />\
				<label for="password">Password</label>\
				<input type="password" name="password" id="password" value="" class="text ui-widget-content ui-corner-all" />\
				<label for="password">Repeat Password</label>\
				<input type="password" name="rpassword" id="rpassword" value="" class="text ui-widget-content ui-corner-all" />\
			</fieldset>\
			</form>\
		</div>';

	return html;
}

//###################################################################

function ajaxHasLoggedIn(){
	$.ajax({
		async: true,
		url: 'proxy-user.php?function=hasloggedin',		
		type: 'POST',
		dataType: 'json',
		cache: false,
		success: function(data){ if(data['userHasLoggedIn'] == 1){return 1;}return 0;},
		error: function(){return 0;},
		beforeSend: function(){return 0;}
	});
}

//################<LOGOUT>###################################################

function logout(){
	$.ajax({
		url: 'proxy-user.php?function=logout',
		type: 'POST',
		dataType: 'json',
		cache: false,
		success: ajaxLogoutSuccess,
		error: ajaxLogoutError,
		beforeSend: ajaxLogoutBeforeSend
	});
}

function ajaxLogoutSuccess(data, d, x){
	
	if(data['response'] == true){	
		parent.window.location.reload(true);		
	}
	else {
		createModalMessageDialog("Error",data['error']);
	}
	return false;
}
function ajaxLogoutError(e){
return 0;
}
function ajaxLogoutBeforeSend(){
return 0 ;
}

//################<On Page Load>###################################################

function ajaxOnPageLoad(){
	$.ajax({
		url: 'proxy-user.php?function=onportalload',
		type: 'POST',
		dataType: 'json',
		cache: false,
		success: ajaxOnPageLoadSuccess,
		error: ajaxOnPageLoadError,
		beforeSend: ajaxOnPageLoadBeforeSend
	});
}

function ajaxOnPageLoadSuccess(data, d, x){
    
	if(data['userHasLoggedIn'] == 0){
		parent.$('#header_buttons').html(createLoginButtons());
	}
	else {
		window.user_id = data['userID'];
	
		parent.$('#header_buttons').html(createLogoutButtons(data['userName']));
		ajaxGetAvatar();

		try{parent.window.user_id = window.user_id;}
		catch(e){}
	}
	
	return 0;
}
function ajaxOnPageLoadError(){
	$('#login_module').html('Service error!');
	return 0;
}
function ajaxOnPageLoadBeforeSend(){
return 0 ;
}

