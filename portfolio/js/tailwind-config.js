/**
 * Tailwind CSS Configuration for Portfolio System
 * Shared across all pages
 */

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#3B82F6",
                "primary-dim": "rgba(59, 130, 246, 0.1)",
                "secondary": "#10B981",
                "warning": "#F59E0B",
                "background-dark": "#050505",
                "surface-dark": "#0A0A0A",
                "surface-highlight": "#121212",
                "surface-card": "#141414",
                "border-dark": "#1F1F1F",
                "text-muted": "#6B7280",
                "text-dim": "#888888",
                "accent": "#60A5FA",
                "accent-success": "#10B981",
                "accent-warning": "#F59E0B",
                "paper": "#F5F5F4"
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
                "mono": ["JetBrains Mono", "monospace"],
                "serif": ["Times New Roman", "serif"]
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #1F1F1F 1px, transparent 1px), linear-gradient(to bottom, #1F1F1F 1px, transparent 1px)",
                'dot-pattern': "radial-gradient(#3B82F6 1px, transparent 1px)"
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'boot-sequence': 'bootSequence 1.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-in': 'slideIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'blink': 'blink 1s step-end infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 8s ease-in-out 2s infinite',
                'scanline': 'scanline 8s linear infinite'
            },
            keyframes: {
                bootSequence: {
                    '0%': { opacity: '1', transform: 'scale(0.95)' },
                    '90%': { opacity: '1', transform: 'scale(1)' },
                    '100%': { opacity: '0', display: 'none' }
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                scanline: {
                    '0%': { top: '-10%' },
                    '100%': { top: '110%' }
                }
            }
        }
    }
};
