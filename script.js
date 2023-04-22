// Implemented IIFE Module Pattern
var app = (function () {
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
    "${task.title}"  ${message} </div>`;
    else
      ele.innerHTML += `<div> <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
    ${message} </div>`;
  }
  //Fetching the dummy list - Promise
  // function fetchToDos() {
  //   //GET request
  //   //fetch function will return a promise, hence we are using .then() function on it
  //   fetch("https://jsonplaceholder.typicode.com/todos")
  //     .then((response) => {
  //       //response will be an object, if the object has status propertey set as 200
  //       // that the GET req. was successful.
  //       //Now we convert this respose into JSON
  //       //.json() will return a promise with the ToDo items in JSON format
  //       //hence we again do .then() on it
  //       return response.json();
  //     })
  //     .then((data) => {
  //       //This data will be acutal array of Dummy Todos
  //       // for (let i = 0; i < 5; i++) {
  //       //   taskListArr.push(data[i]);
  //       // }
  //       taskListArr = data.slice(0, 5);
  //       renderList();
  //       giveMessage("5 dummy ToDos added");
  //     })
  //     //.catch() in case we get an error
  //     .catch((error) => {
  //       console.log("error");
  //       giveMessage(error);
  //     });
  // }
  //Fetching the dummy list - Promise using Aysnc Await Syntax
  async function fetchToDos() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = await response.json();
      taskListArr = data.slice(10, 15);
      renderList();
      giveMessage("5 dummy ToDos added");
    } catch (error) {
      console.log(error);
    }
  }
  //Pushing Task in the List inside DOM
  function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.innerHTML = `
    <input type="checkbox" id="${task.id}" ${
      task.completed ? "checked" : ""
    } class="custom-checkbox">
    <label for="${task.id}" id = "task-name">${task.title}</label>
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
    //here taskId will contain a string as it is being fetched from
    //html element, where as task.id will be a number
    const newTasks = taskListArr.filter(function (task) {
      return task.id !== Number(taskId);
    });
    const deletedTask = taskListArr.filter(function (task) {
      return task.id === Number(taskId);
    });
    taskListArr = [...newTasks];
    renderList();
    giveMessage("Tasks Deleted", deletedTask[0]);
    return;
  }
  //CHECK BOX
  function markTaskAsComplete(taskId) {
    const currtask = taskListArr.filter(function (task) {
      //here taskId will contain a string as it is being fetched from
      //html element, where as task.id will be a number
      return task.id === Number(taskId);
    });

    if (currtask.length > 0) {
      const currentTask = currtask[0];

      currentTask.completed = !currentTask.completed;
      if (currentTask.completed === true)
        giveMessage("You Completed Task " + currentTask.title);
      else
        giveMessage("Your Task " + currentTask.title + " is still incomplete");
      renderList();
      return;
    } else {
      giveMessage("Marking as complete fail", "markTaskAsComplete");
    }
  }
  //Comparator Functions for sort()
  function sortAccToName(a, b) {
    return a.title.localeCompare(b.title);
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
        title: text,
        id: Date.now(),
        completed: false,
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
  function handleKey(e) {
    const target = e.key;
    if (target == "Enter") {
      addTask();
    }
  }
  function appInitialize() {
    document.addEventListener("click", handleClick);
    document.addEventListener("keyup", handleKey);
    fetchToDos();
  }
  return {
    start: appInitialize,
  };
})();
