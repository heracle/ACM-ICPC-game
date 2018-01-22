var task_list;

var no_tasks = 0;

var task_names = ["aliens", "secv8", "popcorn", "odometer", "santa", "kcity", "bacterii2", "robot"];

function taskClass(name, x, y, coding_need, solving_need, boss_need)
{
	this.name = name;
	this.coding_need = coding_need;
	this.solving_need = solving_need;
	this.boss_need = boss_need;

	this.next_task;

	var cell = who_wall_player[x][y];

	var img = document.createElement("img");
	img.setAttribute("src", "poze/task.png");
	img.style.width = "100%";
	img.style.height = "100%";
	img.style.zIndex = "1";
	img.style.position = "relative";

	img.onmouseover = function() { show_task_details(this)};
	img.onmouseout = function() { erase_task_details(this)};

	img.katerinca = this;

	cell.appendChild(img);
}


function add_task(x, y, cnt)
{
	task_list[cnt] = new taskClass(task_names[get_random(task_names.length)], x, y, get_random(100), get_random(100), get_random(100));
}

function generate_task()
{
	var x, y;

	for(var step = 0; step < 3* table_cells; step ++)//if after 30 tries, there was no any free cell for putting the new task, skip this step
	{
		x = get_random(table_cells);
		y = get_random(table_cells);

		if(is_wall[x][y] == 0 && someone(x, y) == false)
		{
			add_task(x, y, no_tasks++);
			return;
		}
	}
}

var score = 0;

function update_score()
{
	score ++;
	var score_board = document.getElementById("score_board");
	score_board.innerHTML = "Total score " + score;

	print_info(selected);
}


		// p.onmouseover = function(){ print_elapse_for_task(this.katerinca, p)};
		// p.onmouseout = function(){ erase_elapse_for_task(this.katerinca, p)};


function print_elapse_for_task(task, person, act_node)
{
	// if(act_node.childNodes[1].tagName == "DIV")
	// 	return;

	var elapse = maximul_between(task.coding_need / person.coding_skill, task.solving_need / person.solving_skill, task.boss_need / person.boss_skill);

	var div = document.createElement("div");

	div.innerHTML = "elapse time: " + Math.ceil(elapse);

	div.style.width = "100px";
	div.style.border = "1px solid gray";
	div.style.fontSize = "10px";
	div.style.position = "relative";
	div.style.top = (act_node.style.top) + "px";

	act_node.appendChild(div);

	// act_node.parentNode.insertBefore(div, act_node.nextSibling);
}

function erase_elapse_for_task(act_node)
{
	act_node.removeChild(act_node.childNodes[1]);
}

function show_task_details(node_img)
{
	var task = node_img.katerinca;
	
	var string = "C:" + task.coding_need +" S:" + task.solving_need + " B:" + task.boss_need;

	var div = document.createElement("div");
	div.innerHTML = string;
	div.style.width = "20px";
	div.style.fontSize = "10px";
	div.style.position = "relative";
	div.style.background = "white";
	div.style.zIndex = "5";
	
	node_img.parentNode.insertBefore(div, node_img.nextSibling);	
}

function erase_task_details(node_img)
{
	node_img.parentNode.removeChild(node_img.nextSibling);
}