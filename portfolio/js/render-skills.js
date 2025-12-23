/**
 * PORTFOLIO SYSTEM - SKILLS RENDERER
 * Renders skills/capabilities grid from JSON data
 */

import { loadJSON } from './core.js';

let skillsData = null;

/**
 * Initialize skills page
 */
export async function initSkills() {
    skillsData = await loadJSON('../data/skills.json');

    if (!skillsData) {
        console.error('[SKILLS] Failed to load skills data');
        return;
    }

    renderSkillsGrid();

    console.log(`[SKILLS] Loaded ${skillsData.categories.length} skill categories`);
}

/**
 * Render the skills grid
 */
function renderSkillsGrid() {
    const container = document.getElementById('skills-grid');
    if (!container) return;

    container.innerHTML = skillsData.categories.map((category, i) =>
        renderSkillCategory(category, i)
    ).join('');
}

/**
 * Render a single skill category
 * @param {Object} category - Category data
 * @param {number} index - Category index for animation delay
 * @returns {string} HTML string
 */
function renderSkillCategory(category, index) {
    const delay = 0.2 + (index * 0.1);

    let content = '';

    switch (category.type) {
        case 'list':
            content = renderListSkills(category.items);
            break;
        case 'tags':
            content = renderTagSkills(category.items);
            break;
        case 'grid':
            content = renderGridSkills(category.groups);
            break;
        case 'list-prefixed':
            content = renderPrefixedListSkills(category.items);
            break;
        case 'inline':
            content = renderInlineSkills(category.items, category.syncStatus);
            break;
        default:
            content = renderTagSkills(category.items);
    }

    return `
        <div class="skill-card group relative bg-surface-dark border border-border-dark p-6 hover:border-primary/40 transition-colors duration-300"
             style="animation: fadeInUp 0.6s ease-out ${delay}s forwards; opacity: 0;">
            <div class="absolute top-0 left-0 w-full h-[1px] bg-border-dark card-decor-line transition-all duration-500 ease-out"></div>
            <div class="flex justify-between items-start mb-6">
                <h3 class="font-mono text-sm text-gray-400 uppercase tracking-widest">[ ${category.title} ]</h3>
                <span class="material-symbols-outlined text-gray-700 group-hover:text-primary transition-colors text-lg">${category.icon}</span>
            </div>
            ${content}
            <div class="absolute bottom-4 right-4 text-[9px] font-mono text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                SYS_ID: ${category.id}
            </div>
        </div>
    `;
}

/**
 * Render list-style skills (with versions)
 */
function renderListSkills(items) {
    return `
        <ul class="space-y-3 font-mono text-sm">
            ${items.map(item => `
                <li class="flex items-center justify-between group/item">
                    <span class="${item.active ? 'text-white' : 'text-gray-400'} group-hover/item:text-primary transition-colors">${item.name}</span>
                    ${item.version ? `<span class="text-[10px] text-gray-600">${item.version}</span>` : ''}
                    ${item.active !== undefined && item.version === undefined ? `
                        <span class="w-1.5 h-1.5 ${item.active ? 'bg-emerald-500' : 'bg-gray-700'} rounded-full"></span>
                    ` : ''}
                </li>
            `).join('')}
        </ul>
    `;
}

/**
 * Render tag-style skills
 */
function renderTagSkills(items) {
    return `
        <div class="flex flex-wrap gap-2">
            ${items.map(item => `
                <span class="px-2 py-1 bg-surface-highlight border border-gray-800 text-xs font-mono text-gray-300 hover:text-white hover:border-primary/50 transition-colors cursor-default">${item.name}</span>
            `).join('')}
        </div>
    `;
}

/**
 * Render grid-style skills (grouped)
 */
function renderGridSkills(groups) {
    return `
        <div class="grid grid-cols-2 gap-4 font-mono text-xs">
            ${groups.map(group => `
                <div class="flex flex-col gap-1 ${group.items.length > 2 ? 'col-span-2 mt-2' : ''}">
                    <span class="text-[10px] text-gray-600 uppercase">${group.label}</span>
                    ${group.items.map(item => `
                        <span class="${item.active ? 'text-white' : 'text-gray-400'}">${item.name}</span>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Render prefixed list skills (with arrows)
 */
function renderPrefixedListSkills(items) {
    return `
        <ul class="space-y-3 font-mono text-sm">
            ${items.map(item => `
                <li class="flex items-center gap-3 group/item">
                    <span class="${item.primary ? 'text-primary' : 'text-gray-700'} font-bold">&gt;</span>
                    <span class="text-white group-hover/item:text-primary transition-colors">${item.name}</span>
                </li>
            `).join('')}
        </ul>
    `;
}

/**
 * Render inline skills (pipe-separated)
 */
function renderInlineSkills(items, showSync) {
    return `
        <div class="flex flex-wrap gap-x-4 gap-y-2 font-mono text-sm text-gray-400">
            ${items.map((item, i) => `
                <span class="hover:text-white transition-colors cursor-default">${item}</span>
                ${i < items.length - 1 ? '<span class="text-gray-800">|</span>' : ''}
            `).join('')}
        </div>
        ${showSync ? `
            <div class="mt-8 border-t border-dashed border-gray-800 pt-4">
                <div class="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                    <span class="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span>SYNCING_TOOLCHAIN...</span>
                </div>
            </div>
        ` : ''}
    `;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkills);
} else {
    initSkills();
}
