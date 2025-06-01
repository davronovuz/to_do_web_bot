const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');

let tasks = [];

// Telegram WebApp init
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand(); // Full screen

// Add new task
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

// Render all tasks
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
                <span style="${task.completed ? 'text-decoration: line-through; color: gray;' : ''}">
                    ${task.text}
                </span>
            </div>
            <button onclick="deleteTask(${task.id})">O'chirish</button>
        `;
        taskList.appendChild(li);
    });

    updateStats();
}

// Toggle task complete/incomplete
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

// Update task counters
function updateStats() {
    totalTasksSpan.textContent = tasks.length;
    completedTasksSpan.textContent = tasks.filter(task => task.completed).length;
}

// Sync button
function syncTasks() {
    tg.sendData(JSON.stringify({ action: 'sync' }));
}

// Main button
tg.MainButton.setText('Sinxronlash').show();
tg.onEvent('mainButtonClicked', syncTasks);

// Auto sync on load
syncTasks();
