/**
 * PORTFOLIO SYSTEM - CORE MODULE
 * Shared utilities, navigation, and background effects
 */

// ============================================
// CACHING SYSTEM
// ============================================

const CACHE_VERSION = 'v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const memoryCache = new Map();

/**
 * Get cached data from memory or localStorage
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null
 */
function getCachedData(key) {
    // Check memory cache first (fastest)
    if (memoryCache.has(key)) {
        const { data, timestamp } = memoryCache.get(key);
        if (Date.now() - timestamp < CACHE_TTL) {
            return data;
        }
        memoryCache.delete(key);
    }

    // Check localStorage (persists across page navigations)
    try {
        const stored = localStorage.getItem(`portfolio_${CACHE_VERSION}_${key}`);
        if (stored) {
            const { data, timestamp } = JSON.parse(stored);
            if (Date.now() - timestamp < CACHE_TTL) {
                // Restore to memory cache for faster subsequent access
                memoryCache.set(key, { data, timestamp });
                return data;
            }
            // Clean up expired data
            localStorage.removeItem(`portfolio_${CACHE_VERSION}_${key}`);
        }
    } catch (e) {
        // localStorage may be unavailable or full
    }

    return null;
}

/**
 * Store data in cache (both memory and localStorage)
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
function setCachedData(key, data) {
    const timestamp = Date.now();
    memoryCache.set(key, { data, timestamp });

    try {
        localStorage.setItem(
            `portfolio_${CACHE_VERSION}_${key}`,
            JSON.stringify({ data, timestamp })
        );
    } catch (e) {
        // localStorage may be full or unavailable
    }
}

/**
 * Clear all portfolio cache data
 */
export function clearCache() {
    memoryCache.clear();
    try {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('portfolio_')) {
                localStorage.removeItem(key);
            }
        });
    } catch (e) { }
    console.log('[CACHE] Cleared');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Fetch JSON data from a path (with caching)
 * @param {string} path - Path to JSON file
 * @returns {Promise<any>} Parsed JSON data
 */
export async function loadJSON(path) {
    // Check cache first
    const cached = getCachedData(path);
    if (cached) {
        console.log(`[CACHE] Hit: ${path}`);
        return cached;
    }

    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCachedData(path, data);
        console.log(`[CACHE] Miss, stored: ${path}`);
        return data;
    } catch (error) {
        console.error(`[SYSTEM] Failed to load ${path}:`, error);
        return null;
    }
}

/**
 * Fetch Markdown content from a path (with caching)
 * @param {string} path - Path to markdown file
 * @returns {Promise<string>} Raw markdown content
 */
export async function loadMarkdown(path) {
    // Check cache first
    const cached = getCachedData(path);
    if (cached) {
        console.log(`[CACHE] Hit: ${path}`);
        return cached;
    }

    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setCachedData(path, text);
        console.log(`[CACHE] Miss, stored: ${path}`);
        return text;
    } catch (error) {
        console.error(`[SYSTEM] Failed to load ${path}:`, error);
        return null;
    }
}

/**
 * Simple markdown to HTML converter (basic support)
 * @param {string} markdown - Raw markdown text
 * @returns {string} HTML string
 */
export function parseMarkdown(markdown) {
    if (!markdown) return '';

    return markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-white mt-6 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-medium text-white mt-8 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-medium text-white mb-4">$1</h1>')
        // Bold and Italic
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code blocks
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-surface-dark border border-border-dark p-4 my-4 overflow-x-auto"><code class="text-sm font-mono text-gray-300">$2</code></pre>')
        // Inline code
        .replace(/`(.*?)`/g, '<code class="bg-surface-dark px-1 py-0.5 text-primary font-mono text-sm">$1</code>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')
        // Lists
        .replace(/^\- (.*$)/gim, '<li class="text-gray-400 ml-4">$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li class="text-gray-400 ml-4 list-decimal">$1</li>')
        // Horizontal rule
        .replace(/^---$/gim, '<hr class="border-border-dark my-6"/>')
        // Paragraphs
        .replace(/\n\n/g, '</p><p class="text-gray-400 leading-relaxed mb-4">')
        // Line breaks
        .replace(/\n/g, '<br/>');
}

/**
 * Get status color class based on status string
 * @param {string} status - Status string
 * @returns {string} Tailwind color class
 */
export function getStatusColor(status) {
    const statusMap = {
        'DEPLOYED': 'text-emerald-500',
        'deployed': 'text-emerald-500',
        'EXPERIMENT': 'text-amber-500',
        'experiment': 'text-amber-500',
        'ARCHIVED': 'text-gray-500',
        'archived': 'text-gray-500',
        'training': 'text-emerald-500',
        'live': 'text-emerald-500',
        'prototype': 'text-gray-500',
        'dormant': 'text-gray-500',
        'research': 'text-blue-400'
    };
    return statusMap[status] || 'text-gray-500';
}

/**
 * Get status background class
 * @param {string} status - Status string
 * @returns {string} Tailwind background class
 */
export function getStatusBgColor(status) {
    const statusMap = {
        'DEPLOYED': 'bg-emerald-500/10 border-emerald-500/20',
        'deployed': 'bg-emerald-500/10 border-emerald-500/20',
        'EXPERIMENT': 'bg-amber-500/10 border-amber-500/20',
        'experiment': 'bg-amber-500/10 border-amber-500/20',
        'training': 'bg-emerald-500/10 border-emerald-500/20',
        'live': 'bg-emerald-500/10 border-emerald-500/20',
        'research': 'bg-blue-500/10 border-blue-500/20'
    };
    return statusMap[status] || 'bg-gray-800 border-gray-700';
}

// ============================================
// BACKGROUND EFFECTS
// ============================================

/**
 * Create and inject background effect elements
 */
export function createBackground() {
    const body = document.body;

    // Grid background
    const gridBg = document.createElement('div');
    gridBg.className = 'grid-bg';
    body.insertBefore(gridBg, body.firstChild);

    // Gradient overlay
    const gradientOverlay = document.createElement('div');
    gradientOverlay.className = 'gradient-overlay';
    body.insertBefore(gradientOverlay, body.firstChild.nextSibling);

    // Scanline
    const scanline = document.createElement('div');
    scanline.className = 'scanline';
    body.appendChild(scanline);

    // CRT overlay
    const crtOverlay = document.createElement('div');
    crtOverlay.className = 'crt-overlay';
    body.appendChild(crtOverlay);
}

// ============================================
// NAVIGATION
// ============================================

/**
 * Navigation configuration
 */
export const NAV_ITEMS = [
    { label: 'DASHBOARD', href: 'dashboard.html', icon: 'dashboard' },
    { label: 'PROJECTS', href: 'projects.html', icon: 'deployed_code' },
    { label: 'SKILLS', href: 'skills.html', icon: 'psychology' },
    { label: 'EXPERIENCE', href: 'experience.html', icon: 'history_edu' },
    { label: 'LAB', href: 'lab.html', icon: 'science' },
    { label: 'CONTACT', href: 'contact.html', icon: 'mail' }
];

/**
 * Get current page from URL
 * @returns {string} Current page filename
 */
export function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename;
}

/**
 * Create navigation HTML
 * @param {string} currentPage - Current page filename
 * @returns {string} Navigation HTML
 */
export function createNavigation(currentPage) {
    return NAV_ITEMS.map(item => {
        const isActive = currentPage === item.href;
        return `
            <a href="${item.href}" 
               class="nav-link px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-colors
                      ${isActive
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'hover:bg-white/5 text-gray-400 hover:text-white'}">
                ${item.label}
            </a>
        `;
    }).join('');
}

// ============================================
// HEADER COMPONENT
// ============================================

/**
 * Create and inject the standard header
 * @param {Object} options - Header options
 */
export function createHeader(options = {}) {
    const {
        title = 'ROOT@SYSTEM:~',
        showNav = true,
        showStatus = true
    } = options;

    const currentPage = getCurrentPage();

    const headerHTML = `
        <header class="fixed top-0 left-0 right-0 z-40 w-full flex items-center justify-between border-b border-border-dark bg-background-dark/90 backdrop-blur-md px-6 h-14">
            <div class="flex items-center gap-4 text-primary">
                <a href="index.html" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span class="material-symbols-outlined text-lg">terminal</span>
                    <span class="text-xs font-mono font-bold tracking-widest text-white">${title}</span>
                </a>
            </div>
            ${showNav ? `
                <div class="hidden md:flex items-center gap-1 bg-surface-dark border border-border-dark rounded-full px-1 p-1">
                    ${createNavigation(currentPage)}
                </div>
            ` : ''}
            ${showStatus ? `
                <div class="flex items-center gap-6">
                    <div class="hidden md:flex items-center gap-2 text-[10px] font-mono text-gray-500">
                        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span>SYSTEM_NORMAL</span>
                    </div>
                    <div class="text-[10px] font-mono text-primary font-bold border border-primary/20 px-2 py-0.5 rounded bg-primary/5">
                        SECURE
                    </div>
                </div>
            ` : ''}
        </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// ============================================
// FOOTER COMPONENT
// ============================================

/**
 * Create and inject the standard footer decorations
 */
export function createFooterDecorations() {
    const footerHTML = `
        <div class="fixed bottom-6 left-6 hidden md:block z-10 pointer-events-none">
            <div class="flex flex-col gap-1">
                <div class="w-16 h-[1px] bg-gray-800"></div>
                <div class="w-8 h-[1px] bg-gray-800"></div>
                <div class="text-[10px] font-mono text-gray-600 mt-2" id="system-id">ID: 884-29-X</div>
            </div>
        </div>
        <div class="fixed bottom-6 right-6 hidden md:block text-right z-10 pointer-events-none">
            <div class="flex flex-col gap-1 items-end">
                <div class="w-16 h-[1px] bg-gray-800"></div>
                <div class="w-8 h-[1px] bg-gray-800"></div>
                <div class="text-[10px] font-mono text-gray-600 mt-2" id="system-mode">SYS.OP.MODE: VISUAL</div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// ============================================
// BOOT SCREEN
// ============================================

/**
 * Create and show boot screen animation
 * @param {string} message - Boot message to display
 */
export function showBootScreen(message = 'loading kernel...') {
    const bootHTML = `
        <div id="boot-screen">
            <div class="w-64 flex flex-col gap-2">
                <div class="flex justify-between text-[10px] font-mono text-primary tracking-widest uppercase">
                    <span>System Boot</span>
                    <span>v2.4.0</span>
                </div>
                <div class="w-full h-[2px] bg-gray-900 overflow-hidden">
                    <div class="loader-bar h-full"></div>
                </div>
                <div class="font-mono text-[10px] text-gray-500 mt-1 boot-messages">
                    <span class="block">${message}</span>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', bootHTML);

    // Add boot messages with delays
    const messages = [
        { text: 'mounting volumes...', delay: 500 },
        { text: 'verifying credentials...', delay: 1000 },
        { text: 'access granted', delay: 1300, class: 'text-emerald-500' }
    ];

    const container = document.querySelector('.boot-messages');
    messages.forEach(msg => {
        setTimeout(() => {
            const span = document.createElement('span');
            span.className = `block ${msg.class || ''}`;
            span.textContent = msg.text;
            container.appendChild(span);
        }, msg.delay);
    });
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize core system components
 * @param {Object} options - Initialization options
 */
export function initSystem(options = {}) {
    const {
        showBoot = false,
        showHeader = true,
        showFooter = true,
        headerTitle = 'ROOT@SYSTEM:~'
    } = options;

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init());
    } else {
        init();
    }

    function init() {
        if (showBoot) {
            showBootScreen();
        }

        createBackground();

        if (showHeader) {
            createHeader({ title: headerTitle });
        }

        if (showFooter) {
            createFooterDecorations();
        }

        console.log('[SYSTEM] Core initialized');
    }
}

// Auto-log system status
console.log('[SYSTEM] Core module loaded');
