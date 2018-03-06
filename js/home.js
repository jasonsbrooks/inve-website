// var Papa = require("../papaparse";


jQuery(document).ready(function($){
	$(".sailbot").hide();
	$(".tiltrotor").hide();
	$(".arrow_up").hide();
	var arrowClicked = false;
	var navbarShown = true;

	/* CODE SO THAT SITE (nearly) AUTOMATICALLY UPDATES TEAMS */
	updateTeams();

	/* CODE FOR NAVBAR CONFIGURATION */
	navbarShown = getNavbarPosition(arrowClicked, navbarShown);

	$("#head").height($(window).height() - $("#about").height() - 45);
	var $timeline_block = $('.cd-timeline-block');

	//hide timeline blocks which are outside the viewport
	// $timeline_block.each(function(){
	// 	if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
	// 		$(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
	// 	}
	// });
	$(".cd-timeline-img").hide();

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		// console.log('scrolling');
		// if ( $(".tiltrotor").is(":visible") ) {
			$timeline_block.each(function(){
				if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.5 && $(this).find('.cd-timeline-img').hasClass('is-hidden') /* && $(this).find('.cd-timeline-img').hasClass('tiltrotor')*/ ) {
					console.log('showing timeline');
					$(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
				}
			});
		// } else if ( $(".sailbot").is(":visible") ) {
			$timeline_block.each(function(){
				if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.5 && $(this).find('.cd-timeline-img').hasClass('is-hidden') /* && $(this).find('.cd-timeline-img').hasClass('sailbot')*/ ) {
					console.log('showing timeline');
					$(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
				}
			});
		// }

		navbarShown = getNavbarPosition(arrowClicked, navbarShown);
	});

	$(window).on("resize",function() {
		var bodyheight = $(window).height() - $("#about").height() - 45;
		$("#head").height(bodyheight);
		navbarShown = getNavbarPosition(arrowClicked, navbarShown)
	});


	// top page arrow down
	$("#arrow-down").click(function() {
		var coord = $("#projects").offset().top - $("#about").offset().top - 5;

    $('html, body').animate({
				scrollTop: coord
    }, 1000);

		if ($("#about").is(':visible')) {
			$("#show-arrow").hide();
		}
	});

	// about page arrow down
	$("#arrow-down2").click(function() {
		arrowClicked = true;

		if ($("#about").is(':visible')) {
			// $("#arrow-down2").hide();
			var newHeight = $(window).height() - $("#about").height();
			$("#head").animate({
				height: newHeight
			})

			$("#navbar").show();


			// var coord = $("#projects").offset().top - $("about").height();
			$('html, body').animate({
				scrollTop: $(window).height()
			}, 1000);
		}
	});



	// projects arrows
	$("#sailbot-choice").click(function() {
		$(".tiltrotor").hide();
		$(".sailbot").slideDown(400);
		$('html, body').animate({
      scrollTop: $("#sailbot").offset().top
    }, 600);
	});

	$("#tiltrotor-choice").click(function() {
		$(".sailbot").hide();
		$(".tiltrotor").slideDown(400);
		$('html, body').animate({
      scrollTop: $("#tiltrotor").offset().top
    }, 600);
	});

	$(".collapse-sailbot").click(function() {
		$(".sailbot").slideUp(800);
		$('html, body').animate({
      scrollTop: $("#projects").offset().top
    }, 600);
	});

	$(".collapse-tiltrotor").click(function() {
		$(".tiltrotor").slideUp(800);

		$('html, body').animate({
      scrollTop: $("#projects").offset().top
    }, 600);
	});

	$("#arrow-left").click(function() {
		var coord = $("#projects").offset().left - $(window).width();
    $('html, body').animate({
      scrollLeft: coord
    }, 1000);
	});

	$("#arrow-right").click(function() {
		var coord = $("#projects").offset().left + $(window).width();
		$('html, body').animate({
			scrollLeft: coord
		}, 1000);
	});
});

function getNavbarPosition (arrowClicked, navbarShown) {
	// point at which top navbar should show
	var threshold1 = $("#projects").offset().top - 45;
	// point at which navbar is hidden
	var threshold2 = $(window).height() - $("#about").height() - $(".photo").height() - 45;
	// point after scrolling down then up when navbar show again
	var threshold3 = $(window).height() - threshold2 - 350;

	var topPos = $(window).scrollTop();

	if (topPos > threshold1) {
		$("#navbar").addClass("navbar-top");
		$("#navbar").removeClass("photo-container");

		$("#navbar").show({duration: 100}, 'slideDown');
		// $("#navbar").show();

		navbarShown = true;

	} else if (topPos > threshold2) {
		if ($("#navbar").is(":visible")) {
			$("#navbar").hide({duration: 100}, "slideUp")
			// $("#navbar").hide();
		}
		if ($('.arrow-down').is(":visible")) {
			$(".show-arrow").hide();
		}

		navbarShown = false;

	} else if (topPos < threshold3) {
		if (!arrowClicked) {
			$(document).scrollTop(0);
		}
		if (topPos < threshold3) {
			if ($("#navbar").is(":hidden") && !navbarShown) {
				$("#navbar").show({duration: 100}, "slideDown");
				// $("#navbar").show()
				navbarShown = true;
			}
		}

		$("#navbar").removeClass("navbar-top");
		$("#navbar").addClass("photo-container");
		$(".show-arrow").show();

	}

	return navbarShown;

}

/* CODE SO THAT SITE (nearly) AUTOMATICALLY UPDATES TEAMS */
// this function standardizes the info of the json into what the html articles need
function readJsonTeam() {
	var team_json = getTeam()

	var ret = {
		sailbot: [],
		tiltrotor: []
	}

	team_json.forEach(function(person) {
		if (person.photo.length == 0 || person.first.length == 0 || person.last.length == 0) {
			person.photo = "./img/person.png"
		} else {
			person.photo = "./img/" + person.first[0].toLowerCase() + "_" + person.last.toLowerCase() + ".png";
		}

		if (person.team.toLowerCase().indexOf("sailbot") >= 0) {
			ret.sailbot.push(person);
		}
		if (person.team.toLowerCase().indexOf("tilt rotor") >= 0) {
			ret.tiltrotor.push(person);
		}
	});

	return ret;
}

function updateTeams () {
	team = readJsonTeam();
	// console.log('TEAM RECEIEVED', team);

	var sailbot_team = document.getElementById("sailbot-team");
	var sailbot_team_members = sailbot_team.children;
	// console.log('SAILBOT TEAM - ', sailbot_team_members);

	// create html articles for whole team
	// check against duplicate person html articles, in case some saved to html
	if (sailbot_team_members.length !== team.sailbot) {
		for(var i=0; i<team.sailbot.length; i++) {
			var curr_member = team.sailbot[i];
			var html_curr = sailbot_team_members.namedItem(curr_member.first+curr_member.last)
			if (!html_curr) {
				// console.log('1 : ', curr_member);
				addTeamMember(sailbot_team, curr_member);
			}
		}
	}

	var tiltrotor_team = document.getElementById("tiltrotor-team");
	var tiltrotor_team_members = tiltrotor_team.children;
	var tiltrotor_leads = document.getElementById("tiltrotor-leads");
	var tiltrotor_leaders = tiltrotor_team.children;


	// console.log('TILTROTOR TEAM - ', tiltrotor_team);

	if (tiltrotor_team_members.length+tiltrotor_leaders.length !== team.tiltrotor) {
		for(var i=0; i<team.tiltrotor.length; i++) {
			var curr_member = team.tiltrotor[i];
			if (curr_member.tiltrotorlead.length != 0) {
				var html_curr = tiltrotor_leaders.namedItem(curr_member.first+curr_member.last)
				if (!html_curr) {
					console.log('3 : ', curr_member);
					addTeamLead(tiltrotor_leads, curr_member);
				}
			} else {
				var html_curr = tiltrotor_team_members.namedItem(curr_member.first+curr_member.last)
				if (!html_curr) {
					console.log('1 : ', curr_member);
					addTeamMember(tiltrotor_team, curr_member);
				}
			}
		}
	}
}

function addTeamMember(team, person) {
	// console.log('adding ',person,' to team ', team);
	var html_child = document.createElement("article");
	html_child.setAttribute("id", person.first+person.last);

	var pic = document.createElement("img");
	pic.setAttribute("src", person.photo);
	pic.setAttribute("alt", "");
	html_child.append(pic);

	var name = document.createElement("p");
	var namenode = document.createTextNode(person.first + " " + person.last);
	name.appendChild(namenode);
	html_child.append(name);

	var role = document.createElement("p");
	var rolenode = document.createTextNode(person.role);
	role.appendChild(rolenode);
	html_child.append(role);

	// console.log(html_child);

	team.append(html_child);
	// console.log(team);
}

function addTeamLead(team, person) {
	// console.log('adding ',person,' to team ', team);
	var html_child = document.createElement("article");
	html_child.setAttribute("id", person.first+person.last);

	var pic = document.createElement("img");
	pic.setAttribute("src", person.photo);
	pic.setAttribute("alt", "");
	html_child.append(pic);

	var name = document.createElement("p");
	name.setAttribute("class", "person-name");
	var namenode = document.createTextNode(person.first + " " + person.last);
	name.appendChild(namenode);
	html_child.append(name);

	var title = document.createElement("p");
	title.setAttribute("class", "person-title");
	var titlenode = document.createTextNode(person.tiltrotorlead); //	CHANGE WHEN HAVE SAILBOT LEADS
	title.appendChild(titlenode);
	html_child.append(title);

	var role = document.createElement("p");
	role.setAttribute("class", "person-title");
	var rolenode = document.createTextNode(person.role);
	role.appendChild(rolenode);
	html_child.append(role);

	// console.log(html_child);

	team.append(html_child);
	// console.log(team);
}

function addBoardMember(team, person) {
	// console.log('adding ',person,' to team ', team);
	var html_child = document.createElement("article");
	html_child.setAttribute("id", person.first+person.last+'board');

	var pic = document.createElement("img");
	pic.setAttribute("src", person.photo);
	pic.setAttribute("alt", "");
	html_child.append(pic);

	var name = document.createElement("p");
	var namenode = document.createTextNode(person.first + " " + person.last);
	name.appendChild(namenode);
	name.setAttribute("class", "person-name");
	html_child.append(name);

	var role = document.createElement("p");
	var rolenode = document.createTextNode(person.role);
	role.appendChild(rolenode);
	role.setAttribute("class", "person-name");
	html_child.append(role);

	// console.log(html_child);

	team.append(html_child);
	// console.log(team);
}

// export Google form info into csv
// use http://www.csvjson.com/csv2json to convert csv to json object
// paste here
function getTeam() {
	return [
	  {
	    "first": "Linc",
	    "last": "Berkley",
	    "team": "Sailbot",
	    "role": "Software, Electronics",
	    "photo": "https://drive.google.com/open?id=1wZkp9jjfXaNAMXHKlZK_XJUOKT36znta",
	    "tiltrotorlead": "",
	    "sailbot-lead": ""
	  },
	  {
	    "first": "Amanda",
	    "last": "Hansen",
	    "team": "Sailbot",
	    "role": "Software, Electronics",
	    "photo": "https://drive.google.com/open?id=1K371b2Myb6pa854xNQ9YOhMg2JN2Y88w",
	    "tiltrotorlead": "",
	    "sailbot-lead": ""
	  },
	  {
	    "first": "Jonathan",
	    "last": "Li",
	    "team": "Tilt Rotor, Sailbot",
	    "role": "Software, Electronics, Design, Fabrication",
	    "photo": "https://drive.google.com/open?id=1aRxmnleSRy6NJnCWISRkAPwCp-rARTJP",
	    "tiltrotorlead": "Project Leader",
	    "sailbot-lead": ""
	  },
	  {
	    "first": "Clio",
	    "last": "Meghir",
	    "team": "Tilt Rotor, Sailbot",
	    "role": "Software, Fabrication",
	    "photo": "photo",
	    "tiltrotorlead": "",
	    "sailbot-lead": ""
	  },
	  {
	    "first": "Tallak",
	    "last": "Meland",
	    "team": "Tilt Rotor, Sailbot",
	    "role": "Fabrication",
	    "photo": "https://drive.google.com/open?id=134hkPeNWN1LXG17aPiidrksOrdVlMeuw",
	    "tiltrotorlead": "Project Second",
	    "sailbot-lead": ""
	  },
	  {
	    "first": "Jared",
	    "last": "Weinstein",
	    "team": "Sailbot",
	    "role": "Software",
	    "photo": "https://drive.google.com/open?id=1KUWpk7wq_OevMPCzBY62uIhcT7dcU9P_",
	    "tiltrotorlead": "",
	    "sailbot-lead": ""
	  },
	  {
	    "first": "Zach",
	    "last": "Wright",
	    "team": "Sailbot",
	    "role": "Electronics, Design, Fabrication",
	    "photo": "pic",
	    "tiltrotorlead": "",
	    "sailbot-lead": ""
	  }
	]
}
