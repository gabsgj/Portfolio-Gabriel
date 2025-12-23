/**
 * PORTFOLIO SYSTEM - LAB RENDERER
 * Renders experiments and research notes from JSON and Markdown
 */

import { loadJSON, loadMarkdown, parseMarkdown, getStatusColor, getStatusBgColor } from './core.js';

let experiments = [];

/**
 * Initialize lab page
 */
export async function initLab() {
    experiments = await loadJSON('../data/lab.json');

    if (!experiments) {
        console.error('[LAB] Failed to load lab data');
        return;
    }

    renderExperimentGrid();
    setupFilterButtons();

    console.log(`[LAB] Loaded ${experiments.length} experiments`);
}

/**
 * Render the experiment grid
 * @param {string} filter - Optional filter type
 */
function renderExperimentGrid(filter = 'all') {
    const container = document.getElementById('experiment-grid');
    if (!container) return;

    let filteredExperiments = experiments;

    if (filter !== 'all') {
        filteredExperiments = experiments.filter(exp => {
            if (filter === 'ml') return exp.id.startsWith('EXP-') || exp.id.startsWith('NLP-');
            if (filter === 'web') return exp.id.startsWith('VIZ-');
            if (filter === 'log') return exp.id.startsWith('NOTE-') || exp.id.startsWith('IOT-');
            return true;
        });
    }

    container.innerHTML = `
        ${filteredExperiments.map((exp, i) => renderExperimentCard(exp, i)).join('')}
    `;

    // Add click handlers for interactive cards
    container.querySelectorAll('.experiment-card[data-interactive="true"]').forEach(card => {
        card.addEventListener('click', () => {
            const expId = card.dataset.expId;
            openExperimentModal(expId);
        });
    });
}

/**
 * Render a single experiment card
 * @param {Object} exp - Experiment data
 * @param {number} index - Index for animation delay
 * @returns {string} HTML string
 */
function renderExperimentCard(exp, index) {
    const delay = 0.1 + (index * 0.1);
    const isInteractive = exp.interactive;

    const statusStyles = {
        training: { bg: 'bg-secondary/10', border: 'border-secondary/20', text: 'text-secondary', dot: true },
        live: { bg: 'bg-secondary/10', border: 'border-secondary/20', text: 'text-secondary', dot: true },
        prototype: { bg: 'bg-border-dark', border: 'border-border-dark', text: 'text-text-dim', dot: false },
        dormant: { bg: 'bg-border-dark', border: 'border-border-dark', text: 'text-text-dim', dot: false },
        research: { bg: 'bg-blue-900/20', border: 'border-blue-900/30', text: 'text-blue-400', dot: false }
    };

    const style = statusStyles[exp.status] || statusStyles.prototype;

    const colorThemes = {
        primary: {
            hover: 'hover:shadow-primary/10 hover:border-primary/30',
            iconHover: 'group-hover:bg-primary/20 group-hover:text-primary',
            footerHover: 'group-hover:bg-primary/5',
            ctaColor: 'text-primary'
        },
        blue: {
            hover: 'hover:shadow-blue-500/10 hover:border-blue-500/30',
            iconHover: 'group-hover:bg-blue-500/20 group-hover:text-blue-400',
            footerHover: 'group-hover:bg-blue-500/5',
            ctaColor: 'text-blue-400'
        },
        neutral: {
            hover: 'hover:border-border-dark/80',
            iconHover: 'group-hover:text-primary',
            footerHover: '',
            ctaColor: 'text-gray-500'
        }
    };

    const theme = colorThemes[exp.colorTheme] || colorThemes.neutral;

    return `
        <article class="experiment-card tech-card group relative h-72 bg-card-dark border border-border-dark flex flex-col justify-between overflow-hidden transition-all duration-300 ${isInteractive ? `hover:shadow-2xl ${theme.hover} cursor-pointer` : ''}"
                 style="animation: slideUp 0.6s ease-out ${delay}s forwards; opacity: 0;"
                 data-exp-id="${exp.id}"
                 data-interactive="${isInteractive}">
            ${isInteractive ? `
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-background-dark/80 pointer-events-none"></div>
                <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            ` : ''}
            
            <div class="relative z-10 p-6 flex-grow">
                <div class="flex justify-between items-start mb-5">
                    <div class="flex flex-col">
                        <span class="text-[10px] font-mono ${isInteractive ? 'text-primary' : 'text-text-muted'} mb-1">ID: ${exp.id}</span>
                        <span class="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded ${style.bg} text-[9px] font-mono ${style.text} uppercase border ${style.border} w-fit">
                            ${style.dot ? `<span class="w-1 h-1 bg-current rounded-full animate-pulse"></span>` : ''}
                            ${exp.statusLabel}
                        </span>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-border-dark/50 flex items-center justify-center ${theme.iconHover} transition-colors">
                        <span class="material-symbols-outlined text-text-muted group-hover:text-current transition-colors text-lg">${exp.icon}</span>
                    </div>
                </div>
                <h3 class="tech-title text-xl text-white font-medium mb-3 transition-colors duration-300 ${exp.colorTheme === 'blue' ? 'group-hover:text-blue-400' : ''}">${exp.title}</h3>
                <p class="text-sm text-text-dim font-light leading-relaxed">${exp.summary}</p>
            </div>
            
            <div class="relative z-10 p-4 border-t border-dashed border-border-dark/50 ${isInteractive ? `bg-surface-dark/50 ${theme.footerHover}` : ''} flex items-center justify-between transition-colors">
                <div class="flex items-center gap-3 text-[10px] font-mono text-text-muted">
                    ${exp.tech ? exp.tech.map(t => `<span class="flex items-center gap-1"><span class="w-1 h-1 bg-white rounded-full"></span> ${t}</span>`).join('') : ''}
                    ${exp.metadata?.epoch ? `<span>EPOCH: ${exp.metadata.epoch}</span>` : ''}
                    ${exp.metadata?.readTime ? `<span>READ TIME: ${exp.metadata.readTime}</span>` : ''}
                </div>
                ${isInteractive ? `
                    <div class="flex items-center gap-1 text-[10px] font-mono ${theme.ctaColor} opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <span class="uppercase font-bold tracking-wider">${exp.status === 'research' ? 'Read Entry' : 'View Analysis'}</span>
                        <span class="material-symbols-outlined text-sm expand-icon">${exp.status === 'research' ? 'article' : 'open_in_full'}</span>
                    </div>
                ` : `
                    <span class="material-symbols-outlined text-sm text-text-muted">${exp.icon === 'router' ? 'settings_input_component' : 'code'}</span>
                `}
            </div>
        </article>
    `;
}

/**
 * Render the "new experiment" card
 */
// Note: "Initialize New Experiment" card removed — creation handled separately if needed.

/**
 * Setup filter button handlers
 */
function setupFilterButtons() {
    const buttons = document.querySelectorAll('[data-filter]');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active state
            buttons.forEach(b => {
                if (b.dataset.filter === filter) {
                    b.className = 'px-4 py-2 bg-primary text-black font-bold hover:bg-primary/90 transition-colors';
                } else {
                    b.className = 'px-4 py-2 bg-surface-dark text-text-dim hover:text-white hover:bg-card-dark transition-colors';
                }
            });

            // Re-render grid
            renderExperimentGrid(filter);
        });
    });
}

/**
 * Open experiment modal with markdown content
 * @param {string} expId - Experiment ID
 */
async function openExperimentModal(expId) {
    const experiment = experiments.find(e => e.id === expId);
    if (!experiment || !experiment.noteFile) return;

    // Load markdown content
    const markdown = await loadMarkdown(`../lab-notes/${experiment.noteFile}`);
    if (!markdown) {
        console.error(`[LAB] Failed to load note file: ${experiment.noteFile}`);
        return;
    }

    const html = parseMarkdown(markdown);

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'experiment-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="relative bg-surface-dark border border-border-dark max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div class="flex items-center justify-between p-4 border-b border-border-dark bg-background-dark">
                <div class="flex items-center gap-3">
                    <span class="text-xs font-mono text-primary">${experiment.id}</span>
                    <span class="text-sm font-mono text-white">${experiment.title}</span>
                </div>
                <button id="close-modal" class="p-2 text-gray-400 hover:text-white transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-8">
                <div class="prose prose-invert max-w-none">
                    ${html}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Close handlers
    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = '';
    };

    document.getElementById('close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    }, { once: true });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLab);
} else {
    initLab();
}
