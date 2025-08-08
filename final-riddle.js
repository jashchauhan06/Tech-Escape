// Final Riddle - Tech Escape
// Handles the riddle display animations

class FinalRiddleGame {
    constructor() {
        this.init();
    }

    init() {
        this.startAnimations();
        this.initializePopups();
    }

    startAnimations() {
        // Animate riddle lines one by one
        const riddleLines = document.querySelectorAll('.riddle-line');
        riddleLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('animate-in');
            }, index * 500);
        });
    }
}

// CSS for animations
const style = document.createElement('style');
style.textContent = `
    .riddle-line {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }

    .riddle-line.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .final-riddle-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 2rem 0;
    }

    .final-riddle-card {
        background: var(--bg-secondary);
        border: 2px solid var(--accent-color);
        border-radius: 20px;
        padding: 3rem;
        max-width: 800px;
        width: 100%;
        box-shadow: 0 20px 40px rgba(0, 170, 255, 0.2);
        position: relative;
        overflow: hidden;
    }

    .final-riddle-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--gradient-primary);
        animation: shimmer 2s ease-in-out infinite;
    }

    .final-riddle-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .final-riddle-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--accent-color);
        margin-bottom: 0.5rem;
        text-shadow: 0 0 20px rgba(0, 170, 255, 0.5);
    }

    .final-riddle-header p {
        font-size: 1.2rem;
        color: var(--text-secondary);
        font-weight: 500;
    }

    .riddle-poem {
        text-align: center;
        margin-bottom: 2rem;
    }

    .riddle-line h3 {
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        line-height: 1.6;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
    }

    .riddle-line:last-child h3 {
        color: var(--accent-color);
        font-weight: 700;
    }

    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .final-riddle-card {
            padding: 2rem;
            margin: 1rem;
        }

        .final-riddle-header h1 {
            font-size: 2rem;
        }

        .riddle-line h3 {
            font-size: 1.2rem;
        }
    }

    @media (max-width: 480px) {
        .final-riddle-card {
            padding: 1.5rem;
            margin: 0.5rem;
        }

        .final-riddle-header h1 {
            font-size: 1.8rem;
        }

        .riddle-line h3 {
            font-size: 1.1rem;
        }
    }
`;
document.head.appendChild(style);

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.finalRiddleGame = new FinalRiddleGame();
    
    // Initialize popups for final riddle
    window.popupManager.registerPopup('finalRiddleInfo', {
        title: '🔍 Final Riddle',
        content: `
            <p><strong>Congratulations!</strong> You've reached the final challenge.</p>
            <p>This riddle will test your lateral thinking and observation skills.</p>
            <p><strong>Hint:</strong> Sometimes the answer is right in front of you...</p>
            <p>Take your time and think carefully about each line of the riddle.</p>
        `,
        buttons: [
            {
                text: 'Got It',
                action: 'close',
                icon: 'fas fa-check',
                class: ''
            }
        ]
    });

    // Show info popup after riddle animation completes
    setTimeout(() => {
        window.popupManager.showPopup('finalRiddleInfo');
    }, 3000);
});
