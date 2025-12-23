/**
 * PORTFOLIO SYSTEM - EXPERIENCE RENDERER
 * Renders execution log / timeline from JSON data
 */

import { loadJSON } from './core.js';

let experiences = [];

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

    console.log(`[EXPERIENCE] Loaded ${experiences.length} entries`);
}

/**
 * Render the experience timeline
 */
function renderExperienceTimeline() {
    const container = document.getElementById('experience-timeline');
    if (!container) return;

    container.innerHTML = `
        <div class="absolute left-4 top-4 bottom-0 w-[1px] bg-border-dark lg:left-[17px]"></div>
        ${experiences.map((exp, i) => renderExperienceEntry(exp, i)).join('')}
    `;
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
            
            <div class="bg-surface-dark border border-border-dark p-5 rounded-sm flex items-center gap-4">
                <div class="relative">
                    <div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div class="absolute inset-0 bg-emerald-500 rounded-full blur-sm opacity-50 animate-pulse"></div>
                </div>
                <div>
                    <span class="block text-xs font-mono text-white uppercase tracking-wider">Status: Online</span>
                    <span class="block text-[10px] font-mono text-gray-500">Open for new deployments</span>
                </div>
                <button class="ml-auto px-3 py-1.5 border border-primary/30 text-primary text-[10px] font-mono hover:bg-primary hover:text-white transition-colors uppercase">
                    Ping
                </button>
            </div>
        </div>
    `;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExperience);
} else {
    initExperience();
}
