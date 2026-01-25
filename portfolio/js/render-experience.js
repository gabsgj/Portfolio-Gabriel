/**
 * PORTFOLIO SYSTEM - EXPERIENCE RENDERER
 * Renders execution log / timeline from JSON data
 */

import { loadJSON } from './core.js';

let experiences = [];
let currentFilter = 'all';

/**
 * Parse date string to a sortable value (higher = more recent)
 * Handles formats: "2025.04 - PRESENT", "2025.09", "2024 - 2025", "2024"
 */
function parseDateForSort(dateStr) {
    if (!dateStr) return 0;

    // "PRESENT" entries should be at the top
    if (dateStr.toUpperCase().includes('PRESENT')) {
        // Extract the start year/month for secondary sorting among PRESENT entries
        const match = dateStr.match(/(\d{4})\.?(\d{2})?/);
        if (match) {
            const year = parseInt(match[1]);
            const month = match[2] ? parseInt(match[2]) : 1;
            return 100000 + year * 100 + month; // PRESENT entries get priority
        }
        return 100000;
    }

    // For date ranges like "2024 - 2025", use the end date
    // For single dates like "2025.09" or "2024", parse directly
    const parts = dateStr.split('-').map(p => p.trim());
    const relevantPart = parts.length > 1 ? parts[0] : parts[0]; // Use start date for sorting

    const match = relevantPart.match(/(\d{4})\.?(\d{2})?/);
    if (match) {
        const year = parseInt(match[1]);
        const month = match[2] ? parseInt(match[2]) : 1;
        return year * 100 + month;
    }

    return 0;
}

/**
 * Initialize experience page
 */
export async function initExperience() {
    experiences = await loadJSON('../data/experience.json');

    if (!experiences) {
        console.error('[EXPERIENCE] Failed to load experience data');
        return;
    }

    // Sort experiences by date (latest first)
    experiences.sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date));

    renderExperienceTimeline();
    renderSidebar();
    setupFilters();

    console.log(`[EXPERIENCE] Loaded ${experiences.length} entries`);
}

/**
 * Render the experience timeline
 */
function renderExperienceTimeline() {
    const container = document.getElementById('experience-timeline');
    if (!container) return;

    // Filter experiences based on current filter
    const filteredExperiences = currentFilter === 'all' 
        ? experiences 
        : experiences.filter(exp => exp.type === currentFilter);

    if (filteredExperiences.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-gray-500 font-mono text-sm">
                <span class="material-symbols-outlined text-2xl mb-2 block">filter_list_off</span>
                No entries found for this filter
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="absolute left-4 top-4 bottom-0 w-[1px] bg-border-dark lg:left-[17px]"></div>
        ${filteredExperiences.map((exp, i) => renderExperienceEntry(exp, i)).join('')}
    `;
}

/**
 * Setup filter button handlers
 */
function setupFilters() {
    const filterContainer = document.getElementById('experience-filters');
    if (!filterContainer) return;

    filterContainer.addEventListener('click', (e) => {
        const link = e.target.closest('.filter-link');
        if (!link) return;

        const filter = link.dataset.filter;
        if (filter === currentFilter) return;

        // Update active state
        filterContainer.querySelectorAll('.filter-link').forEach(l => {
            l.classList.remove('text-primary');
        });
        link.classList.add('text-primary');

        // Apply filter
        currentFilter = filter;
        renderExperienceTimeline();
    });
}

/**
 * Render a single experience entry
 * @param {Object} exp - Experience data
 * @param {number} index - Entry index for animation delay
 * @returns {string} HTML string
 */
function renderExperienceEntry(exp, index) {
    const delay = 0.1 + (index * 0.1);

    if (exp.type === 'work') {
        return renderWorkEntry(exp, delay);
    } else if (exp.type === 'achievement') {
        return renderAchievementEntry(exp, delay);
    } else if (exp.type === 'opensource') {
        return renderOpenSourceEntry(exp, delay);
    } else if (exp.type === 'certification') {
        return renderCertificationEntry(exp, delay);
    }

    return '';
}

/**
 * Render work experience entry
 */
function renderWorkEntry(exp, delay) {
    return `
        <div class="log-entry group relative pl-12 lg:pl-16 animate-fade-in-up" style="animation-delay: ${delay}s; opacity: 0;">
            <div class="log-marker absolute left-3 top-2 w-2.5 h-2.5 bg-gray-800 border border-gray-600 rounded-full transition-all duration-300 lg:left-[13px] z-10"></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <span class="${exp.colorClass || 'text-primary'} font-mono text-sm">${exp.date}</span>
                <h3 class="text-xl font-medium text-white" data-editable="exp-${exp.title.replace(/\s/g, '-')}-title">${exp.title}</h3>
                <span class="text-xs font-mono text-gray-500 px-2 py-0.5 border border-border-dark rounded bg-surface-dark">${exp.company}</span>
            </div>
            <div class="bg-surface-dark/50 border border-border-dark p-4 rounded-sm hover:border-primary/50 transition-colors duration-300 backdrop-blur-sm">
                <ul class="space-y-2 text-sm text-gray-400 font-light list-disc list-inside marker:text-primary">
                    ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
                ${exp.tech ? `
                    <div class="mt-4 flex gap-2 flex-wrap">
                        ${exp.tech.map(t => `
                            <span class="text-[10px] font-mono text-gray-500 bg-background-dark border border-border-dark px-1.5 py-0.5">${t}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Render achievement entry
 */
function renderAchievementEntry(exp, delay) {
    return `
        <div class="log-entry group relative pl-12 lg:pl-16 animate-fade-in-up" style="animation-delay: ${delay}s; opacity: 0;">
            <div class="log-marker absolute left-3 top-2 w-2.5 h-2.5 bg-gray-800 border border-gray-600 rounded-full transition-all duration-300 lg:left-[13px] z-10"></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <span class="${exp.colorClass || 'text-emerald-500'} font-mono text-sm">${exp.date}</span>
                <h3 class="text-xl font-medium text-white">${exp.title}</h3>
                <span class="text-xs font-mono text-gray-500 px-2 py-0.5 border border-border-dark rounded bg-surface-dark">${exp.company}</span>
            </div>
            <div class="bg-surface-dark/50 border border-border-dark p-4 rounded-sm ${exp.hoverBorderClass || 'hover:border-emerald-500/30'} transition-colors duration-300 backdrop-blur-sm relative overflow-hidden">
                ${exp.icon ? `
                    <div class="absolute top-0 right-0 p-2 opacity-10">
                        <span class="material-symbols-outlined text-4xl">${exp.icon}</span>
                    </div>
                ` : ''}
                <p class="text-sm text-gray-400 font-light mb-2">${exp.description}</p>
                ${exp.award ? `
                    <div class="flex items-center gap-2 text-xs font-mono text-emerald-500/80">
                        <span class="material-symbols-outlined text-[14px]">star</span>
                        <span>${exp.award}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Render open source contribution entry
 */
function renderOpenSourceEntry(exp, delay) {
    return `
        <div class="log-entry group relative pl-12 lg:pl-16 animate-fade-in-up" style="animation-delay: ${delay}s; opacity: 0;">
            <div class="log-marker absolute left-3 top-2 w-2.5 h-2.5 bg-gray-800 border border-gray-600 rounded-full transition-all duration-300 lg:left-[13px] z-10"></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <span class="${exp.colorClass || 'text-purple-400'} font-mono text-sm">${exp.date}</span>
                <h3 class="text-xl font-medium text-white">${exp.title}</h3>
                <span class="text-xs font-mono text-gray-500 px-2 py-0.5 border border-border-dark rounded bg-surface-dark">${exp.company}</span>
            </div>
            <div class="bg-surface-dark/50 border border-border-dark p-4 rounded-sm ${exp.hoverBorderClass || 'hover:border-purple-500/30'} transition-colors duration-300 backdrop-blur-sm">
                <p class="text-sm text-gray-400 font-light mb-2">${exp.description}</p>
                ${exp.stats ? `
                    <div class="flex items-center gap-4 text-xs font-mono mt-3">
                        ${exp.stats.prs ? `
                            <div class="flex items-center gap-1 text-gray-500">
                                <span class="material-symbols-outlined text-[14px]">call_merge</span>
                                <span>${exp.stats.prs}</span>
                            </div>
                        ` : ''}
                        ${exp.stats.stars ? `
                            <div class="flex items-center gap-1 text-gray-500">
                                <span class="material-symbols-outlined text-[14px]">star</span>
                                <span>${exp.stats.stars}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Render certification entry
 */
function renderCertificationEntry(exp, delay) {
    return `
        <div class="log-entry group relative pl-12 lg:pl-16 animate-fade-in-up" style="animation-delay: ${delay}s; opacity: 0;">
            <div class="log-marker absolute left-3 top-2 w-2.5 h-2.5 bg-gray-800 border border-gray-600 rounded-full transition-all duration-300 lg:left-[13px] z-10"></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <span class="${exp.colorClass || 'text-orange-400'} font-mono text-sm">${exp.date}</span>
                <h3 class="text-xl font-medium text-white">${exp.title}</h3>
                <span class="text-xs font-mono text-gray-500 px-2 py-0.5 border border-border-dark rounded bg-surface-dark">${exp.company}</span>
            </div>
            <div class="bg-surface-dark/50 border border-border-dark p-3 rounded-sm ${exp.hoverBorderClass || 'hover:border-orange-500/30'} transition-colors duration-300 backdrop-blur-sm flex justify-between items-center">
                <span class="text-sm text-gray-400 font-light">Validation Number: ${exp.validationNumber}</span>
                <span class="material-symbols-outlined text-gray-600">verified</span>
            </div>
        </div>
    `;
}

/**
 * Render sidebar with skills and stats
 */
async function renderSidebar() {
    const container = document.getElementById('experience-sidebar');
    if (!container) return;

    const skills = await loadJSON('../data/skills.json');
    const profile = await loadJSON('../data/profile.json');

    if (!skills || !profile) return;

    container.innerHTML = `
        <div class="sticky top-24">
            <div class="bg-surface-dark border border-border-dark p-5 rounded-sm mb-6">
                <div class="flex items-center justify-between mb-4 border-b border-border-dark pb-2">
                    <span class="text-xs font-mono text-primary uppercase">Tech Stack Matrix</span>
                    <span class="material-symbols-outlined text-gray-600 text-sm">memory</span>
                </div>
                <div class="space-y-4">
                    ${skills.proficiencyBars.map(bar => `
                        <div>
                            <div class="flex justify-between text-[10px] font-mono text-gray-500 mb-1">
                                <span>${bar.name}</span>
                                <span>${bar.percentage}%</span>
                            </div>
                            <div class="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                                <div class="h-full ${bar.color}" style="width: ${bar.percentage}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="mt-6 pt-4 border-t border-border-dark grid ${profile.stats.ossContribs ? 'grid-cols-2' : 'grid-cols-1'} gap-2">
                    <div class="text-center p-2 bg-background-dark border border-border-dark">
                        <span class="block text-xl font-display text-white">${profile.stats.hackathonsWon}</span>
                        <span class="text-[9px] font-mono text-gray-500 uppercase">Hackathons Won</span>
                    </div>
                    ${profile.stats.ossContribs ? `
                    <div class="text-center p-2 bg-background-dark border border-border-dark">
                        <span class="block text-xl font-display text-white">${profile.stats.ossContribs}</span>
                        <span class="text-[9px] font-mono text-gray-500 uppercase">OSS Contribs</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div id="ping-container" class="bg-surface-dark border border-border-dark p-5 rounded-sm flex items-center gap-4 relative">
                <div class="relative">
                    <div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div class="absolute inset-0 bg-emerald-500 rounded-full blur-sm opacity-50 animate-pulse"></div>
                </div>
                <div>
                    <span class="block text-xs font-mono text-white uppercase tracking-wider">Status: Online</span>
                    <span class="block text-[10px] font-mono text-gray-500">Open for new deployments</span>
                </div>
                <button id="ping-btn" class="ml-auto px-3 py-1.5 border border-primary/30 text-primary text-[10px] font-mono hover:bg-primary hover:text-white transition-colors uppercase">
                    Ping
                </button>
            </div>
        </div>
    `;

    // Setup ping easter egg
    setupPingEasterEgg();
}

/**
 * Track ping to backend (once per session, non-blocking)
 */
function trackPing() {
    // Only track once per session
    if (sessionStorage.getItem('ping_tracked')) return;
    
    // Mark as tracked immediately (before the request)
    sessionStorage.setItem('ping_tracked', 'true');
    
    const visitorInfo = {
        browser: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        referrer: document.referrer || 'Direct',
    };

    // Fire and forget - use sendBeacon for reliability, fallback to fetch
    const data = JSON.stringify(visitorInfo);
    
    if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/ping', new Blob([data], { type: 'application/json' }));
    } else {
        fetch('/api/ping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
            keepalive: true  // Ensures request completes even if page closes
        }).catch(() => {}); // Silently ignore errors
    }
}

/**
 * Ping easter egg - burst effect around button
 */
function setupPingEasterEgg() {
    const pingBtn = document.getElementById('ping-btn');
    if (!pingBtn) return;

    pingBtn.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Track the ping (once per session)
        trackPing();
        
        // Create burst rays around button
        const rayCount = 12;
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2;
            const ray = document.createElement('div');
            
            // Calculate start position on circle around button
            const startRadius = 30;
            const endRadius = 50;
            
            ray.style.cssText = `
                position: fixed;
                top: ${centerY - 1}px;
                left: ${centerX - 1}px;
                width: 2px;
                height: 10px;
                background: white;
                z-index: 9999;
                pointer-events: none;
                opacity: 0.8;
                transform-origin: center center;
                transform: rotate(${angle + Math.PI/2}rad) translateY(-${startRadius}px);
            `;
            document.body.appendChild(ray);

            // Animate outward and fade
            ray.animate([
                { transform: `rotate(${angle + Math.PI/2}rad) translateY(-${startRadius}px)`, opacity: 0.8 },
                { transform: `rotate(${angle + Math.PI/2}rad) translateY(-${endRadius}px)`, opacity: 0 }
            ], {
                duration: 300,
                easing: 'ease-out'
            }).onfinish = () => ray.remove();
        }
        
        // Show toast below button
        showPingToast(rect);
        
        // Button feedback
        btn.textContent = '...';
        setTimeout(() => {
            btn.textContent = 'PING';
        }, 400);
    });
}

// Track active toasts
const activeToasts = [];

/**
 * Show toast message below ping button
 */
function showPingToast(btnRect) {
    const messages = [
        'PONG!',
        'ACK 12ms',
        'Connected',
        'Online ✓',
        'ttl=64',
        '200 OK',
        'Latency: 8ms',
        'Packet received',
        'Signal strong',
        'Heartbeat ♥',
        'Sync complete',
        'No packet loss',
        'RTT: 15ms',
        'Host alive',
        'Echo reply',
        '64 bytes received',
        'Uptime: 99.9%',
        'Connection stable',
        'TCP handshake ✓',
        'DNS resolved',
        'Port 443 open',
        'SSL verified',
        'Bandwidth: high',
        'Jitter: 2ms',
        'Hop count: 4',
        'Traceroute done',
        'Ping successful',
        'Server awake',
        'Keepalive sent',
        'Buffer clear',
        'Queue empty',
        'Throughput OK',
        'Zero errors',
        'Checksum valid',
        'Route optimal',
        'Firewall passed',
        'Proxy bypassed',
        'CDN hit',
        'Cache fresh',
        'Load balanced',
        'Health check ✓',
        'Replica synced',
        'Shard active',
        'Node healthy',
        'Cluster green',
        'Pod running',
        'Container up',
        'Service mesh OK',
        'API gateway ✓',
        'Rate limit OK',
    ];
    
    const container = document.getElementById('ping-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    const toastHeight = 24;
    const gap = 4;
    
    // Calculate position based on existing toasts
    const offset = activeToasts.length * (toastHeight + gap);
    
    toast.style.cssText = `
        position: absolute;
        top: calc(100% + 8px + ${offset}px);
        right: 0;
        padding: 4px 10px;
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.4);
        color: #10b981;
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        z-index: 9999;
        opacity: 0;
        transform: translateY(-4px);
        transition: all 0.2s ease;
    `;
    toast.textContent = messages[Math.floor(Math.random() * messages.length)];
    container.appendChild(toast);
    
    // Add to tracking array
    activeToasts.push(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    // Remove after delay
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-4px)';
        
        setTimeout(() => {
            // Remove from tracking array
            const index = activeToasts.indexOf(toast);
            if (index > -1) {
                activeToasts.splice(index, 1);
            }
            toast.remove();
            
            // Reposition remaining toasts
            activeToasts.forEach((t, i) => {
                t.style.top = `calc(100% + 8px + ${i * (toastHeight + gap)}px)`;
            });
        }, 200);
    }, 1500);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExperience);
} else {
    initExperience();
}
