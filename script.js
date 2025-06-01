
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
let tasks = [];

// Telegram Web App initialization
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Add task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    taskInput.value = '';
    renderTasks();
    tg.sendData(JSON.stringify({ action: 'add', task }));
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
                <span>${task.text}</span>
            </div>
            <button onclick="deleteTask(${task.id})">O'chirish</button>
        `;
        taskList.appendChild(li);
    });
    updateStats();
}

// Toggle task completion
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
    tg.sendData(JSON.stringify({ action: 'toggle', id }));
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    tg.sendData(JSON.stringify({ action: 'delete', id }));
}

// Update stats
function updateStats() {
    totalTasksSpan.textContent = tasks.length;
    completedTasksSpan.textContent = tasks.filter(task => task.completed).length;
}

// Sync tasks with bot
function syncTasks() {
    tg.sendData(JSON.stringify({ action: 'sync' }));
}

// Handle backend response (via Telegram messages)
tg.onEvent('mainButtonClicked', syncTasks);
tg.MainButton.setText('Sinxronlash').show();

// Initial sync when Web App opens
syncTasks();
