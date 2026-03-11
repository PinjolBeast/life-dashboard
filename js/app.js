/**
 * Life Dashboard - JavaScript
 * Handles all interactive functionality
 */

// ========================================
// Storage Keys
// ========================================
const STORAGE_KEYS = {
    NAME: 'lifedashboard_name',
    TASKS: 'lifedashboard_tasks',
    LINKS: 'lifedashboard_links',
    TIMER_DURATION: 'lifedashboard_timerDuration',
    THEME: 'lifedashboard_theme'
};

// Default data
const DEFAULT_LINKS = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'YouTube', url: 'https://www.youtube.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Gmail', url: 'https://mail.google.com' }
];

// ========================================
// State
// ========================================
let state = {
    tasks: [],
    links: [],
    timerDuration: 25,
    timerRemaining: 25 * 60,
    timerInterval: null,
    timerRunning: false,
    theme: 'light',
    name: ''
};

// ========================================
// DOM Elements
// ========================================
const elements = {
    // Header
    greeting: document.getElementById('greeting'),
    date: document.getElementById('date'),
    time: document.getElementById('time'),
    settingsBtn: document.getElementById('settingsBtn'),
    
    // Timer
    timerDisplay: document.getElementById('timerDisplay'),
    timerProgress: document.getElementById('timerProgress'),
    startBtn: document.getElementById('startBtn'),
    resetBtn: document.getElementById('resetBtn'),
    durationSelect: document.getElementById('durationSelect'),
    
    // Todo
    todoInput: document.getElementById('todoInput'),
    addTodoBtn: document.getElementById('addTodoBtn'),
    todoList: document.getElementById('todoList'),
    todoEmpty: document.getElementById('todoEmpty'),
    clearCompletedBtn: document.getElementById('clearCompletedBtn'),
    
    // Links
    linksGrid: document.getElementById('linksGrid'),
    addLinkBtn: document.getElementById('addLinkBtn'),
    
    // Settings Modal
    settingsModal: document.getElementById('settingsModal'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    nameInput: document.getElementById('nameInput'),
    lightThemeBtn: document.getElementById('lightThemeBtn'),
    darkThemeBtn: document.getElementById('darkThemeBtn'),
    cancelSettingsBtn: document.getElementById('cancelSettingsBtn'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    
    // Add Link Modal
    addLinkModal: document.getElementById('addLinkModal'),
    closeAddLinkBtn: document.getElementById('closeAddLinkBtn'),
    linkNameInput: document.getElementById('linkNameInput'),
    linkUrlInput: document.getElementById('linkUrlInput'),
    cancelAddLinkBtn: document.getElementById('cancelAddLinkBtn'),
    saveLinkBtn: document.getElementById('saveLinkBtn'),
    
    // Timer Complete Modal
    timerCompleteModal: document.getElementById('timerCompleteModal'),
    closeTimerModalBtn: document.getElementById('closeTimerModalBtn'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// ========================================
// Utility Functions
// ========================================
function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function loadFromStorage(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return defaultValue;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
}

function getFormattedDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// ========================================
// Clock & Date
// ========================================
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    elements.time.textContent = timeString;
    elements.date.textContent = getFormattedDate();
    
    // Update greeting
    const greeting = getGreeting();
    const namePart = state.name ? `, ${state.name}` : '';
    elements.greeting.textContent = `${greeting}${namePart}!`;
}

// ========================================
// Timer Functions
// ========================================
function updateTimerDisplay() {
    elements.timerDisplay.textContent = formatTime(state.timerRemaining);
    
    // Update progress ring
    const totalSeconds = state.timerDuration * 60;
    const progress = state.timerRemaining / totalSeconds;
    const circumference = 2 * Math.PI * 90;
    const offset = circumference * (1 - progress);
    elements.timerProgress.style.strokeDashoffset = offset;
    
    // Add active class when running
    if (state.timerRunning) {
        elements.timerProgress.classList.add('active');
    } else {
        elements.timerProgress.classList.remove('active');
    }
}

function startTimer() {
    if (state.timerRemaining <= 0) return;
    
    state.timerRunning = true;
    elements.startBtn.textContent = 'Pause';
    
    state.timerInterval = setInterval(() => {
        state.timerRemaining--;
        updateTimerDisplay();
        
        if (state.timerRemaining <= 0) {
            clearInterval(state.timerInterval);
            state.timerRunning = false;
            elements.startBtn.textContent = 'Start';
            showTimerComplete();
        }
    }, 1000);
    
    updateTimerDisplay();
}

function pauseTimer() {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    elements.startBtn.textContent = 'Start';
    updateTimerDisplay();
}

function resetTimer() {
    pauseTimer();
    state.timerRemaining = state.timerDuration * 60;
    updateTimerDisplay();
}

function setTimerDuration(minutes) {
    state.timerDuration = minutes;
    state.timerRemaining = minutes * 60;
    saveToStorage(STORAGE_KEYS.TIMER_DURATION, minutes);
    updateTimerDisplay();
}

function showTimerComplete() {
    elements.timerCompleteModal.classList.add('active');
    // Play notification sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Audio not supported, ignore
    }
}

function closeTimerCompleteModal() {
    elements.timerCompleteModal.classList.remove('active');
    resetTimer();
}

// ========================================
// To-Do Functions
// ========================================
function renderTasks() {
    elements.todoList.innerHTML = '';
    
    // Sort tasks: incomplete first, then completed
    const sortedTasks = [...state.tasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });
    
    if (sortedTasks.length === 0) {
        elements.todoEmpty.classList.remove('hidden');
    } else {
        elements.todoEmpty.classList.add('hidden');
        
        sortedTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.dataset.index = index;
            
            li.innerHTML = `
                <div class="todo-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle"></div>
                <span class="todo-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</span>
                <div class="todo-actions">
                    <button class="btn-icon edit" data-action="edit" aria-label="Edit task">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete" data-action="delete" aria-label="Delete task">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;
            
            elements.todoList.appendChild(li);
        });
    }
    
    // Show/hide clear completed button
    const hasCompleted = state.tasks.some(t => t.completed);
    elements.clearCompletedBtn.style.display = hasCompleted ? 'block' : 'none';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addTask(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return false;
    
    // Check for duplicate (case-insensitive)
    const isDuplicate = state.tasks.some(
        task => task.text.toLowerCase() === trimmedText.toLowerCase()
    );
    
    if (isDuplicate) {
        showToast('Task already exists!');
        return false;
    }
    
    state.tasks.push({
        text: trimmedText,
        completed: false,
        createdAt: Date.now()
    });
    
    saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
    renderTasks();
    return true;
}

function toggleTask(index) {
    state.tasks[index].completed = !state.tasks[index].completed;
    saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
    renderTasks();
}

function editTask(index, newText) {
    const trimmedText = newText.trim();
    if (!trimmedText) return false;
    
    // Check for duplicate (excluding current task)
    const isDuplicate = state.tasks.some(
        (task, i) => i !== index && task.text.toLowerCase() === trimmedText.toLowerCase()
    );
    
    if (isDuplicate) {
        showToast('Task already exists!');
        return false;
    }
    
    state.tasks[index].text = trimmedText;
    saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
    renderTasks();
    return true;
}

function deleteTask(index) {
    state.tasks.splice(index, 1);
    saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
    renderTasks();
}

function clearCompletedTasks() {
    state.tasks = state.tasks.filter(task => !task.completed);
    saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
    renderTasks();
    showToast('Completed tasks cleared');
}

// ========================================
// Quick Links Functions
// ========================================
function renderLinks() {
    elements.linksGrid.innerHTML = '';
    
    if (state.links.length === 0) {
        state.links = [...DEFAULT_LINKS];
        saveToStorage(STORAGE_KEYS.LINKS, state.links);
    }
    
    state.links.forEach((link, index) => {
        const div = document.createElement('div');
        div.className = 'link-item';
        div.innerHTML = `
            <div class="link-favicon">${link.name.charAt(0).toUpperCase()}</div>
            <span class="link-name">${escapeHtml(link.name)}</span>
            <button class="link-delete" data-index="${index}" aria-label="Delete link">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        // Click to open link (except delete button)
        div.addEventListener('click', (e) => {
            if (!e.target.closest('.link-delete')) {
                window.open(link.url, '_blank');
            }
        });
        
        elements.linksGrid.appendChild(div);
    });
}

function addLink(name, url) {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    
    if (!trimmedName || !trimmedUrl) {
        showToast('Please fill in all fields');
        return false;
    }
    
    // Validate URL
    try {
        new URL(trimmedUrl);
    } catch (e) {
        showToast('Please enter a valid URL');
        return false;
    }
    
    // Check for duplicate
    const isDuplicate = state.links.some(
        link => link.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (isDuplicate) {
        showToast('Link already exists!');
        return false;
    }
    
    state.links.push({ name: trimmedName, url: trimmedUrl });
    saveToStorage(STORAGE_KEYS.LINKS, state.links);
    renderLinks();
    return true;
}

function deleteLink(index) {
    state.links.splice(index, 1);
    saveToStorage(STORAGE_KEYS.LINKS, state.links);
    renderLinks();
}

// ========================================
// Theme Functions
// ========================================
function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    saveToStorage(STORAGE_KEYS.THEME, theme);
    
    // Update theme buttons
    if (theme === 'dark') {
        elements.darkThemeBtn.classList.add('active');
        elements.lightThemeBtn.classList.remove('active');
    } else {
        elements.lightThemeBtn.classList.add('active');
        elements.darkThemeBtn.classList.remove('active');
    }
}

// ========================================
// Settings Functions
// ========================================
function openSettings() {
    elements.nameInput.value = state.name;
    setTheme(state.theme);
    elements.settingsModal.classList.add('active');
}

function closeSettings() {
    elements.settingsModal.classList.remove('active');
}

function saveSettings() {
    state.name = elements.nameInput.value.trim();
    saveToStorage(STORAGE_KEYS.NAME, state.name);
    updateClock();
    closeSettings();
    showToast('Settings saved');
}

// ========================================
// Add Link Modal Functions
// ========================================
function openAddLinkModal() {
    elements.linkNameInput.value = '';
    elements.linkUrlInput.value = '';
    elements.addLinkModal.classList.add('active');
    setTimeout(() => elements.linkNameInput.focus(), 100);
}

function closeAddLinkModal() {
    elements.addLinkModal.classList.remove('active');
}

function saveNewLink() {
    const name = elements.linkNameInput.value;
    const url = elements.linkUrlInput.value;
    
    if (addLink(name, url)) {
        closeAddLinkModal();
        showToast('Link added successfully');
    }
}

// ========================================
// Event Listeners
// ========================================
function initEventListeners() {
    // Clock
    setInterval(updateClock, 1000);
    
    // Timer
    elements.startBtn.addEventListener('click', () => {
        if (state.timerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
    
    elements.resetBtn.addEventListener('click', resetTimer);
    
    elements.durationSelect.addEventListener('change', (e) => {
        if (!state.timerRunning) {
            setTimerDuration(parseInt(e.target.value));
        }
    });
    
    elements.closeTimerModalBtn.addEventListener('click', closeTimerCompleteModal);
    
    // Todo
    elements.addTodoBtn.addEventListener('click', () => {
        if (addTask(elements.todoInput.value)) {
            elements.todoInput.value = '';
        }
    });
    
    elements.todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (addTask(elements.todoInput.value)) {
                elements.todoInput.value = '';
            }
        }
    });
    
    elements.todoList.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]');
        if (!action) return;
        
        const li = action.closest('.todo-item');
        const index = parseInt(li.dataset.index);
        const actionType = action.dataset.action;
        
        if (actionType === 'toggle') {
            toggleTask(index);
        } else if (actionType === 'edit') {
            // Enter edit mode
            const textSpan = li.querySelector('.todo-text');
            const currentText = state.tasks[index].text;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'todo-edit-input';
            input.value = currentText;
            
            textSpan.replaceWith(input);
            input.focus();
            input.select();
            
            const saveEdit = () => {
                const newText = input.value;
                if (editTask(index, newText)) {
                    // Edit saved
                }
            };
            
            const cancelEdit = () => {
                renderTasks();
            };
            
            input.addEventListener('blur', saveEdit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') saveEdit();
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') cancelEdit();
            });
        } else if (actionType === 'delete') {
            deleteTask(index);
        }
    });
    
    elements.clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    // Quick Links
    elements.addLinkBtn.addEventListener('click', openAddLinkModal);
    
    elements.linksGrid.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.link-delete');
        if (deleteBtn) {
            const index = parseInt(deleteBtn.dataset.index);
            deleteLink(index);
        }
    });
    
    // Settings Modal
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.closeSettingsBtn.addEventListener('click', closeSettings);
    elements.cancelSettingsBtn.addEventListener('click', closeSettings);
    elements.saveSettingsBtn.addEventListener('click', saveSettings);
    
    elements.settingsModal.addEventListener('click', (e) => {
        if (e.target === elements.settingsModal) {
            closeSettings();
        }
    });
    
    // Theme buttons
    elements.lightThemeBtn.addEventListener('click', () => setTheme('light'));
    elements.darkThemeBtn.addEventListener('click', () => setTheme('dark'));
    
    // Add Link Modal
    elements.closeAddLinkBtn.addEventListener('click', closeAddLinkModal);
    elements.cancelAddLinkBtn.addEventListener('click', closeAddLinkModal);
    elements.saveLinkBtn.addEventListener('click', saveNewLink);
    
    elements.addLinkModal.addEventListener('click', (e) => {
        if (e.target === elements.addLinkModal) {
            closeAddLinkModal();
        }
    });
    
    elements.linkUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveNewLink();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape to close modals
        if (e.key === 'Escape') {
            closeSettings();
            closeAddLinkModal();
            closeTimerCompleteModal();
        }
        
        // Ctrl/Cmd + N for new task
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            elements.todoInput.focus();
        }
    });
}

// ========================================
// Initialize App
// ========================================
function init() {
    // Load data from storage
    state.name = loadFromStorage(STORAGE_KEYS.NAME, '');
    state.tasks = loadFromStorage(STORAGE_KEYS.TASKS, []);
    state.links = loadFromStorage(STORAGE_KEYS.LINKS, []);
    state.timerDuration = loadFromStorage(STORAGE_KEYS.TIMER_DURATION, 25);
    state.theme = loadFromStorage(STORAGE_KEYS.THEME, 'light');
    
    // Initialize timer
    state.timerRemaining = state.timerDuration * 60;
    
    // Apply theme
    setTheme(state.theme);
    
    // Update duration select
    elements.durationSelect.value = state.timerDuration;
    
    // Render components
    updateClock();
    updateTimerDisplay();
    renderTasks();
    renderLinks();
    
    // Initialize event listeners
    initEventListeners();
}

// Start the app
document.addEventListener('DOMContentLoaded', init);

