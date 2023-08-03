const Api_Url_todo_list = "http://localhost:3000/api/todos";


const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const taskFilter = document.getElementById("taskFilter");

// checkbox, update status
function handleCheckbox_Change(event) {
  const checkbox = event.target;
  const li = checkbox.closest("li");

  if (checkbox.checked) {
    li.classList.add("completed");
    toggleTaskStatus(li.getAttribute("data-task-id"), true);
  } else {
    li.classList.remove("completed");
    toggleTaskStatus(li.getAttribute("data-task-id"), false);
  }
}
// tạo data theo checkbox,til, edit,del
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = task.completed ? "completed" : "";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", handleCheckbox_Change);

  const taskTitle = document.createElement("span");
  taskTitle.textContent = task.title;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.setAttribute("data-task-id", task.id);
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", () => {
    enableEditing(task.id, task.title);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("data-task-id", task.id);
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => {
    confirmDeleteTask(task.id);
  });

  li.appendChild(checkbox);
  li.appendChild(taskTitle);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  li.setAttribute("data-task-id", task.id);

  return li;
}
const completedCount = document.getElementById("completedCount");
const incompleteCount = document.getElementById("incompleteCount");
//filter
function displayTasks(filter) {
  fetch(Api_Url_todo_list)
    .then((response) => response.json())
    .then((data) => {
      taskList.innerHTML = "";
      let completedTasks = 0;
      let remainingTasks = 0;

      data.forEach((task) => {
        if (
          filter === "all" ||
          (filter === "completed" && task.completed) ||
          (filter === "incomplete" && !task.completed)
        ) {
          const li = createTaskElement(task);
          taskList.appendChild(li);

          if (task.completed) {
            completedTasks++;
          } else {
            remainingTasks++;
          }
        }
      });

      completedCount.textContent = completedTasks.toString();
      incompleteCount.textContent = remainingTasks.toString();
    })
    .catch((error) => console.error(error));
}
// add data
function addTask() {
  const taskName = taskInput.value;
  if (taskName.trim() === "") {
    alert("Please enter the task name");
    return;
  }

  fetch(Api_Url_todo_list, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: taskName,
      completed: false,
    }),
  })
    .then((response) => {
      if (response.ok) {
        taskInput.value = "";
        displayTasks(taskFilter.value);
      } else {
        console.log("Error:", response);
      }
    })
    .catch((error) => console.error(error));
}
//Status and send request to server
function toggleTaskStatus(taskId, completed) {
  fetch(`${Api_Url_todo_list}/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      completed: completed,
    }),
  })
    .then((response) => {
      if (response.ok) {
        displayTasks(taskFilter.value);
      } else {
        console.log("Error:", response);
      }
    })
    .catch((error) => console.error(error));
}

function enableEditing(taskId, taskTitle) {
  isEditing = true;
  editingTaskId = taskId;
  taskInput.value = taskTitle;
  addTaskBtn.textContent = "Save";
  addTaskBtn.removeEventListener("click", addTask);
  addTaskBtn.addEventListener("click", saveEditedTask);
}
// update after save

function saveEditedTask() {
  const newTaskName = taskInput.value;
  if (newTaskName.trim() === "") {
    alert("Please enter the task name");
    return;
  }

  fetch(`${Api_Url_todo_list}/${editingTaskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTaskName,
    }),
  })
    .then((response) => {
      if (response.ok) {
        taskInput.value = "";
        isEditing = false;
        editingTaskId = null;
        addTaskBtn.textContent = "Add Task";
        addTaskBtn.removeEventListener("click", saveEditedTask);
        addTaskBtn.addEventListener("click", addTask);
        displayTasks(taskFilter.value);
      } else {
        console.log("Error:", response);
      }
    })
    .catch((error) => console.error(error));
}

//del and send request to server
function deleteTask(taskId) {
  fetch(`${Api_Url_todo_list}/${taskId}`, {
    method: "DELETE",
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        displayTasks(taskFilter.value);
      } else {
        console.log("Error:", response);
      }
    })
    .catch((error) => console.error(error));
}
// xác nhân trc khi xóa 
function confirmDeleteTask(taskId) {
  const confirmDelete = confirm("Do you want to delete this task?");
  if (confirmDelete) {
    deleteTask(taskId);
  }
}

taskFilter.addEventListener("change", () => {
  displayTasks(taskFilter.value);
});

addTaskBtn.addEventListener("click", addTask);
displayTasks(taskFilter.value);
