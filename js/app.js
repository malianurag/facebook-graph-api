/* This will access all dom elements after loading*/
$(document).ready(function() {
	
	var facebookToken; // variable to store facebook access token
	
	//hides all the other sections
	$(".about-section").hide();
	$(".profile-section").hide();
	$(".feeds-section").hide();
	
	/*handles onclick event for submit button*/
	$("#submitBtn").click(function() {
		facebookToken = $(".input-custom").val();
		if(facebookToken == ""){
			$(".input-custom").attr("placeholder","Enter valid token");							// gets the token entered by user
			alert("Token input can not be empty. please try again !!");
		}
		else {
			$.ajax("https://graph.facebook.com/me?fields=name&access_token="+facebookToken , {	//ajax request to facebook graph api
				type : 'POST',
				success : function(response) {													// handles success
					console.log(response);
					$(".main-header").hide();
					var name = response.name;
					var orginalText = $(".welcome-title").text();
					$(".welcome-title").text(orginalText+" "+name);
					$(".about-section").show();
				},
				error : function(request, errorType, errorMessage) {							// handles invalid token
					console.log(request);
					console.log(errorType);
					alert("Token not valid. please try again !!");
					$(".input-custom").val("");
				}
			});			
		}
	});

	//handles navigation to profile info
	$("#profileBtn").click(function(){

		//hides about section and shows profile section
		$(".about-section").hide();
		$(".profile-section").show();

		// ajax request to facebook graph api
		$.ajax("https://graph.facebook.com/me?fields=id,name,email,birthday,age_range,education,location,cover,picture&access_token="+facebookToken , {
			type: 'POST' ,
			success : function(response) {																// handles success 
				$(".name-header").text(response.name);
				$(".img-profile").attr("src",response.picture.data.url);
				$(".img-container").css("background-image","url('"+response.cover.source+"')");
				$(".email-span").text(response.email);
				$(".birthday-span").text(response.birthday);
				$(".age-span").text(response.age_range.min + "+");
				$(".location-span").text(response.location.name);

				var educationDetails = response.education;

				if(educationDetails == null){
					$("#eduDetails").hide();
					$("#eduHead").hide();
				}
				else {
					var length = educationDetails.length;
					if(length < 5){
						for(var i=length+1;i<=5;i++){
							$("#r"+i).hide();
						}
					}
					for (var i = 0; i < educationDetails.length; i++) {
						var instituteName = educationDetails[i].school.name;
						$("#r"+(i+1)).find(".institute-span").text(instituteName);
					
						var instituteType = educationDetails[i].type;
						$("#r"+(i+1)).find(".type-span").text(instituteType);
					}
				}
			},

			error : function(request, errorType, errorMessage) {							// handles error
					console.log(request);
					console.log(errorType);
					alert("Access token has become invalid. Please try again !!");
					$(".about-section").hide();
					$(".profile-section").hide();
					$(".feeds-section").hide();
					$(".input-custom").val("");												// show start page
					$(".main-header").show();
			}
		});	
	});

	$("#feedBtn").click(function(){

		//hides about section and shows feeds section
		$(".about-section").hide();
		$(".feeds-section").show();

		//ajax request facebook api
		$.ajax("https://graph.facebook.com/me?fields=feed.limit(5){message,from,created_time},name,picture&access_token="+facebookToken,{
			type: 'POST' ,
			success : function(response) {													// handles success
				$(".name-header").text(response.name);
				$(".img-profile").attr("src",response.picture.data.url);
				var feeds = response.feed.data;
				for (var i = 0; i < feeds.length; i++) {									//iterate through latest 5 feeds json array
						var fromName = feeds[i].from.name;
						$("#f"+(i+1)).find(".from-span").text(fromName);
					
						var message = feeds[i].message;
						$("#f"+(i+1)).find(".message-span").text(message);

						var dateCreated = feeds[i].created_time;
						$("#f"+(i+1)).find(".date-span").text(dateCreated);
				}			
			},

			error : function(request, errorType, errorMessage) {							// handles error
					console.log(request);
					console.log(errorType);
					alert("Access token has become invalid. Please try again !!");
					$(".about-section").hide();
					$(".profile-section").hide();
					$(".feeds-section").hide();
					$(".input-custom").val("");												// show start page
					$(".main-header").show();
			}		
		});
	});

	// handles logout. Shows start page and hides all other pages

	$(".logout-btn").click(function() {
		facebookToken = "";
		$(".about-section").hide();
		$(".profile-section").hide();
		$(".feeds-section").hide();
		$(".input-custom").val("");
		$(".main-header").show();
	});

	// handles back action. Shows about page and hides all other pages
	$(".back-btn").click(function() {
		$(".profile-section").hide();
		$(".feeds-section").hide();
		$(".about-section").show();
	});
}); 