"use strict"

var table_px = 500;
var table_cells = 16;
var team_size = 3;
// var difficulty = 4;

var minutes = 5;

var appear_task = 5; //in seconds

var wall_chance = 25;//[0,99]

var is_wall;
var who_wall_player, who_wall_cpu;

var cst_gen_map_prod = 0.3;


var max_players = 6;//no names for more....
var seconds = 0;
var timerId;


function clear_all(ask)
{
	is_wall = undefined;
	who_wall_cpu = undefined;
	who_wall_player = undefined;

	vect_prog = undefined;
	vect_prog_setinterv = undefined;

	selected = undefined;

	task_list = undefined;

	no_tasks = 0;

	clearInterval(timerId);


	if(ask && localStorage.getItem("table_px") != undefined)
	{
		table_px = localStorage.getItem("table_px");
		table_cells = localStorage.getItem("table_cells");
		team_size = localStorage.getItem("team_size");
		minutes = localStorage.getItem("minutes");
		appear_task = localStorage.getItem("appear_task");

	}
}


function countDown()
{
	seconds --;

	if(seconds > 0 && (seconds % appear_task == 0) )
	{
		generate_task();
	}

	document.getElementById("count_down").innerHTML = (Math.floor(seconds / 60)) + "m " + (seconds % 60) + "s ";

	if(seconds == -1)
	{
		alert("Game over! Total Score" + score);
	}

	if (seconds < 0) {
		document.getElementById("count_down").innerHTML = "timeout";
    }
}

// 

// function classPerson(name, skills, )



function add_node( id, type, place)
{
	var my = document.createElement(type);
	my.id = id;

	my.style.position = "relative";

	place.appendChild(my);

	return my;
}


function get_random(up)
{
	var aux = Math.random();

	return Math.floor(aux * up);
}

var dx = [0, 1, 0, -1];
var dy = [1, 0, -1, 0];

function union(nx, ny, ox, oy)
{
	while(nx != ox)
	{

		is_wall[nx][ny] = 2;
		nx --;
	}

	while(ny > oy)
	{
		is_wall[nx][ny] = 2;
		ny --;
	}
	while(ny < oy)
	{
		is_wall[nx][ny] = 2;
		ny ++;

		while(is_wall[nx][ny] != 2)
		{
			is_wall[nx][ny] = 2;
			ny ++;
		}
	}

	
}

function dfs(x, y)
{
	if(x < 0 || y < 0 || x >= table_cells || y >= table_cells)
		return;

	if(is_wall[x][y] != 0)
		return;

	is_wall[x][y] = 2;

	for(var i = 0; i < 4; i++)
	{
		dfs(x + dx[i], y + dy[i]);
	}
}



function settings_page()
{
	if(document.getElementById("div_settings"))
		return;

	var div_settings = document.createElement("div");
	div_settings.id = "div_settings";
	div_settings.style.width = "500px";
	div_settings.style.height = "500px";
	div_settings.style.border = "2px solid black";
	div_settings.style.backgroundColor = "white";
	div_settings.style.zIndex = "20";
	div_settings.style.position = "absolute";
	div_settings.style.top = "20px";
	div_settings.style.left = "20px";
	document.body.appendChild(div_settings);

	var p = document.createElement("p");
	p.innerHTML = "Table size in px:";
	div_settings.appendChild(p);

	var tip_text = document.createElement("INPUT");
    tip_text.setAttribute("type", "text");
    tip_text.setAttribute("value", table_px);
    div_settings.appendChild(tip_text);


    var p = document.createElement("p");
	p.innerHTML = "Table cells:";
	div_settings.appendChild(p);

	var tip_range = document.createElement("INPUT");
	tip_range.setAttribute("type", "range");
	tip_range.setAttribute("min", "6");
	tip_range.setAttribute("max", "20");
	tip_range.setAttribute("value", table_cells + "");
	div_settings.appendChild(tip_range);



    var p = document.createElement("p");
	p.innerHTML = "Number of programmers";
	div_settings.appendChild(p);


	var my_checked;
	for(var i = 1 ;i <= max_players; i ++)
	{
		var radio_but = document.createElement("input");
		radio_but.type = "radio";
		radio_but.name = i + "";

		if(i == team_size)
		{
			radio_but.checked = true;
			my_checked = radio_but;
		}
		radio_but.value = i;

		div_settings.appendChild(radio_but);

		radio_but.onchange = function()
		{
			my_checked.checked = false;
			my_checked = this;
			my_checked.checked = true;
			table_cells = this.value;
		}

		var div = document.createElement("div");
		div.class = "de_radio";

		div.style.display = "inline-block";

		div.innerHTML = radio_but.name;

		div_settings.appendChild(div);	
	}


    var p = document.createElement("p");
	p.innerHTML = "Number of minutes:";
	div_settings.appendChild(p);

	var tip_textarea = document.createElement("textarea");
	tip_textarea.innerHTML = parseFloat(Math.round(minutes * 100) / 100).toFixed(2) + "";
	div_settings.appendChild(tip_textarea);


    var p = document.createElement("p");
	p.innerHTML = "";
	div_settings.appendChild(p);

    var p = document.createElement("p");
	p.innerHTML = "CPU enable:";
	div_settings.appendChild(p);
	p.style.display = "inline-block";

	var tip_checkbox = document.createElement("input");
	tip_checkbox.type = "checkbox";
	div_settings.appendChild(tip_checkbox);


    
    var p = document.createElement("p");
	p.innerHTML = "Seconds between tasks:";
	div_settings.appendChild(p);


	var my_checked_box;
	for(var i = 5 ;i <= 25; i +=5)
	{
		var check_but = document.createElement("input");
		check_but.type = "checkbox";
		check_but.name = i + "";

		if(i == appear_task)
		{
			check_but.checked = true;
			my_checked_box = check_but;
		}
		check_but.value = i;

		div_settings.appendChild(check_but);

		check_but.onchange = function()
		{
			my_checked_box.checked = false;
			my_checked_box = this;
			my_checked_box.checked = true;
			table_cells = this.value;
		}

		var div = document.createElement("div");
		div.class = "de_radio";

		div.style.display = "inline-block";

		div.innerHTML = check_but.name;

		div_settings.appendChild(div);	
	}



    var p = document.createElement("p");
	p.innerHTML = "";
	div_settings.appendChild(p);

	var button = document.createElement("button");

	button.innerHTML = "Save and close";

	button.onclick = function() { 

		var x = tip_text.value;

		x = parseInt(x);
		if(Number.isInteger(x) == false)
		{
			alert("table px value is not an integer");
			return;
		}
		else
		{
			if(x < 300)
			{
				alert("table px sould be at least 300 px");
				return;
			}


			table_px = x;	
			localStorage.setItem("table_px", table_px);

		}


		localStorage.setItem("table_cells", table_cells);
		table_cells = tip_range.value;		


		team_size = my_checked.value;
		localStorage.setItem("team_size", team_size);

		var x = tip_textarea.value;

		x = parseFloat(x);

		if(isNaN(x) == true)
		{
			alert("number of minutes is not a float");
			return;
		}


		minutes = x;
		localStorage.setItem("minutes", minutes);


		appear_task = my_checked_box.value;
		localStorage.setItem("appear_task", appear_task);

		document.body.removeChild(div_settings);

		clear_all(0);

		before_start();
	};

	div_settings.appendChild(button);




}

function instructions_page()
{
	if(document.getElementById("div_instr"))
		return;

	var div_instr = document.createElement("div");
	div_instr.id = "div_instr";
	div_instr.style.width = "500px";
	div_instr.style.height = "500px";
	div_instr.style.border = "2px solid black";
	div_instr.style.backgroundColor = "white";
	div_instr.style.zIndex = "20";
	div_instr.style.position = "absolute";
	div_instr.style.top = "20px";
	div_instr.style.left = "20px";
	document.body.appendChild(div_instr);



    var p = document.createElement("p");
	p.innerHTML = "Catch and solve as many tractors as you can!";
	div_instr.appendChild(p);


    var p = document.createElement("p");
	p.innerHTML = "You can select a programmer and move him with WASD";
	div_instr.appendChild(p);



    var p = document.createElement("p");
	p.innerHTML = "Each programmer has a list of tasks to solve (displayed in the special region for information about selected programmer).\
	 He is thinking just at his first problem in the list (this means that the requirement for solving that task will decrease with the programmer's skills each second).";
	div_instr.appendChild(p);



    var p = document.createElement("p");
	p.innerHTML = "When you are clicking on a problem in the list, there could be two situations:\
	 <br/>a)if the task is already solved (so, it has a strange green border), the problem will be removed from the list and the total score incremented\
	 <br/>b)if the task is is not completely solved, the problem will be moved to the top of the list (that single position where the programmer is thinking)";
	div_instr.appendChild(p);



    var p = document.createElement("p");
	p.innerHTML = "Bonus<br/> You can move one tractor from one programmer to another one by drag and drop from the sender list to the receiver programmer icon on map";
	div_instr.appendChild(p);

 



	var button = document.createElement("button");

	button.innerHTML = "Close";

	button.onclick = function() { 

		document.body.removeChild(div_instr);
	};

	div_instr.appendChild(button);
}


function before_start()
{
	if(document.getElementById("little_menu") != undefined)
	{
		document.body.removeChild(document.getElementById("little_menu"));
		document.body.removeChild(document.getElementById("table_player"));
		document.body.removeChild(document.getElementById("info_selected"));
		document.body.removeChild(document.getElementById("table_pc"));
	}

	add_node("little_menu", "div", document.body);
	add_node("table_player", "div", document.body);
	add_node("info_selected", "div", document.body);
	var cpu_zone = add_node("table_pc", "div", document.body);

	is_wall = new Array(table_cells);
	who_wall_player = new Array(table_cells);
	who_wall_cpu = new Array(table_cells);

	for(var i = 0; i < table_cells; i++)
	{
		is_wall[i] = new Array(table_cells);
		who_wall_player[i] = new Array(table_cells);
		who_wall_cpu[i] = new Array(table_cells);
		for(var j = 0; j < table_cells; j++)
		{
			var rand_var = get_random(100);

			is_wall[i][j] = 1;
		}
	}

	seconds = 0;


	var player_zone = document.getElementById("table_player");


	player_zone.style.width = table_px+"px";
	player_zone.style.height = table_px+"px";
	player_zone.style.border = "2px solid black";

	player_zone.style.display = "inline-block";
	player_zone.style.position = "relative";
	player_zone.style.marginBottom = "20px";


	for(var i = 0; i < table_cells; i++)
	{
		for(var j = 0; j < table_cells; j++)
		{
			var node = document.createElement("BUTTON");

			player_zone.appendChild(node);


			node.style.width = (100/table_cells) + "%";
			node.style.height = (100/table_cells) + "%";

			who_wall_player[i][j] = node;

			node.onclick = function(){ select_programmer(this); }; 


			if(is_wall[i][j] == 1)
				node.style.backgroundColor = "black";
			else
				node.style.backgroundColor = "white";
		}
	}


	// player_zone.style.float = "left";

	// initiate_game_play(player_zone, 0, who_wall_player);

	var cpu_zone = document.getElementById("table_pc");


	cpu_zone.style.width = table_px+"px";
	cpu_zone.style.height = table_px+"px";
	cpu_zone.style.border = "2px solid black";

	cpu_zone.style.display = "inline-block";
	cpu_zone.style.position = "relative";
	cpu_zone.style.marginBottom = "20px";

	for(var i = 0; i < table_cells; i++)
	{
		for(var j = 0; j < table_cells; j++)
		{
			var node = document.createElement("BUTTON");

			cpu_zone.appendChild(node);


			node.style.width = Math.floor(100/table_cells) + "%";
			node.style.height = Math.floor(100/table_cells) + "%";

			who_wall_cpu[i][j] = node;


			if(is_wall[i][j] == 1)
				node.style.backgroundColor = "black";
			else
				node.style.backgroundColor = "white";
		}
	}

	// cpu_zone.style.float = "right";

	// initiate_game_play(cpu_zone, 1, who_wall_cpu);


	var menu = document.getElementById("little_menu");

	menu.style.position = "relative";
	menu.style.display = "inline-block";
	menu.style.marginLeft = "20px";
	menu.style.marginRight = "20px";
	menu.style.width = "100px";
	menu.style.height = (table_px - 50)  + "px";
	menu.style.border = "2px solid black";
	menu.style.top = "-10px";

	menu.style.verticalAlign = "top";
	menu.style.top = "20px";


	var score_board = add_node("score_board", "div", menu);
	score_board.innerHTML = "Total score 0";
	score_board.style.width = "100%";
	score_board.style.boxSizing = "border-box";
	score_board.style.border = "2px solid black";

	var info = document.getElementById("info_selected");

	info.style.overflowY = "scroll";
	// info.style.overflowX = "scroll";

	info.style.position = "relative";
	info.style.display = "inline-block";

	info.style.marginLeft = "20px";
	info.style.marginRight = "20px";
	// info.style.top = "20px";

	info.style.width = "150px";
	info.style.height = (table_px - 50) + "px";

	info.style.border = "2px solid black";
	info.style.verticalAlign = "top";
	info.style.top = "20px";


	var menu = document.getElementById("little_menu");


	var counter = add_node("counter", "div", menu);

	counter.style.width = "100%";
	counter.style.height = "15%";
	counter.style.boxSizing = "border-box";
	counter.style.border = "2px solid black";
	counter.id = "count_down";

	var start_button = add_node("start_button", "div", menu);

	start_button.style.width = "100%";
	start_button.style.height = "15%";
	start_button.style.boxSizing = "border-box";
	start_button.style.border = "2px solid black";
	start_button.style.display = "block";
	start_button.onclick = function(){ start_game() };

	var text_inside_start_button = add_node("text_inside_start_button", "p", start_button);

	text_inside_start_button.innerHTML = "New Game";


	var settings_button = add_node("settings_button", "div", menu);

	settings_button.style.width = "100%";
	settings_button.style.height = "15%";
	settings_button.style.boxSizing = "border-box";
	settings_button.style.border = "2px solid black";
	settings_button.style.display = "block";
	settings_button.onclick = function(){ settings_page() };


	var text_inside_settings_button = add_node("text_inside_settings_button", "p", settings_button);

	text_inside_settings_button.innerHTML = "Settings";


	var instructions_button = add_node("instructions_button", "div", menu);

	instructions_button.style.width = "100%";
	instructions_button.style.height = "15%";
	instructions_button.style.boxSizing = "border-box";
	instructions_button.style.border = "2px solid black";
	instructions_button.style.display = "block";
	instructions_button.onclick = function(){ instructions_page() };


	var text_inside_instruction_button = add_node("text_inside_settings_button", "p", instructions_button);

	text_inside_instruction_button.innerHTML = "Instructions";




	seconds = -2;

	timerId = setInterval(function(){ countDown(); },1000);


}


function initiate_game_play(zone, is_bot, matrix)
{
	if(matrix == who_wall_cpu)
		return;


	var pos_programmers = 0;

	for(var i = 0; i < table_cells; i++)
	{
		for(var j = 0; j < table_cells; j++)
		{
			var node = matrix[i][j];


			if(is_wall[i][j] == 1)
				node.style.backgroundColor = "black";
			else
			{
				node.style.backgroundColor = "white";
				if(pos_programmers < team_size)
				{
					put_new_programmer(i, j, pos_programmers);
					pos_programmers ++ ;
				}
			}
			
			
			// node.style.fontSize = "30px";

			// node.style.position = "absolute";

			// node.style.left = 33 * (i%3) + "%";
			// node.style.top = 33 * Math.floor(i/3) + "%";

			// node.classList.add("cells");
		}
	}

}


function start_game()
{
	// var minutes = prompt("How many minutes the game should last?", "5");
	// if(isNaN( minutes ) || minutes <= 0 )
	//  	minutes = 5;
	// seconds = minutes *60;

	// table_cells = prompt("How many cells the table should have?", "10");
	// if(isNaN(table_cells) || table_cells <= 0)
	// 	table_cells = 10;

	// team_size = prompt("How many members a team should have?", "3");
	// if(isNaN(team_size) || team_size <= 0)
	// 	team_size = 3;

	// difficulty = prompt("How good the cpu team should be? (a number between 1 and 10)", "4");
	// if(isNaN(difficulty) || difficulty <= 0)
	// 	difficulty = 4;

	if(who_wall_player != undefined)
	{
		for(var i = 0; i < table_cells; i++)
		{
			for(var j = 0; j < table_cells; j++)
			{
				var childs = who_wall_player[i][j].childNodes;

				for(var k = childs.length - 1; k >= 0; k--)
				{
					if(childs[k].tagName == 'IMG')
					{
						if(childs[k].getAttribute("src") == "poze/task.png")
						{
							who_wall_player[i][j].removeChild(childs[k]);
						}
					}
				}
			}
		}	
	}	
	if(vect_prog_setinterv != undefined)
	{
		for(var i = 0; i < vect_prog_setinterv.length; i++)
		{
			clearInterval(vect_prog_setinterv[i]);
		}		
	}


	

	seconds = minutes * 60;


	for(var i = 0; i < table_cells; i++)
	{
		for(var j = 0; j < table_cells; j++)
		{
			is_wall[i][j] = 1;
		}
	}
	



	var no_lines_gen = table_cells * table_cells * cst_gen_map_prod;

	no_lines_gen = Math.floor(no_lines_gen);



	for(var i = 0; i < no_lines_gen; i++)
	{
		var dir = get_random(2);

		var xstart = get_random(table_cells / 2) * 2;
		var ystart = get_random(table_cells / 2) * 2;

		var len = get_random(Math.floor(table_cells / 2));

		for(var x = xstart, y = ystart, step = 0; step < len && x < table_cells && y < table_cells; step++, x += (dir == 0), y += (dir == 1))
		{
			is_wall[x][y] = 0;
		}
	}

	// for(var i = 0; i < table_cells; i++)
	// {
	// 	console.log(is_wall[i]);
	// }

	var lastx = -1, lasty = -1;

	for(var x = 0; x < table_cells; x++)
	{
		for(var y = 0; y < table_cells; y++)
		{
			if(is_wall[x][y] == 0)
			{
				dfs(x,y);
				if(lastx != -1)
				{
					union(x, y, lastx, lasty);
				}
			}

			if(is_wall[x][y] == 2)
			{
				lastx = x;
				lasty = y;
			}
		}
	}

	for(var x = 0; x < table_cells; x++)
	{
		for(var y = 0; y < table_cells; y++)
		{
			if(is_wall[x][y] == 2)
				is_wall[x][y] = 0;
		}
	}



	var player_zone = document.getElementById("table_player");

	// player_zone.style.float = "left";

	initiate_game_play(player_zone, 0, who_wall_player);

	var cpu_zone = document.getElementById("table_pc");


	// cpu_zone.style.float = "right";

	initiate_game_play(cpu_zone, 1, who_wall_cpu);



	task_list = new Array(seconds / appear_task + 10);

	generate_task();

}



// window.onload=function(){ // main function



function main(){
	document.body.style.display = "block";


	// cpu_zone.style.display = "none";

	clear_all(1);

	before_start();


	//start_game();
}







