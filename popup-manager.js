// Popup Manager - Tech Escape
// Handles multiple popups across the entire project

class PopupManager {
    constructor() {
        this.popups = new Map();
        this.activePopup = null;
        this.init();
    }

    init() {
        this.createPopupContainer();
        this.setupGlobalEventListeners();
    }

    createPopupContainer() {
        // Create main popup container if it doesn't exist
        if (!document.getElementById('popupContainer')) {
            const popupContainer = document.createElement('div');
            popupContainer.id = 'popupContainer';
            popupContainer.className = 'popup-container';
            document.body.appendChild(popupContainer);
        }
    }

    setupGlobalEventListeners() {
        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('popup-container') || e.target.classList.contains('popup-overlay')) {
                this.closeActivePopup();
            }
        });

        // Close popup with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activePopup) {
                this.closeActivePopup();
            }
        });
    }

    // Register a new popup
    registerPopup(id, config) {
        const popupConfig = {
            id: id,
            title: config.title || '',
            content: config.content || '',
            buttons: config.buttons || [],
            onOpen: config.onOpen || null,
            onClose: config.onClose || null,
            onButtonClick: config.onButtonClick || null,
            ...config
        };

        this.popups.set(id, popupConfig);
        return this;
    }

    // Show a popup by ID
    showPopup(id) {
        const popupConfig = this.popups.get(id);
        if (!popupConfig) {
            console.error(`Popup with ID "${id}" not found`);
            return;
        }

        this.closeActivePopup();
        this.activePopup = id;

        const popupHTML = this.createPopupHTML(popupConfig);
        const popupContainer = document.getElementById('popupContainer');
        popupContainer.innerHTML = popupHTML;

        // Show popup with animation
        setTimeout(() => {
            popupContainer.classList.add('active');
            const popupElement = popupContainer.querySelector('.popup');
            if (popupElement) {
                popupElement.classList.add('show');
            }
        }, 10);

        // Call onOpen callback
        if (popupConfig.onOpen) {
            popupConfig.onOpen(popupConfig);
        }

        // Setup popup event listeners
        this.setupPopupEventListeners(popupConfig);
    }

    // Close the currently active popup
    closeActivePopup() {
        if (!this.activePopup) return;

        const popupConfig = this.popups.get(this.activePopup);
        const popupContainer = document.getElementById('popupContainer');
        
        if (popupContainer) {
            const popupElement = popupContainer.querySelector('.popup');
            if (popupElement) {
                popupElement.classList.remove('show');
            }

            setTimeout(() => {
                popupContainer.classList.remove('active');
                popupContainer.innerHTML = '';
            }, 300);
        }

        // Call onClose callback
        if (popupConfig && popupConfig.onClose) {
            popupConfig.onClose(popupConfig);
        }

        this.activePopup = null;
    }

    // Create popup HTML
    createPopupHTML(config) {
        const buttonsHTML = config.buttons.map(button => 
            `<button class="popup-btn ${button.class || ''}" data-action="${button.action || ''}">
                ${button.icon ? `<i class="${button.icon}"></i>` : ''}
                ${button.text}
            </button>`
        ).join('');

        return `
            <div class="popup-overlay"></div>
            <div class="popup">
                <div class="popup-header">
                    <h3 class="popup-title">${config.title}</h3>
                    <button class="popup-close" data-action="close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="popup-content">
                    ${config.content}
                </div>
                ${buttonsHTML ? `<div class="popup-buttons">${buttonsHTML}</div>` : ''}
            </div>
        `;
    }

    // Setup event listeners for popup buttons
    setupPopupEventListeners(config) {
        const popupContainer = document.getElementById('popupContainer');
        
        // Close button
        const closeBtn = popupContainer.querySelector('.popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeActivePopup());
        }

        // Action buttons
        const actionButtons = popupContainer.querySelectorAll('.popup-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.dataset.action;
                
                if (action === 'close') {
                    this.closeActivePopup();
                } else if (config.onButtonClick) {
                    config.onButtonClick(action, config, e);
                }
            });
        });
    }

    // Update popup content dynamically
    updatePopupContent(id, newContent) {
        const popupConfig = this.popups.get(id);
        if (popupConfig) {
            popupConfig.content = newContent;
        }
    }

    // Get popup configuration
    getPopup(id) {
        return this.popups.get(id);
    }

    // Check if popup is active
    isPopupActive(id) {
        return this.activePopup === id;
    }

    // Get all registered popups
    getAllPopups() {
        return Array.from(this.popups.keys());
    }
}

// CSS for popup system
const popupStyles = document.createElement('style');
popupStyles.textContent = `
    .popup-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .popup-container.active {
        opacity: 1;
        visibility: visible;
    }

    .popup-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
    }

    .popup {
        position: relative;
        background: var(--bg-secondary);
        border: 2px solid var(--accent-color);
        border-radius: 20px;
        padding: 0;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        transform: scale(0.7) translateY(-50px);
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 20px 40px rgba(0, 170, 255, 0.3);
    }

    .popup.show {
        transform: scale(1) translateY(0);
        opacity: 1;
    }

    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-tertiary);
    }

    .popup-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    .popup-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 5px;
        transition: all 0.3s ease;
    }

    .popup-close:hover {
        color: var(--danger-color);
        background: rgba(255, 51, 51, 0.1);
    }

    .popup-content {
        padding: 1.5rem;
        color: var(--text-primary);
        line-height: 1.6;
        max-height: 60vh;
        overflow-y: auto;
    }

    .popup-buttons {
        display: flex;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid var(--border-color);
        background: var(--bg-tertiary);
        justify-content: flex-end;
    }

    .popup-btn {
        background: var(--gradient-primary);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .popup-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 170, 255, 0.3);
    }

    .popup-btn.secondary {
        background: var(--bg-primary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }

    .popup-btn.secondary:hover {
        background: var(--bg-tertiary);
    }

    .popup-btn.danger {
        background: var(--danger-color);
    }

    .popup-btn.danger:hover {
        box-shadow: 0 10px 20px rgba(255, 51, 51, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .popup {
            width: 95%;
            max-height: 90vh;
        }

        .popup-header {
            padding: 1rem;
        }

        .popup-content {
            padding: 1rem;
        }

        .popup-buttons {
            padding: 1rem;
            flex-direction: column;
        }

        .popup-btn {
            width: 100%;
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .popup-title {
            font-size: 1.1rem;
        }

        .popup-content {
            font-size: 0.9rem;
        }
    }
`;
document.head.appendChild(popupStyles);

// Initialize popup manager globally
window.popupManager = new PopupManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PopupManager;
}
