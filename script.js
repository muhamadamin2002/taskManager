const API_URL = 'https://67f2bef0ec56ec1a36d411d8.mockapi.io/tasks';
const form = document.getElementById('taskForm');
const tasksContainer = document.getElementById('tasksContainer');

const priorityStyles = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-orange-100 text-orange-800',
    low: 'bg-green-100 text-green-800'
};

const statusStyles = {
    ready: 'bg-gray-100 text-gray-800',
    inprogress: 'bg-blue-100 text-blue-800',
    finished: 'bg-green-100 text-green-800',
    deleted: 'bg-red-100 text-red-800'
};

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        let tasks = await response.json();
        const selectedStatus = statusFilter.value;
        if(selectedStatus !== 'all') {
            tasks = tasks.filter(task => task.status === selectedStatus);
        }
        
        tasksContainer.innerHTML = '';
        tasks.forEach(createTaskElement);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function createTaskElement(task) {
    const taskEl = document.createElement('div');
    taskEl.className = 'bg-white p-3 sm:p-4 rounded-lg shadow-md mb-3 sm:mb-4';
    taskEl.innerHTML = `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
            <h3 id="title-${task.id}" class="text-sm sm:text-base font-semibold truncate">${task.title}</h3>
            <div class="flex gap-2">
                <button onclick="editTaskHandler('${task.id}')" 
                    class="text-yellow-600 hover:text-yellow-800 text-sm sm:text-base">Edit</button>
                <button onclick="deleteTask('${task.id}')" 
                    class="text-red-600 hover:text-red-800 text-sm sm:text-base">Delete</button>
            </div>
        </div>
        <div class="flex flex-wrap gap-2">
            <span id="priority-${task.id}" 
                class="${priorityStyles[task.priority]} px-2 py-1 text-xs sm:text-sm rounded-full">
                ${task.priority}
            </span>
            <span id="status-${task.id}" 
                class="${statusStyles[task.status]} px-2 py-1 text-xs sm:text-sm rounded-full">
                ${task.status}
            </span>
        </div>`;
    tasksContainer.appendChild(taskEl);
}

async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

async function editTaskHandler(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const task = await response.json();
        
        document.getElementById('taskId').value = task.id;
        document.getElementById('title').value = task.title;
        document.getElementById('priority').value = task.priority;
        document.getElementById('status').value = task.status;
        
        form.querySelector('button').textContent = 'Update Task';
    } catch (error) {
        console.error('Error fetching task for edit:', error);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taskData = {
        title: document.getElementById('title').value,
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value
    };

    const taskId = document.getElementById('taskId').value;
    const method = taskId ? 'PUT' : 'POST';
    const url = taskId ? `${API_URL}/${taskId}` : API_URL;

    try {
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        
        form.reset();
        document.getElementById('taskId').value = '';
        form.querySelector('button').textContent = 'Add Task';
        fetchTasks();
    } catch (error) {
        console.error('Error submitting task:', error);
    }
});


fetchTasks();