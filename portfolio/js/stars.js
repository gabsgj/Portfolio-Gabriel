/**
 * Shooting Stars Effect
 * Creates a subtle shooting star effect across the screen.
 */

class ShootingStars {
    constructor() {
        this.container = document.body;
        this.maxStars = 2; // Simultaneous stars
        this.interval = 3000; // Time between potential new stars
        this.activeStars = 0;

        // Configuration
        this.minDuration = 2;
        this.maxDuration = 5;
        this.colors = ['#ffffff', '#3B82F6', '#a5f3fc']; // White, Blue, Light Cyan

        this.init();
    }

    init() {
        // Create container if it doesn't exist (though we append to body usually)
        // Start loop
        this.startLoop();
    }

    startLoop() {
        // Initial star
        setTimeout(() => this.createStar(), 1000);

        // Regular interval
        setInterval(() => {
            if (this.activeStars < this.maxStars) {
                this.createStar();
            }
        }, this.interval);
    }

    createStar() {
        const star = document.createElement('div');
        star.classList.add('shooting-star');

        // Randomize properties
        const startY = Math.random() * (window.innerHeight / 2); // Start from top half
        const startX = Math.random() * window.innerWidth;

        // Calculate end position (moving down and right)
        // We want them to generally move diagonally
        const angle = 45 * (Math.PI / 180); // 45 degrees
        const distance = Math.max(window.innerWidth, window.innerHeight) * 1.5;

        const duration = this.minDuration + Math.random() * (this.maxDuration - this.minDuration);
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        // Set styles
        star.style.top = `${startY}px`;
        star.style.left = `${Math.random() > 0.5 ? -50 : window.innerWidth + 50}px`; // Start off-screen randomly left or right?
        // Actually, let's just do top-left to bottom-right for consistency or occasional top-right to bottom-left

        // Improved random start position to ensure they cross the screen
        // Pick a random side: Top or Left
        const side = Math.random() > 0.5 ? 'top' : 'left';
        let initialX, initialY;

        if (side === 'top') {
            initialX = Math.random() * window.innerWidth;
            initialY = -50;
        } else {
            initialX = -50;
            initialY = Math.random() * (window.innerHeight * 0.7);
        }

        star.style.left = `${initialX}px`;
        star.style.top = `${initialY}px`;

        // Length of the tail
        const scale = 0.5 + Math.random() * 0.5;
        star.style.transform = `scale(${scale}) rotate(-45deg)`; // Base rotation for CSS

        star.style.setProperty('--star-color', color);
        star.style.animation = `shoot ${duration}s linear forwards`;

        this.container.appendChild(star);
        this.activeStars++;

        // Cleanup
        setTimeout(() => {
            star.remove();
            this.activeStars--;
        }, duration * 1000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ShootingStars();
});
