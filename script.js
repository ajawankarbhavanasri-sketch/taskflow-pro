const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const priority = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();

addTaskBtn.addEventListener("click", addTask);

searchInput.addEventListener("input", renderTasks);

document.getElementById("themeToggle")
.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

function addTask(){

  if(taskInput.value.trim() === ""){
    alert("Enter Task");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskInput.value,
    date: taskDate.value,
    priority: priority.value,
    completed:false
  };

  tasks.push(task);

  saveTasks();

  renderTasks();

  taskInput.value = "";
  taskDate.value = "";
}

function renderTasks(){

  taskList.innerHTML = "";

  const search = searchInput.value.toLowerCase();

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(search)
  );

  if(filteredTasks.length === 0){
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  filteredTasks.forEach(task => {

    const li = document.createElement("li");

    li.className = task.completed ? "task completed" : "task";

    li.innerHTML = `
      <div class="task-info">
        <h3>${task.text}</h3>
        <p>${task.date || "No Date"}</p>
        <small>Priority: ${task.priority}</small>
      </div>

      <div class="task-buttons">

        <button class="complete-btn"
        onclick="toggleComplete(${task.id})">
        <i class="fa-solid fa-check"></i>
        </button>

        <button class="edit-btn"
        onclick="editTask(${task.id})">
        <i class="fa-solid fa-pen"></i>
        </button>

        <button class="delete-btn"
        onclick="deleteTask(${task.id})">
        <i class="fa-solid fa-trash"></i>
        </button>

      </div>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

function toggleComplete(id){

  tasks = tasks.map(task => {
    if(task.id === id){
      task.completed = !task.completed;
    }
    return task;
  });

  saveTasks();

  renderTasks();
}

function editTask(id){

  const task = tasks.find(task => task.id === id);

  const newTask = prompt("Edit Task", task.text);

  if(newTask !== null){
    task.text = newTask;
  }

  saveTasks();

  renderTasks();
}

function deleteTask(id){

  tasks = tasks.filter(task => task.id !== id);

  saveTasks();

  renderTasks();
}

function updateStats(){

  const total = tasks.length;

  const completed = tasks.filter(task => task.completed).length;

  const pending = total - completed;

  document.getElementById("totalTasks").innerText = total;

  document.getElementById("completedTasks").innerText = completed;

  document.getElementById("pendingTasks").innerText = pending;

  const progress = total === 0
  ? 0
  : (completed / total) * 100;

  document.getElementById("progressBar")
  .style.width = `${progress}%`;
}

function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}