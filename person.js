var name_programmers = ["Bicsi", "Velea", "Popa", "Costel", "Tamio", "George"];

var vect_prog;
var vect_prog_setinterv;

var selected;

function decrement_per_second(who_prog)
{
	if(who_prog.first_task == undefined)
		return;

	who_prog.first_task.coding_need -= who_prog.coding_skill;
	who_prog.first_task.solving_need -= who_prog.solving_skill;
	who_prog.first_task.boss_need -= who_prog.boss_skill;

	var cnt_finish = 0;

	if(who_prog.first_task.coding_need <= 0)
	{
		who_prog.first_task.coding_need = 0;
		cnt_finish ++;
	}
	else
	{
		who_prog.first_task.coding_need = who_prog.first_task.coding_need.toFixed(2);
	}

	if(who_prog.first_task.solving_need <= 0)
	{
		who_prog.first_task.solving_need = 0;
		cnt_finish ++;
	}
	else
	{
		who_prog.first_task.solving_need = who_prog.first_task.solving_need.toFixed(2);
	}

	if(who_prog.first_task.boss_need <= 0)
	{
		who_prog.first_task.boss_need = 0;
		cnt_finish ++;
	}
	else
	{
		who_prog.first_task.boss_need = who_prog.first_task.boss_need.toFixed(2);
	}

	if(cnt_finish == 3)
	{
		who_prog.first_task.finish = true;
	}

	print_info(selected);
}



function programmerClass(name, coding_skill, solving_skill, boss_skill, cnt)
{
	this.name = name;
	this.coding_skill = coding_skill / 100;
	this.solving_skill = solving_skill / 100;
	this.boss_skill = boss_skill / 100;

	this.x = -1;
	this.y = -1;

	this.first_task;
	this.no_tasks = 0;


	this.change_no_tasks = function( atrib )
	{
		this.no_tasks += atrib;
		this.div_cnt.innerHTML = this.no_tasks;
	}
	

	this.move_first = function(who_task)
	{
		if(seconds < 0)
			return;

		var act_task = this.first_task;

		if(act_task == who_task)
		{
			if(who_task.finish == true)
			{
				this.change_no_tasks(-1);
				this.first_task = this.first_task.next_task;
				update_score();
			}

			return;
		}
		else
		{
			while(act_task.next_task != undefined && act_task.next_task != who_task)
			{
				act_task = act_task.next_task;
			}

			act_task.next_task = who_task.next_task;

			if(who_task.finish == true)
			{
				update_score();
				this.change_no_tasks(-1);
				this.div_cnt.innerHTML = this.no_tasks;
				return;
			}

			who_task.next_task = this.first_task;
			this.first_task = who_task;
			print_info(this);
		}

		
	}

	this.add_task = function(task)
	{
		this.change_no_tasks(1);

		if(this.first_task == undefined)
		{
			this.first_task = task;
		}
		else
		{
			var last_task = this.first_task;

			while(last_task.next_task != undefined)
			{
				last_task = last_task.next_task;
			}

			last_task.next_task = task;
		}


		print_info(this);
	}

	this.change_position = function(newx, newy)
	{
		if(seconds < 0)
			return;

		if(this.x < 0)
		{
			this.node = document.createElement("div");
			this.node.katerinca = this; 
			this.node.style.width = "100%";
			this.node.style.height = "100%";
			this.node.position = "relative";

			this.node.ondragover = function() {allowDrop(event)};
			this.node.ondrop = function() { drop(event, this)};


			img = document.createElement("img");
			img.setAttribute("src", "poze/avatar" + cnt + ".png");
			img.style.width = "100%";
			img.style.height = "100%";
			img.style.zIndex = "20";
			img.style.position = "relative";

			this.node.appendChild(img);
			

			div = document.createElement("div");
			div.style.width = "25px";
			div.style.height = "18px";
			div.innerHTML = this.no_tasks;
			div.style.zIndex = "3";
			div.style.border = "3px solid darkblue";
			div.style.boxSizing = "border-box";
			div.style.position = "relative";
			div.style.background = "white";

			this.div_cnt = div;

			this.node.appendChild(div);
		}
		else
		{
			who_wall_player[this.x][this.y].removeChild(this.node);
		}

		who_wall_player[newx][newy].appendChild(this.node);
		this.x = newx;
		this.y = newy;			

	}
}

function maximul_between(a, b, c)
{
	if(b > a)
		a = b;
	if(c > a)
		a = c;

	return a.toFixed(2);
}

var p_send;

function init_info_to_drag(ths)
{
	p_send = ths;
}


function allowDrop(ev) {
    ev.preventDefault();
}

function absolute(exp)
{
	return exp > 0 ? exp : -exp;
}

function drop(ev, div_rec) {
    ev.preventDefault();


    var	person_receive = div_rec.katerinca;
    var person_send = selected;

    if(absolute(person_receive.x - person_send.x) + absolute(person_receive.y - person_send.y) != 1)
    {
    	alert("the person sender and receiver should be placed one near the other");
    	return;
    }


    var p_iterator = person_send.first_task;

    if(person_send.first_task == p_send.katerinca)
    {
    	person_send.first_task = person_send.first_task.next_task;
    }
    else
    {
    	while(p_iterator.next_task != p_send.katerinca)
	    {
	    	p_iterator = p_iterator.next_task;
	    }
	    p_iterator.next_task = p_iterator.next_task.next_task;
	    p_send_katerinca = undefined;
    }

    person_send.change_no_tasks(-1);

	select_programmer(who_wall_player[person_receive.x][person_receive.y]);
	person_receive.add_task(p_send.katerinca);


}


function print_info(person)
{
	var info_place = document.getElementById("info_selected");
	
	var child = info_selected.childNodes;

	for(var  i = child.length - 1; i >= 0; i--)
	{
		info_place.removeChild(child[i]);
	}

	var img = document.createElement("img");
	img.setAttribute("src", person.node.childNodes[0].getAttribute("src"));
	info_place.appendChild(img);
	img.style.width = "100%";


	var name = document.createElement("p");
	name.innerHTML = person.name;
	name.style.fontSize = "30px";
	name.style.textAlign = "center";
	info_place.appendChild(name);

	var skill = document.createElement("p");
	skill.innerHTML = "CODING SKILL: " + person.coding_skill;
	info_place.appendChild(skill);
	skill.style.fontSize = "13px";


	var skill = document.createElement("p");
	skill.innerHTML = "SOLVING SKILL: " + person.solving_skill;
	info_place.appendChild(skill);
	skill.style.fontSize = "13px";


	var skill = document.createElement("p");
	skill.innerHTML = "BOSS SKILL: " + person.boss_skill;
	info_place.appendChild(skill);
	skill.style.fontSize = "13px";

	var p = document.createElement("p");
	p.innerHTML = "Total tasks: " + person.no_tasks;
	p.style.fontSize = "12px";
	info_place.appendChild(p);

	var current_task = person.first_task;


	while(current_task != undefined)
	{
		var act_block = document.createElement("div");
		// act_block.style.width = "100%";

		var p = document.createElement("p");
		p.innerHTML = current_task.name;
		p.style.fontSize = "10px";
		// act_block.appendChild(p);

		// var p = document.createElement("p");
		p.innerHTML += " C:" + current_task.coding_need + " S:" + current_task.solving_need + " B:" + current_task.boss_need;
		// p.style.fontSize = "10px";
		// act_block.appendChild(p);

		// var p = document.createElement("p");
		// p.innerHTML += "elapse " + maximul_between(current_task.coding_need / person.coding_skill, current_task.solving_need / person.solving_skill, current_task.boss_need / person.boss_skill);
		// p.style.fontSize = "10px";
		act_block.appendChild(p);

		if(current_task.finish == true)
		{
			p.style.border = "1px solid green";
		}
		else
		{
			p.style.border = "1px solid lightblue";
		}

		info_place.appendChild(act_block);

		p.katerinca = current_task;

		p.style.position = "relative";

		p.onclick = function(){ person.move_first(this.katerinca);};

		p.onmouseover = function(){ print_elapse_for_task(this.katerinca, person, this)};
		p.onmouseout = function(){ erase_elapse_for_task(this)};

		p.draggable = "true";
		p.ondragstart = function(){ init_info_to_drag(this);};

		current_task = current_task.next_task;
	}

}

function select_programmer(th)
{
	var child = th.childNodes;

	if(child.length != 0 && child[0].tagName == "DIV")
	{
		var node = child[0];

		selected = node.katerinca;

		print_info(node.katerinca);
	}
}

function someone(x, y)
{
	var cell = who_wall_player[x][y];

	var child = cell.childNodes;

	if(child.length > 0)
	{
		if(child.length == 1 && child[0].tagName == 'IMG')
		{
			if(child[0].getAttribute("src") == "poze/task.png")
			{
				selected.add_task(child[0].katerinca);

				cell.removeChild(child[0]);
				return false;
			}
		}

		return true;
	}
	return false;
}

window.onkeypress = function(e)
{
	var ascii = e.which;
	var char = String.fromCharCode(ascii);

	if(selected == undefined)
		return;

	var posx, posy;

	posx = selected.x;
	posy = selected.y;

	if(char == 'w')
	{	
		if(posx == 0)
			return;
		if(is_wall[posx - 1][posy] == 1)
			return;
		if(someone(posx - 1, posy) == true)
			return;

		selected.change_position(posx - 1, posy);
	}
	else if(char == 'a')
	{
		if(posy == 0)
			return;
		if(is_wall[posx][posy - 1] == 1)
			return;
		if(someone(posx, posy - 1) == true)
			return;

		selected.change_position(posx, posy - 1);
	}
	else if(char == 'd')
	{
		if(posy == table_cells - 1)
			return;
		if(is_wall[posx][posy + 1] == 1)
			return;
		if(someone(posx, posy + 1) == true)
			return;

		selected.change_position(posx, posy + 1);
	}
	else if(char == 's')
	{
		if(posx == table_cells - 1)
			return;
		if(is_wall[posx + 1][posy] == 1)
			return;
		if(someone(posx + 1, posy) == true)
			return;

		selected.change_position(posx + 1, posy);
	}
}


function put_new_programmer(x, y, cnt)
{
	if(cnt == 0)
	{
		if(vect_prog != undefined)
		{
			for(var i = 0; i < vect_prog.length; i++)
			{
				who_wall_player[vect_prog[i].x][vect_prog[i].y].removeChild(vect_prog[i].node);
				vect_prog[i] = undefined;
				vect_prog_setinterv[i]= undefined;
			}
		}
		else
		{

			vect_prog = new Array(team_size);
			vect_prog_setinterv = new Array(team_size);
		}
	}



	vect_prog[cnt] = new programmerClass(name_programmers[cnt], get_random(1000), get_random(1000), get_random(1000), cnt);

	vect_prog[cnt].change_position(x, y);

	vect_prog_setinterv[cnt] = setInterval(function(){decrement_per_second(vect_prog[cnt]);}, 1000);
}