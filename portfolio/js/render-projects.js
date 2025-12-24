/**
 * PORTFOLIO SYSTEM - PROJECTS RENDERER
 * Renders project list and detail views from JSON data
 */

import { loadJSON, getStatusColor, getStatusBgColor } from './core.js';

let projects = [];
let selectedProject = null;

/**
 * Check if we're on mobile viewport
 */
function isMobile() {
    return window.innerWidth < 768;
}

/**
 * Show project list (mobile only)
 */
function showProjectList() {
    document.body.classList.remove('mobile-detail-active');
    selectedProject = null;
    renderProjectList();
}

/**
 * Initialize projects page
 */
export async function initProjects() {
    projects = await loadJSON('../data/projects.json');

    if (!projects) {
        console.error('[PROJECTS] Failed to load projects data');
        return;
    }

    renderProjectList();

    // On desktop, select first project by default
    // On mobile, just show the list
    if (!isMobile() && projects.length > 0) {
        selectProject(projects[0].id);
    }

    console.log(`[PROJECTS] Loaded ${projects.length} projects`);
}

/**
 * Render the project list sidebar
 */
function renderProjectList() {
    const container = document.getElementById('project-list');
    if (!container) return;

    const activeCount = projects.filter(p => p.status === 'DEPLOYED' || p.status === 'EXPERIMENT').length;

    container.innerHTML = `
        <div class="p-4 border-b border-border-dark bg-surface-dark/50 flex justify-between items-center sticky top-0 backdrop-blur-sm">
            <h2 class="font-mono text-xs uppercase tracking-widest text-gray-400">Available Models</h2>
            <span class="text-[10px] font-mono bg-border-dark px-1.5 py-0.5 rounded text-gray-300">${String(activeCount).padStart(2, '0')} ACTIVE</span>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
            ${projects.map(p => renderProjectCard(p)).join('')}
        </div>
    `;

    // Add click handlers
    container.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.projectId;
            selectProject(projectId);
        });
    });
}

/**
 * Render a single project card
 * @param {Object} project - Project data
 * @returns {string} HTML string
 */
function renderProjectCard(project) {
    const isActive = selectedProject === project.id;
    const statusColor = getStatusColor(project.status);
    const statusBg = getStatusBgColor(project.status);

    return `
        <div class="project-card group relative p-4 ${isActive ? 'bg-primary/5 border-primary/40' : 'bg-surface-highlight border-border-dark'} border cursor-pointer transition-all duration-300 hover:bg-primary/10"
             data-project-id="${project.id}">
            <div class="flex items-start justify-between mb-2">
                <span class="text-[10px] font-mono ${isActive ? 'text-primary/80 border-primary/20' : 'text-gray-600 border-gray-800'} border px-1 py-0.5">${project.id}</span>
                <span class="flex items-center gap-1.5 text-[10px] font-mono ${statusColor}">
                    ${project.status === 'DEPLOYED' ? '<span class="w-1 h-1 bg-emerald-500 rounded-full"></span>' : ''}
                    ${project.status}
                    ${isActive ? '<span class="material-symbols-outlined text-primary text-sm">arrow_outward</span>' : ''}
                </span>
            </div>
            <h3 class="text-lg font-medium ${isActive ? 'text-white' : 'text-gray-300'} mb-1 group-hover:text-primary transition-colors" data-editable="project-${project.id}-title">${project.title}</h3>
            <p class="text-xs text-gray-400 font-mono leading-relaxed line-clamp-2" data-editable="project-${project.id}-summary">${project.summary}</p>
            <div class="mt-3 flex flex-wrap gap-2">
                ${project.tags.map(tag => `<span class="text-[10px] font-mono text-gray-500">#${tag}</span>`).join('')}
            </div>
        </div>
    `;
}

/**
 * Select a project and show its details
 * @param {string} projectId - Project ID to select
 */
function selectProject(projectId) {
    selectedProject = projectId;
    const project = projects.find(p => p.id === projectId);

    if (!project) return;

    // On mobile, show detail view
    if (isMobile()) {
        document.body.classList.add('mobile-detail-active');
    }

    // Re-render list to update active state
    renderProjectList();

    // Render detail view
    renderProjectDetail(project);
}

/**
 * Render project detail view
 * @param {Object} project - Project data
 */
function renderProjectDetail(project) {
    const container = document.getElementById('project-detail');
    if (!container) return;

    const statusColor = getStatusColor(project.status);

    container.innerHTML = `
        <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/30"></div>
        <div class="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30"></div>
        <div class="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/30"></div>
        <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/30"></div>
        
        <div class="px-4 md:px-8 py-4 md:py-6 border-b border-border-dark/50 flex flex-col gap-4 bg-gradient-to-r from-primary/5 to-transparent">
            <!-- Mobile Back Button -->
            <button id="mobile-back-btn" class="md:hidden flex items-center gap-2 text-gray-400 hover:text-white transition-colors self-start -ml-1">
                <span class="material-symbols-outlined text-lg">arrow_back</span>
                <span class="text-xs font-mono uppercase">Back to Projects</span>
            </button>
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <span class="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">PROJECT_SELECTED</span>
                        <span class="text-xs font-mono text-gray-500 hidden md:inline">LAST_UPDATED: ${project.lastUpdated || 'N/A'}</span>
                    </div>
                    <h1 class="text-2xl md:text-4xl font-display font-medium text-white tracking-tight" data-editable="project-${project.id}-title-detail">${project.title}</h1>
                </div>
                <div class="flex items-center gap-3">
                    ${project.links?.code ? `
                        <a class="group flex items-center gap-2 px-4 py-2 border border-border-dark bg-surface-dark text-xs font-mono hover:border-primary/50 hover:text-white transition-all" href="${project.links.code}" target="_blank">
                            <span class="material-symbols-outlined text-sm">code</span>
                            <span>SOURCE_CODE</span>
                        </a>
                    ` : ''}
                    ${project.links?.demo ? `
                        <a class="group flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-xs font-mono hover:bg-white transition-all" href="${project.links.demo}" target="_blank">
                            <span>LAUNCH_DEMO</span>
                            <span class="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
        
        <div class="flex-1 overflow-y-auto p-8">
            <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-8">
                    ${project.problem ? `
                        <div class="relative">
                            <div class="absolute -left-3 top-1 w-1 h-4 bg-primary"></div>
                            <h3 class="text-sm font-mono text-gray-400 uppercase tracking-widest mb-3">Problem Statement</h3>
                            <p class="text-gray-300 font-light leading-relaxed text-lg border-l border-border-dark pl-6" data-editable="project-${project.id}-problem">${project.problem}</p>
                        </div>
                    ` : ''}
                    
                    ${project.screenshots ? `
                        <div class="relative">
                            <h3 class="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">Screenshots</h3>
                            <div id="screenshots-gallery" class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <!-- Screenshots will be loaded dynamically -->
                            </div>
                            <!-- Lightbox for viewing larger images -->
                            <div id="screenshot-lightbox" class="fixed inset-0 z-50 bg-black/90 hidden items-center justify-center p-4 cursor-pointer">
                                <button class="absolute top-4 right-4 text-white hover:text-primary transition-colors">
                                    <span class="material-symbols-outlined text-3xl">close</span>
                                </button>
                                <img id="lightbox-image" src="" alt="Screenshot" class="max-w-full max-h-full object-contain" />
                            </div>
                        </div>
                    ` : ''}
                    
                    ${project.architecture ? `
                        <div>
                            <h3 class="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">System Architecture & Logic</h3>
                            <div class="border border-border-dark bg-surface-dark/40 p-6 rounded-sm space-y-4">
                                ${project.architecture.map((step, i) => `
                                    <div class="flex items-start gap-4">
                                        <span class="font-mono text-primary text-sm mt-1">${step.step}.</span>
                                        <div>
                                            <h4 class="text-white font-mono text-sm mb-1">${step.title}</h4>
                                            <p class="text-sm text-gray-400">${step.description}</p>
                                        </div>
                                    </div>
                                    ${i < project.architecture.length - 1 ? '<div class="w-full h-[1px] bg-border-dark/50"></div>' : ''}
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="space-y-8">
                    <div>
                        <h3 class="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">Tech Stack</h3>
                        <div class="flex flex-wrap gap-2">
                            ${project.tech.map(t => `
                                <span class="px-3 py-1 bg-surface-highlight border border-border-dark text-xs font-mono text-gray-300">${t}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    ${project.metrics ? `
                        <div>
                            <h3 class="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">Outcome Metrics</h3>
                            <div class="grid grid-cols-1 gap-3">
                                ${Object.values(project.metrics).map((metric, i) => `
                                    <div class="p-4 ${i === 0 ? 'bg-primary/5 border-primary/20' : 'bg-surface-highlight border-border-dark'} border flex flex-col">
                                        <span class="text-[10px] font-mono ${i === 0 ? 'text-primary' : 'text-gray-400'} mb-1">${metric.label}</span>
                                        <span class="text-2xl font-display font-medium text-white">${metric.value}</span>
                                        ${metric.baseline || metric.note ? `<span class="text-[10px] text-gray-500 mt-1">${metric.baseline || metric.note}</span>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="pt-4 border-t border-border-dark">
                        <div class="flex items-center justify-between text-xs font-mono">
                            <span class="text-gray-500">CURRENT_STATUS</span>
                            <span class="${statusColor} flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">${project.status === 'DEPLOYED' ? 'check_circle' : 'pending'}</span>
                                ${project.status === 'DEPLOYED' ? 'PRODUCTION' : project.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-auto px-6 py-2 border-t border-border-dark/50 bg-background-dark/80 flex justify-between items-center text-[10px] font-mono text-gray-600">
            <div class="flex gap-4">
                <span>PID: ${project.pid || '00000'}</span>
                <span>ZONE: ${project.zone || 'DEFAULT'}</span>
            </div>
            <div>
                <span class="animate-pulse">_</span> AWAITING_INPUT
            </div>
        </div>
    `;

    // Add back button handler for mobile
    const backBtn = container.querySelector('#mobile-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', showProjectList);
    }

    // Load screenshots if available
    if (project.screenshots) {
        loadScreenshots(project.screenshots);
    }
}

/**
 * Load screenshots from the specified folder
 * @param {string} folderPath - Relative path to screenshots folder (e.g., "projects/neural-search")
 */
async function loadScreenshots(folderPath) {
    const gallery = document.getElementById('screenshots-gallery');
    const lightbox = document.getElementById('screenshot-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');

    if (!gallery) return;

    // Try to load images - since we can't list directory contents in browser,
    // we'll use a manifest file or numbered images approach
    // For now, try loading numbered images (1.png, 2.png, etc.) or check for common names
    const basePath = `../assets/${folderPath}`;
    const imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
    const foundImages = [];

    // Try numbered images first (1.png, 2.png, etc.)
    for (let i = 1; i <= 10; i++) {
        for (const ext of imageExtensions) {
            const imgPath = `${basePath}/${i}.${ext}`;
            const exists = await checkImageExists(imgPath);
            if (exists) {
                foundImages.push(imgPath);
                break;
            }
        }
    }

    // Also try common names
    const commonNames = ['screenshot', 'main', 'demo', 'preview', 'cover', 'hero'];
    for (const name of commonNames) {
        for (const ext of imageExtensions) {
            const imgPath = `${basePath}/${name}.${ext}`;
            const exists = await checkImageExists(imgPath);
            if (exists && !foundImages.includes(imgPath)) {
                foundImages.push(imgPath);
                break;
            }
        }
    }

    if (foundImages.length === 0) {
        gallery.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500 font-mono text-sm border border-dashed border-border-dark">
                <span class="material-symbols-outlined text-2xl mb-2 block">image</span>
                No screenshots available yet
            </div>
        `;
        return;
    }

    // Render gallery with lazy loading
    gallery.innerHTML = foundImages.map((img, index) => `
        <div class="aspect-video bg-surface-dark border border-border-dark overflow-hidden cursor-pointer group hover:border-primary/50 transition-all"
             data-screenshot-index="${index}">
            <img src="${img}" alt="Screenshot ${index + 1}" loading="lazy"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
    `).join('');

    // Setup lightbox handlers
    gallery.querySelectorAll('[data-screenshot-index]').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.screenshotIndex);
            lightboxImage.src = foundImages[index];
            lightbox.classList.remove('hidden');
            lightbox.classList.add('flex');
        });
    });

    // Close lightbox on click
    if (lightbox) {
        lightbox.addEventListener('click', () => {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
        });
    }
}

/**
 * Check if an image exists at the given path
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>}
 */
function checkImageExists(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
} else {
    initProjects();
}
