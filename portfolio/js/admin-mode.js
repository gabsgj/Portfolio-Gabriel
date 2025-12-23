/**
 * PORTFOLIO SYSTEM - ADMIN MODE
 * Hidden local editing mode for development
 * Trigger: Ctrl+Shift+A
 * WARNING: For local development only - do not enable on production!
 */

let isAdminMode = false;
let exportButton = null;
let originalData = {};

/**
 * Initialize admin mode listener
 */
export function initAdminMode() {
    document.addEventListener('keydown', handleKeyDown);
    console.log('[ADMIN] Admin mode listener initialized. Press Ctrl+Shift+A to activate.');
}

/**
 * Handle keyboard shortcut
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyDown(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleAdminMode();
    }

    // ESC to exit admin mode
    if (e.key === 'Escape' && isAdminMode) {
        disableAdminMode();
    }
}

/**
 * Toggle admin mode on/off
 */
function toggleAdminMode() {
    if (isAdminMode) {
        disableAdminMode();
    } else {
        enableAdminMode();
    }
}

/**
 * Enable admin mode
 */
function enableAdminMode() {
    isAdminMode = true;
    document.body.classList.add('admin-mode');

    // Make editable elements contenteditable
    document.querySelectorAll('[data-editable]').forEach(el => {
        el.contentEditable = 'true';
        el.classList.add('cursor-text');

        // Store original content
        originalData[el.dataset.editable] = el.textContent;
    });

    // Create admin toolbar
    createAdminToolbar();

    // Show notification
    showAdminNotification('ADMIN MODE ENABLED', 'Edit content directly. Press ESC to exit.');

    console.log('[ADMIN] Admin mode enabled');
}

/**
 * Disable admin mode
 */
function disableAdminMode() {
    isAdminMode = false;
    document.body.classList.remove('admin-mode');

    // Remove contenteditable
    document.querySelectorAll('[data-editable]').forEach(el => {
        el.contentEditable = 'false';
        el.classList.remove('cursor-text');
    });

    // Remove toolbar
    removeAdminToolbar();

    console.log('[ADMIN] Admin mode disabled');
}

/**
 * Create admin toolbar
 */
function createAdminToolbar() {
    const toolbar = document.createElement('div');
    toolbar.id = 'admin-toolbar';
    toolbar.className = 'fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-surface-dark border border-primary/30 p-2 rounded shadow-lg';
    toolbar.innerHTML = `
        <span class="text-[10px] font-mono text-primary uppercase tracking-wider">ADMIN MODE</span>
        <div class="w-[1px] h-4 bg-border-dark mx-2"></div>
        <button id="admin-export" class="px-3 py-1.5 bg-primary text-black text-[10px] font-mono font-bold uppercase hover:bg-white transition-colors">
            EXPORT DATA
        </button>
        <button id="admin-reset" class="px-3 py-1.5 border border-gray-600 text-gray-400 text-[10px] font-mono uppercase hover:text-white hover:border-white transition-colors">
            RESET
        </button>
        <button id="admin-close" class="px-2 py-1.5 text-gray-400 hover:text-white transition-colors">
            <span class="material-symbols-outlined text-sm">close</span>
        </button>
    `;

    document.body.appendChild(toolbar);

    // Add event listeners
    document.getElementById('admin-export').addEventListener('click', exportData);
    document.getElementById('admin-reset').addEventListener('click', resetData);
    document.getElementById('admin-close').addEventListener('click', disableAdminMode);
}

/**
 * Remove admin toolbar
 */
function removeAdminToolbar() {
    const toolbar = document.getElementById('admin-toolbar');
    if (toolbar) {
        toolbar.remove();
    }
}

/**
 * Export edited data
 */
function exportData() {
    const editedData = {};

    document.querySelectorAll('[data-editable]').forEach(el => {
        const key = el.dataset.editable;
        const value = el.textContent.trim();

        // Only include changed values
        if (value !== originalData[key]) {
            editedData[key] = value;
        }
    });

    if (Object.keys(editedData).length === 0) {
        showAdminNotification('NO CHANGES', 'No edits detected.', 'warning');
        return;
    }

    // Create downloadable JSON
    const dataStr = JSON.stringify(editedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-edits-${Date.now()}.json`;
    link.click();

    // Also log to console
    console.log('[ADMIN] Exported data:', editedData);

    showAdminNotification('EXPORT COMPLETE', 'Check downloads folder.');
}

/**
 * Reset to original data
 */
function resetData() {
    document.querySelectorAll('[data-editable]').forEach(el => {
        const key = el.dataset.editable;
        if (originalData[key]) {
            el.textContent = originalData[key];
        }
    });

    showAdminNotification('DATA RESET', 'All edits reverted.');
}

/**
 * Show admin notification
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, warning, error)
 */
function showAdminNotification(title, message, type = 'success') {
    // Remove existing notification
    const existing = document.getElementById('admin-notification');
    if (existing) existing.remove();

    const colors = {
        success: 'border-emerald-500 text-emerald-500',
        warning: 'border-amber-500 text-amber-500',
        error: 'border-red-500 text-red-500'
    };

    const notification = document.createElement('div');
    notification.id = 'admin-notification';
    notification.className = `fixed top-20 right-4 z-50 bg-surface-dark border ${colors[type]} p-4 shadow-lg animate-fade-in`;
    notification.innerHTML = `
        <div class="text-xs font-mono font-bold uppercase mb-1">${title}</div>
        <div class="text-[10px] font-mono text-gray-400">${message}</div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Auto-initialize on load (Development only)
if (typeof window !== 'undefined') {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isDev) {
        initAdminMode();
    } else {
        console.log('[ADMIN] Admin mode disabled (Production environment)');
    }
}
