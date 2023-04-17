let taskList = document.getElementById("list");
let inputBar = document.getElementById("add");
let taskCounter = document.getElementById("tasks-counter");

let taskListArr = [];
// For Giving Notifications
function giveMessage(message, task = null) {
  let ele = document.getElementById("alert");
  //&times used to create the x btn
  if (task !== null)
    ele.innerHTML += `<div> <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
    ${task.text} ${message} </div>`;
  else
    ele.innerHTML += `<div> <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
    ${message} </div>`;
}
//Pushing Task in the List inside DOM
function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.innerHTML = `
    <input type="checkbox" id="${task.id}" ${
    task.done ? "checked" : ""
  } class="custom-checkbox">
    <label for="${task.id}" id = "task-name">${task.text}</label>
    <img src="bin.svg" class = "delete" data-id = "${task.id}">    
    `;
  taskList.append(li);
}
// Rendering the List
function renderList() {
  taskList.innerHTML = "";
  for (let i = 0; i < taskListArr.length; i++) {
    addTaskToDOM(taskListArr[i]);
  }
  taskCounter.innerHTML = taskListArr.length;
}
// DELETE BUTTON
function deleteTask(taskId) {
  const newTasks = taskListArr.filter(function (task) {
    return task.id !== taskId;
  });
  const deletedTask = taskListArr.filter(function (task) {
    return task.id === taskId;
  });
  taskListArr = [...newTasks];
  renderList();
  giveMessage("Tasks Deleted", deletedTask[0]);
  return;
}
//CHECK BOX
function markTaskAsComplete(taskId) {
  const currtask = taskListArr.filter(function (task) {
    return task.id === taskId;
  });

  if (currtask.length > 0) {
    const currentTask = currtask[0];

    currentTask.done = !currentTask.done;
    if (currentTask.done === true)
      giveMessage("You Completed Task " + currentTask.text);
    else giveMessage("Your Task " + currentTask.text + " is still incomplete");
    renderList();
    return;
  } else {
    giveMessage("Marking as complete fail", "markTaskAsComplete");
  }
}
//Comparator Functions for sort()
function sortAccToName(a, b) {
  return a.text.localeCompare(b.text);
}
function sortAccToTime(a, b) {
  return a.id - b.id;
}
//SORT BUTTON
function sort(sortingType) {
  if (taskListArr.length === 0) {
    giveMessage("No task is currently present");
    return;
  }
  console.log("sort called");
  if (sortingType == "name") {
    taskListArr.sort(sortAccToName);
  } else {
    taskListArr.sort(sortAccToTime);
  }
  giveMessage("sorted according to " + sortingType);
  renderList();
}
//CLEAR BUTTON
function clearList() {
  taskListArr.length = 0;
  let ele = document.getElementById("alert");
  ele.innerHTML = "Notifications ->";
  renderList();
}
//ADD BUTTON
function addTask() {
  const text = inputBar.value;
  if (text.length !== 0) {
    const task = {
      text: text,
      id: Date.now().toString(),
      done: false,
    };
    taskListArr.push(task);
    renderList();
    inputBar.value = "";
    giveMessage("Task Added", task);
  } else {
    giveMessage("Task can not be empty");
  }
}
//EVENT DELEGATION
function handleClick(e) {
  const target = e.target;
  //console.log(target.id);
  if (target.id === "addTask") {
    addTask();
  } else if (target.id === "clearToDos") {
    clearList();
  } else if (target.id === "time" || target.id === "name") {
    sort(target.id);
  } else if (target.className === "custom-checkbox") {
    const taskId = target.id;
    markTaskAsComplete(taskId);
  } else if (target.className === "delete") {
    const taskId = target.dataset.id;
    deleteTask(taskId);
  }
}

document.addEventListener("click", handleClick);
