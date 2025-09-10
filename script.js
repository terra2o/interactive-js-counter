// script.js
// Counter application with history tracking and theme support

// DOM element references
const counterDisplay = document.getElementById('counter-value');
const decrementButton = document.getElementById('decrement-btn');
const resetButton = document.getElementById('reset-btn');
const incrementButton = document.getElementById('increment-btn');
const decrement5Button = document.getElementById('decrement5-btn');
const increment5Button = document.getElementById('increment5-btn');
const popupButton = document.getElementById('popup-button');
const popupContainer = document.getElementById('popup-container');
const popupClose = document.getElementById('popup-close');
const limitInput = document.getElementById('limit-size');
const historyPanel = document.getElementById('history-panel');
const historyToggle = document.getElementById('history-toggle');
const lightModeBtn = document.getElementById('light-mode-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');

// Application state
let count = 0;
let history = [];

// Initialize counter value from localStorage if available
const savedCount = localStorage.getItem('myCounterValue');
if (savedCount !== null) {
    count = parseInt(savedCount);
}

// Initialize history from localStorage if available
const savedHistory = localStorage.getItem('counterHistory');
if (savedHistory) {
    history = JSON.parse(savedHistory);
}

/**
 * Applies the specified theme and updates UI accordingly
 * @param {string} theme - Theme name ('light' or 'dark')
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update button visual states to indicate active theme
    if (theme === 'dark') {
        darkModeBtn.style.opacity = '0.7';
        lightModeBtn.style.opacity = '1';
    } else {
        lightModeBtn.style.opacity = '0.7';
        darkModeBtn.style.opacity = '1';
    }
}

// Theme button event handlers
lightModeBtn.addEventListener('click', () => {
    setTheme('light');
});

darkModeBtn.addEventListener('click', () => {
    setTheme('dark');
});

/**
 * Initializes theme based on user preference or saved setting
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

// Check if history panel was previously collapsed and restore state
const historyCollapsed = localStorage.getItem('historyCollapsed') === 'true';
if (historyCollapsed) {
    historyPanel.classList.add('collapsed');
}

// Toggle history panel visibility and persist state
historyToggle.addEventListener('click', function() {
    historyPanel.classList.toggle('collapsed');
    localStorage.setItem('historyCollapsed', historyPanel.classList.contains('collapsed'));
});

/**
 * Retrieves the current counter limit from settings
 * @returns {number} The current limit value
 */
function getLimit() {
    if (limitInput && limitInput.value) {
        const limit = parseInt(limitInput.value);
        return isNaN(limit) || limit < 1 ? 10 : limit;
    }
    return 10; // Default fallback limit
}

/**
 * Toggles the settings popup visibility
 */
function togglePopup() {
    popupContainer.classList.toggle('active');
}

// Settings popup event handlers
popupButton.addEventListener('click', function(event) {
    event.stopPropagation();
    togglePopup();
});

popupClose.addEventListener('click', function(event) {
    event.stopPropagation();
    togglePopup();
});

// Close popup when clicking outside or pressing Escape
document.addEventListener('click', function(event) {
    if (popupContainer.classList.contains('active') && 
        !popupContainer.contains(event.target) && 
        event.target !== popupButton) {
        togglePopup();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && popupContainer.classList.contains('active')) {
        togglePopup();
    }
});

/**
 * Updates the counter display with current value and appropriate color
 */
function updateDisplay() {
    counterDisplay.textContent = count;

    // Color coding based on counter value
    if (count > 0) {
        counterDisplay.style.color = 'green';
    } else if (count < 0) {
        counterDisplay.style.color = 'red';
    } else {
        counterDisplay.style.color = 'gray';
    }
}

/**
 * Applies a visual bump effect to the counter display
 */
function applyBumpEffect() {
    counterDisplay.classList.add('bump');
    setTimeout(() => {
        counterDisplay.classList.remove('bump');
    }, 300);
}

/**
 * Adds an entry to the history log
 * @param {string} action - Description of the action performed
 * @param {string} type - Type of action (increment, decrement, reset)
 */
function addHistoryEntry(action, type) {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    
    // Add new entry to beginning of history array
    history.unshift({ 
        action: `${action} ${count}`, 
        timestamp,
        type 
    });
    
    // Maintain history size limit (10 entries)
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    // Persist history to localStorage
    localStorage.setItem('counterHistory', JSON.stringify(history));
    
    // Refresh history display
    updateHistoryLog();
}

/**
 * Updates the history log UI with current history entries
 */
function updateHistoryLog() {
    const historyLog = document.getElementById('history-log');
    if (historyLog) {
        historyLog.innerHTML = '';
        
        // Create list items for each history entry
        history.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.timestamp}: ${entry.action}`;
            historyLog.appendChild(listItem);
        });
    }
}

// Counter button event handlers with validation
decrementButton.addEventListener('click', () => {
    const limit = getLimit();
    if (count > -limit) {
        count--;
        updateDisplay();
        applyBumpEffect();
        addHistoryEntry('Decremented to', 'decrement');
    } else {
        alert(`Counter cannot go below -${limit}`);
    }
    saveCounterValue();
});

incrementButton.addEventListener('click', () => {
    const limit = getLimit();
    if (count < limit) {
        count++;
        updateDisplay();
        applyBumpEffect();
        addHistoryEntry('Incremented to', 'increment');
    } else {
        alert(`Counter cannot exceed ${limit}`);
    }
    saveCounterValue();
});

increment5Button.addEventListener('click', () => {
    const limit = getLimit();
    if (count <= limit - 5) {
        count += 5;
        updateDisplay();
        applyBumpEffect();
        addHistoryEntry('Increased by 5 to', 'increment');
    } else {
        alert(`Counter cannot exceed ${limit}`);
    }
    saveCounterValue();
});

decrement5Button.addEventListener('click', () => {
    const limit = getLimit();
    if (count >= -limit + 5) {
        count -= 5;
        updateDisplay();
        applyBumpEffect();
        addHistoryEntry('Decreased by 5 to', 'decrement');
    } else {
        alert(`Counter cannot go below -${limit}`);
    }
    saveCounterValue();
});

resetButton.addEventListener('click', () => {
    count = 0;
    updateDisplay();
    applyBumpEffect();
    addHistoryEntry('Reset to', 'reset');
    saveCounterValue();
});

// Keyboard shortcut support
document.addEventListener('keydown', (event) => {
    const limit = getLimit();
    if (event.key === '-') {
        if (count > -limit) {
            count--;
            updateDisplay();
            applyBumpEffect();
            addHistoryEntry('Decremented to', 'decrement');
        } else {
            alert(`Counter cannot go below -${limit}`);
        }
        saveCounterValue();
    } else if (event.key === '+' || event.key === '=') {
        if (count < limit) {
            count++;
            updateDisplay();
            applyBumpEffect();
            addHistoryEntry('Incremented to', 'increment');
        } else {
            alert(`Counter cannot exceed ${limit}`);
        }
        saveCounterValue();
    } else if (event.key === 'r' || event.key === 'R') {
        count = 0;
        updateDisplay();
        applyBumpEffect();
        addHistoryEntry('Reset to', 'reset');
        saveCounterValue();
    }
});

/**
 * Saves the current counter value to localStorage
 */
function saveCounterValue() {
    localStorage.setItem('myCounterValue', count);
}

// Initialize application
initTheme();
updateHistoryLog();
updateDisplay();