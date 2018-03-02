//database data
var schedule = [];
var teams = [];
var matchData = [];
var dataDefinitions = [];
var pitNotesDefinitions = [];
var scoutingPosition = 0;
var offlineData = [];
var offlinePitNotes = [];

var offline = false;

var scheduleLoading = false;
var teamsLoading = false;
var matchDataLoading = false;
var dataDefinitionsLoading = false;
var pitNotesDefinitionsLoading = false;
var scoutingPositionLoading = false;
var offlineDataLoading = false;
var offlinePitNotesLoading = false;

function loadOffline()
{
	offline = !navigator.onLine;
	setInterval(checkOffline(), 500);
	
	loadOfflineMatchData();

	if(!offline)
	{
		loadSchedule();
		loadTeams();
		loadMatchData();
		loadDataDefinitions();
		loadPitNotesDefinitions();
		loadScoutingPosition();

		loadSchedulePage();
		loadAdminPanelPage();
		loadErrorPage();
		loadDataFormPage();
		loadTeamsListPage();
		loadMatchDataPage();
		loadTeamPage();
	}
	else
	{
		loadScheduleOffline();
		loadTeamsOffline();
		loadMatchDataOffline();
		loadDataDefinitionsOffline();
		loadPitNotesDefinitionsOffline();
		loadScoutingPositionOffline();

		loadSchedulePageOffline();
		loadAdminPanelPageOffline();
		loadErrorPageOffline();
		loadDataFormPageOffline();
		loadTeamsListPageOffline();
		loadMatchDataPageOffline();
		loadTeamPageOffline();
		
		completeAjax();
	}
}

/*

Functions that get data, kinda like databasemodels, but only pulling from localStorage

*/

function getMatchData(matchnumber, team)
{
	for(match of matchData)
	{
		if(match.match_number == matchnumber)
		{
			if(match.team_number == team)
			{
				return match;
			}
		}
	}
	return null;
}

function getMatch(matchnumber)
{
	for(match of schedule)
	{
		if(match.match_number == matchnumber)
			return match;
	}
}

function getTeam(teamnumber)
{
	for(team of teams)
	{
		if(team.number == teamnumber)
			return team;
	}
	return null;
}

function definitionDisplay(index, value)
{
	var definition = getDefinition(index);
	
	switch(definition['data_type'])
	{
		case '0':
			return value == 1 ? "True" : "False";
			break;
		case '1':
			switch(definition['module'])
			{
				case '4':
					return definition['dropdown_values'].split(",")[value - 1];
					break;
				default:
					return value;
					break;
			}
			break;
		case '2':
			return "\"" + value + "\"";
			break;
	}
}

function getDefinition(name)
{
	for(definition of dataDefinitions)
	{
		if(definition['title'] == name)
			return definition;
	}
	return null;
}

/*

Basic Functions to call data from the database and store it in localStorage

*/

function loadSchedule()
{
	schedule = [];
	scheduleLoading = true;
	request = $.ajax({
		url: "/?c=offline&do=getSchedule",
		type: "get"
	}).done(function (response, textStatus, jqXHR) {
		if(response == "NOT LOGGED IN")
		{
			window.location.replace("/?c=login");
		}
		else if(response == "NOT ENOUGH PERMISSIONS")
		{
			window.location.replace("/?c=login&do=logout");
		}
		else
		{
			var list = JSON.parse(response);
			list.forEach(function(item, index) {
				schedule.push(new Match(item['match_number'], item['time'], item['red_1'], item['red_2'], item['red_3'], item['blue_1'], item['blue_2'], item['blue_3']));
			});
			localStorage.setItem("schedule", response);
		}
	});
}

function loadScheduleOffline()
{
	schedule = [];
	scheduleLoading = true;
	response = localStorage.getItem("schedule");
	var list = JSON.parse(response);
	list.forEach(function(item, index) {
		schedule.push(new Match(item['match_number'], item['time'], item['red_1'], item['red_2'], item['red_3'], item['blue_1'], item['blue_2'], item['blue_3']));
	});
}

function loadTeams()
{
	teams = [];
	teamsLoading = true;
	request = $.ajax({
		url: "/?c=offline&do=getTeams",
		type: "get"
	}).done(function (response, textStatus, jqXHR) {
		if(response == "NOT LOGGED IN")
		{
			window.location.replace("/?c=login");
		}
		else if(response == "NOT ENOUGH PERMISSIONS")
		{
			window.location.replace("/?c=login&do=logout");
		}
		else
		{
			var list = JSON.parse(response);
			list.forEach(function(item, index) {
				teams.push(new Team(item['number'], item['name'], item['pit_notes'], item['averages']));
			});
			localStorage.setItem("teams", response);
		}
	});
}

function loadTeamsOffline()
{
	teams = [];
	teamsLoading = true;
	response = localStorage.getItem("teams");
	var list = JSON.parse(response);
	list.forEach(function(item, index) {
		teams.push(new Team(item['number'], item['name'], item['pit_notes'], item['averages']));
	});
}

function loadMatchData()
{
	matchData = [];
	matchDataLoading = true;
	request = $.ajax({
		url: "/?c=offline&do=getMatchData",
	type: "get"
	}).done(function (response, textStatus, jqXHR) 
	{
		if(response == "NOT LOGGED IN")
		{
			window.location.replace("/?c=login");
		}
		else if(response == "NOT ENOUGH PERMISSIONS")
		{
			window.location.replace("/?c=login&do=logout");
		}
		else
		{
			var list = JSON.parse(response);
			list.forEach(function(item, index) {
				matchData.push(new MatchData(item['match_number'], item['team_number'], item['scout'], item['dead'], item['dead_shortly'], item['data']));
			});
			localStorage.setItem("matchData", response);
		}
	});
}

function loadMatchDataOffline()
{
	matchData = [];
	matchDataLoading = true;
	response = localStorage.getItem("matchData");
	var list = JSON.parse(response);
	list.forEach(function(item, index) {
		matchData.push(new MatchData(item['match_number'], item['team_number'], item['scout'], item['dead'], item['dead_shortly'], item['data']));
	});
}

function loadDataDefinitions()
{
	dataDefinitions = [];
	dataDefinitionsLoading = true;
	request = $.ajax({
		url: "/?c=offline&do=getDataDefinitions",
		type: "get"
	}).done(function (response, textStatus, jqXHR) 
	{
		if(response == "NOT LOGGED IN")
		{
			window.location.replace("/?c=login");
		}
		else if(response == "NOT ENOUGH PERMISSIONS")
		{
			window.location.replace("/?c=login&do=logout");
		}
		else
		{
			var list = JSON.parse(response);
			list.forEach(function(item, index) {
				dataDefinitions.push(item);
			});
			localStorage.setItem("dataDefinitions", response);
		}
	});
}

function loadDataDefinitionsOffline()
{
	dataDefinitions = [];
	dataDefinitionsLoading = true;
	response = localStorage.getItem("dataDefinitions");
	var list = JSON.parse(response);
	list.forEach(function(item, index) {
		dataDefinitions.push(item);
	});
}

function loadPitNotesDefinitions()
{
	pitNotesDefinitions = [];
	pitNotesDefinitionsLoading = true;
	request = $.ajax({
		url: "/?c=offline&do=getPitNotesDefinitions",
		type: "get"
	}).done(function (response, textStatus, jqXHR) 
	{
		if(response == "NOT LOGGED IN")
		{
			window.location.replace("/?c=login");
		}
		else if(response == "NOT ENOUGH PERMISSIONS")
		{
			window.location.replace("/?c=login&do=logout");
		}
		else
		{
			var list = JSON.parse(response);
			list.forEach(function(item, index) {
				pitNotesDefinitions.push(item);
			});
			localStorage.setItem("pitNotesDefinitions", response);
		}
	});
}

function loadPitNotesDefinitionsOffline()
{
	pitNotesDefinitions = [];
	pitNotesDefinitionsLoading = true;
	response = localStorage.getItem("pitNotesDefinitions");
	var list = JSON.parse(response);
	list.forEach(function(item, index) {
		pitNotesDefinitions.push(item);
	});
}

function loadScoutingPosition()
{
	scoutingPosition = 0;
	scoutingPositionLoading = true;
	request = $.ajax({
		url: "/?c=adminpanel&do=getScoutingPosition",
		type: "get"
	}).done(function (response, textStatus, jqXHR) 
	{
		if(response == "NOT LOGGED IN")
		{
			window.location.replace("/?c=login");
		}
		else
		{
			scoutingPosition = response;
			localStorage.setItem("scoutingPosition", response);
		}
	});
}

function loadScoutingPositionOffline()
{	
	scoutingPosition = 0;
	scoutingPositionLoading = true;
	scoutingPosition = localStorage.getItem("scoutingPosition");
}

//offlineData

function loadOfflineMatchData()
{
	offlineData = [];
	offlineDataLoading = true;
	response = localStorage.getItem("offlineData");
	if(response == "null" || response == null)
		return;
	var list = JSON.parse(response);
	list.forEach(function(item, index) {
		offlineData.push(new MatchData(item['match_number'], item['team_number'], item['scout'], item['dead'], item['dead_shortly'], item['data']));
	});
}

function loadOfflinePitNotes()
{
	offlinePitNotes = [];
	offlinePitNotesLoading = true;
	response = localStorage.getItem("offlinePitNotes");
	if(response == "null" || response == null)
		return;
	var list = JSON.parse(response);
	list.forEach(function(item, index) {
		offlinePitNotes.push(item);
	});
}

function storeOfflineMatchData(data)
{
	data = JSON.parse(data);

	for(d of offlineData)
	{
		if(d.match_number == data['match_number'] && d.team_number == data['team_number'])
			return "OVERRIDE?";		
	}

	offlineData.push(new MatchData(data['match_number'], data['team_number'], -1, data['dead'], data['dead_shortly'], data['data']));

	localStorage.setItem("offlineData", JSON.stringify(offlineData));
	return "SUCCESS";
}

function overrideOfflineMatchData(data)
{
	data = JSON.parse(data);

	for(index in offlineData)
	{
		if(d.match_number == data['match_number'] && d.team_number == data['team_number'])
			offlineData.splice(index, 1);
	}

	offlineData.push(new MatchData(data['match_number'], data['team_number'], -1, data['dead'], data['dead_shortly'], data['data']));
	localStorage.setItem("offlineData", JSON.stringify(offlineData));
	return "SUCCESS";
}

function checkOffline()
{
	offline = !navigator.onLine;
	if(!offline)
	{
		if(offlineData.length > 0)
		{
			alert("You are now online. Your match data will be uploaded now.");
				var allgood = true;

			for(index in offlineData)
			{
						var d = offlineData[index];

				var values = {
					'data': JSON.stringify({
						'team_number': d.team_number,
						'match_number': d.match_number,
						'dead': d.dead,
						'dead_shortly': d.dead_shortly,
						'data': d.data
					})
				};

				request = $.ajax({
					url: "/?c=dataentry&do=enterData",
					type: "post",
					data: values
				});
				
				request.done(function(response, textStatus, jqXHR) {
					if(response == "NOT LOGGED IN")
					{
						window.location.href = "/?c=login";
									allgood = false;
					}
					else if(response == "NOT ENOUGH PERMISSIONS")
					{
						location.reload();
									allgood = false;
					}
					else if(response == "MATCH HAS ALREADY BEEN SCOUTED")
					{
						if(confirm("This match has already been scouted. Would you like to override it?"))
						{
							request = $.ajax({
									url: "/?c=dataentry&do=updateData",
									type: "post",
									data: values
							});
							
							request.done(function(response, textStatus, jqXHR) {
								if(response == "SUCCESS")
								{
									setPage("http://localhost/?p=datapanel");
									alert("Match " + d.match_number + ", Team " + d.team_number + " successfully overridden");
													offlineData.splice(index, 1);
								}
							});
						}
					}
					else if(response == "SUCCESS")
					{
						setPage("http://localhost/?p=datapanel");
						alert("Match " + d.match_number + ", Team " + d.team_number + " successfully scouted");
									offlineData.splice(index, 1);
					}
				});
			}
				if(allgood)
				{
					localStorage.setItem("offlineData", null);
				}
		}
	}
}