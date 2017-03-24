$(document).ready(function() {
	//Initialize events
	$(".login-box form").submit(function() {
		$.ajax({  
            type : 'POST',  
            contentType : 'application/x-www-form-urlencoded',  
            //contentType : 'application/json',  
            url : '/login',
            data: encrypt_login_form($(this)),
            dataType : 'text',
            //同步
            async : false,  
            success : function(data) {  
				var data_obj = JSON.parse(data);
				if(data_obj.result === 0){
					$.cookie('uid', data_obj.uid);
					$.cookie('user_name', data_obj.name);
					window.location.href = 'game.html';
				}
				else{
					console.error(data);
				}
            },  
            error : function() {  
                console.error("error");
            }  
        });		

		return false;
	});
});
	
function encrypt_login_form(form) {
	var form_arr = form.serializeArray();
	form_arr.forEach(function(data) {
		if(data.name === "passwd") {
			data.value = $.md5(data.value);
			$.cookie('passwd', data.value);
		}
	});

	var ret_str = $.param(form_arr);
    //var ret_str = JSON.stringify(form_arr);
	return ret_str;
}

