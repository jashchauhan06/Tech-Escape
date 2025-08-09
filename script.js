// Tech Escape - Digital Treasure Hunt
// Complete JavaScript functionality - Bug-free version
// Author: AI Assistant
// Date: 2025

// Main Game Class
class TechEscapeGame {
    constructor() {
        // Core game state
        this.currentTeam = null;
        this.currentRiddle = 0;
        this.hintsUsed = 0;
        this.maxHints = 3;
        this.startTime = null;
        this.endTime = null;
        this.gameInitialized = false;
        
        // Data storage
        this.teams = this.loadTeams();
        this.riddles = this.initializeRiddles();
        
        // Error handling
        this.lastErrorTime = 0;
        this.errorThrottleMs = 2000;
        this.messageQueue = [];
        
        // Initialize only once
        if (!this.gameInitialized) {
            this.init();
        }
    }

    // Initialize the game
    init() {
        console.log('🎮 Initializing Tech Escape Game...');
        
        try {
            this.initializeEventListeners();
        // Timer will be controlled by admin game state
        // Removed auto-login via localStorage; require explicit login
        this.pollGameStatus();
            this.initializePopups();
            this.gameInitialized = true;
            console.log('✅ Game initialized successfully');
        } catch (error) {
            console.error('❌ Game initialization failed:', error);
            this.showMessage('Game initialization failed. Please refresh the page.', 'error');
        }
    }

    // Initialize popups
    initializePopups() {
        // Welcome popup
        window.popupManager.registerPopup('welcome', {
            title: '🎉 Welcome to Tech Escape!',
            content: `
                <p>Welcome to the ultimate digital treasure hunt by IEEE SIT!</p>
                <p>Complete 6 challenging riddles to unlock the final mystery.</p>
                <p><strong>Features:</strong></p>
                <ul>
                    <li>🎯 6 Interactive Challenges</li>
                    <li>💡 Hint System</li>
                    <li>⏱️ Timer Tracking</li>
                    <li>🏆 Progress Tracking</li>
                </ul>
                <p>Ready to begin your adventure?</p>
            `,
            buttons: [
                {
                    text: 'Start Adventure',
                    action: 'start',
                    icon: 'fas fa-rocket',
                    class: ''
                },
                {
                    text: 'Learn More',
                    action: 'info',
                    icon: 'fas fa-info-circle',
                    class: 'secondary'
                }
            ],
            onButtonClick: (action, config) => {
                if (action === 'start') {
                    window.popupManager.closeActivePopup();
                } else if (action === 'info') {
                    window.popupManager.showPopup('info');
                }
            }
        });

        // Info popup
        window.popupManager.registerPopup('info', {
            title: 'ℹ️ About Tech Escape',
            content: `
                <p><strong>Tech Escape</strong> is a digital treasure hunt designed to test your technical knowledge and problem-solving skills.</p>
                
                <h4>🎯 Challenge Types:</h4>
                <ul>
                    <li><strong>IEEE Knowledge:</strong> Test your understanding of IEEE standards</li>
                    <li><strong>Binary & Hex:</strong> Number system conversions</li>
                    <li><strong>Programming Logic:</strong> Basic programming concepts</li>
                    <li><strong>Electrical Engineering:</strong> Circuit analysis</li>
                    <li><strong>Cybersecurity:</strong> Security concepts and encryption</li>
                    <li><strong>Algorithms:</strong> Computer science fundamentals</li>
                </ul>
                
                <h4>🏆 Scoring:</h4>
                <ul>
                    <li>Complete all challenges to unlock the final riddle</li>
                    <li>Use hints wisely (3 available)</li>
                    <li>Fastest completion times get special recognition</li>
                </ul>
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

        // Hint popup
        window.popupManager.registerPopup('hint', {
            title: '💡 Hint',
            content: '<div id="hintContent">Loading hint...</div>',
            buttons: [
                {
                    text: 'Close',
                    action: 'close',
                    icon: 'fas fa-times',
                    class: 'secondary'
                }
            ]
        });

        // Success popup
        window.popupManager.registerPopup('success', {
            title: '🎉 Challenge Complete!',
            content: '<div id="successContent">Great job!</div>',
            buttons: [
                {
                    text: 'Continue',
                    action: 'continue',
                    icon: 'fas fa-arrow-right',
                    class: ''
                }
            ],
            onButtonClick: (action, config) => {
                if (action === 'continue') {
                    window.popupManager.closeActivePopup();
                    // Continue to next challenge
                    setTimeout(() => {
                        this.loadCurrentRiddle();
                    }, 500);
                }
            }
        });

        // Error popup
        window.popupManager.registerPopup('error', {
            title: '❌ Incorrect Answer',
            content: '<div id="errorContent">Try again or use a hint!</div>',
            buttons: [
                {
                    text: 'Try Again',
                    action: 'retry',
                    icon: 'fas fa-redo',
                    class: ''
                },
                {
                    text: 'Get Hint',
                    action: 'hint',
                    icon: 'fas fa-lightbulb',
                    class: 'secondary'
                }
            ],
            onButtonClick: (action, config) => {
                if (action === 'retry') {
                    window.popupManager.closeActivePopup();
                } else if (action === 'hint') {
                    window.popupManager.closeActivePopup();
                    this.showHint();
                }
            }
        });

        // Show welcome popup after a delay
        setTimeout(() => {
            window.popupManager.showPopup('welcome');
        }, 1000);
    }

    // Initialize all riddles data
    initializeRiddles() {
        return [
            {
                id: 1,
                           question: `
               <h4>🔍 Hidden Flag Challenge</h4>
               <p>Your first challenge is to find the hidden flag! Look carefully around...</p>
               <div class="hidden-flag-challenge">
                   <div class="challenge-instructions">
                       <p><strong>Riddle:</strong></p>
                       <div class="riddle-text">
                           <p>I am hidden but not gone,<br>
                           You won't find me typing or searching alone.<br>
                           Peek behind, look beneath, or simply inspect,<br>
                           Only careful eyes will find what you expect.<br>
                           I do not shout—I like to blend,<br>
                           Discover me on this page, and your challenge will end</p>
                       </div>
                       <div class="hint-box">
                           <p><em>💡 Hint: The flag might be hidden in plain sight, but you need to look deeper...</em></p>
                       </div>
                   </div>
                   <div class="flag-input-section">
                       <p><strong>Once you find the flag, enter it here:</strong></p>
                   </div>
               </div>
           `,
                answer: 'IEEE{hidden_flag_found}',
                hint: 'Do you really think it’s going to be that easy?',
                explanation: 'The flag was hidden in the IEEE logo element as a data attribute or in the page source comments.',
                interactive: true,
                setupFunction: 'setupChallenge1'
            },
            {
                id: 2,
                question: `
                    <h4>🕵️ Hidden Chips (Alt‑reveal)</h4>
                    <p>Find <strong>7</strong> microchips hidden in the static. Hold <strong>Alt</strong> while hovering to faintly reveal, then click to collect.</p>
                    <div id="hunt2" style="position:relative;height:240px;border:1px solid var(--border-color);border-radius:12px;overflow:hidden;background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.02) 0 2px,rgba(0,0,0,0.05) 2px 4px);"></div>
                    <div id="hunt2Progress" class="mono" style="margin-top:8px;color:var(--text-secondary)">Found: 0/7</div>
                `,
                answer: 'HIDDEN{stealth_hunter_2}',
                hint: 'Alt key weakly lights up the chips.',
                explanation: 'Alt‑assist highlight; precise clicks required.',
                interactive: true,
                setupFunction: 'setupChallenge2'
            },
            {
                id: 3,
                question: `
                    <h4>🧿 Find Me on the Page</h4>
                    <p>There are <strong>8</strong> stealth marks hidden <em>anywhere</em> on this page (outside this card too). Drag the <strong>🔍 magnifier</strong> around to reveal and collect them automatically.</p>
                    <div id="hunt3ProgressGlobal" class="mono" style="margin-top:8px;color:var(--text-secondary)">Found: 0/8</div>
                `,
                answer: 'HIDDEN{page_sleuth_3}',
                hint: 'Edges and corners are suspicious.',
                explanation: 'Fixed-position tiny targets around the viewport.',
                interactive: true,
                setupFunction: 'setupChallenge3'
            },
            {
                id: 4,
                question: `
                    <h4>⚡ Electrical Engineering Challenge</h4>
                    <p>Solve these circuit problems step by step:</p>
                    <div class="circuit-challenge">
                        <div class="circuit-problems">
                            <div class="circuit-problem">
                                <p><strong>1.</strong> Two resistors 8Ω and 12Ω in parallel. Find equivalent resistance:</p>
                                <input type="text" class="circuit-input" id="circ1" placeholder="Answer in Ω (format: X.XX)">
                            </div>
                            <div class="circuit-problem">
                                <p><strong>2.</strong> Using Ohm's Law: V = 9V, R = 3Ω. Find current I:</p>
                                <input type="text" class="circuit-input" id="circ2" placeholder="Answer in A">
                            </div>
                            <div class="circuit-problem">
                                <p><strong>3.</strong> Power P = I²R. If I = 2A and R = 5Ω, find P:</p>
                                <input type="text" class="circuit-input" id="circ3" placeholder="Answer in W">
                            </div>
                        </div>
                        <div class="circuit-result" id="circuitResult" style="display:none;">
                            <p>🎉 All correct! <strong>Flag:</strong> <code>OHMS{4.8_3_20}</code></p>
                        </div>
                    </div>
                    <p><strong>Solve all problems to get the flag:</strong></p>
                `,
                answer: 'OHMS{4.8_3_20}',
                hint: 'Use: Parallel formula 1/R = 1/R1 + 1/R2, Ohms Law V=IR, Power P=I²R',
                explanation: 'Parallel: 1/R=1/8+1/12=5/24, R=4.8Ω; I=V/R=9/3=3A; P=I²R=4×5=20W',
                interactive: true,
                setupFunction: 'setupChallenge4'
            },
            {
                id: 5,
                question: `
                    <h4>🔒 Cybersecurity & Encryption Challenge</h4>
                    <p>Decode this encrypted message and find the security vulnerabilities:</p>
                    <div class="security-challenge">
                        <div class="security-problems">
                            <div class="security-problem">
                                <p><strong>1.</strong> Caesar Cipher (shift 3): <code>WHFK HVFDSH</code></p>
                                <input type="text" class="security-input" id="sec1" placeholder="Decoded message">
                            </div>
                            <div class="security-problem">
                                <p><strong>2.</strong> Which port is commonly used for HTTPS?</p>
                                <input type="number" class="security-input" id="sec2" placeholder="Port number">
                            </div>
                            <div class="security-problem">
                                <p><strong>3.</strong> What does SQL injection attack? (Database/Network/Hardware)</p>
                                <input type="text" class="security-input" id="sec3" placeholder="Answer">
                            </div>
                        </div>
                        <div class="security-result" id="securityResult" style="display:none;">
                            <p>🎉 Security expert! <strong>Flag:</strong> <code>SECURE{tech_escape_443_database}</code></p>
                        </div>
                    </div>
                    <p><strong>Solve all security problems to get the flag:</strong></p>
                `,
                answer: 'SECURE{tech_escape_443_database}',
                hint: 'Caesar cipher shifts letters backward by 3. HTTPS uses secure port. SQL attacks database systems.',
                explanation: 'TECH ESCAPE (shift back 3), HTTPS port 443, SQL injection targets databases',
                interactive: true,
                setupFunction: 'setupChallenge5'
            },
            {
                id: 6,
                question: `
                    <h4>🧠 Algorithm & Logic Challenge</h4>
                    <p>Solve these computer science problems:</p>
                    <div class="algorithm-challenge">
                        <div class="algo-problems">
                            <div class="algo-problem">
                                <p><strong>1.</strong> What's the Big O time complexity of linear search?</p>
                                <input type="text" class="algo-input" id="algo1" placeholder="O(?)">
                            </div>
                            <div class="algo-problem">
                                <p><strong>2.</strong> In binary search tree, which traversal gives sorted order?</p>
                                <input type="text" class="algo-input" id="algo2" placeholder="Traversal type">
                            </div>
                            <div class="algo-problem">
                                <p><strong>3.</strong> Complete the pattern: 2, 6, 12, 20, 30, ___</p>
                                <input type="number" class="algo-input" id="algo3" placeholder="Next number">
                            </div>
                            <div class="algo-problem">
                                <p><strong>4.</strong> What data structure uses LIFO principle?</p>
                                <input type="text" class="algo-input" id="algo4" placeholder="Data structure">
                            </div>
                        </div>
                        <div class="algo-result" id="algoResult" style="display:none;">
                            <p>🎉 Algorithm master! <strong>Flag:</strong> <code>ALGO{n_inorder_42_stack}</code></p>
                        </div>
                    </div>
                    <p><strong>Solve all problems to get the flag:</strong></p>
                `,
                answer: 'ALGO{n_inorder_42_stack}',
                hint: 'Think about search complexity, tree traversals, mathematical patterns, and stack operations.',
                explanation: 'Linear search O(n), inorder traversal, pattern n(n+1) so 6×7=42, stack is LIFO',
                interactive: true,
                setupFunction: 'setupChallenge6'
            }
        ];
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Auth form listeners
        this.setupAuthListeners();
        
        // Game listeners will be set up when game interface is shown
        console.log('✅ Event listeners initialized');
    }

    // Setup authentication listeners
    setupAuthListeners() {
        const loginForm = document.getElementById('login');
        const registerForm = document.getElementById('register');
        const showRegisterBtn = document.getElementById('showRegister');
        const showLoginBtn = document.getElementById('showLogin');
        const testBtn = document.getElementById('testBtn');
        const ieeeLogo = document.querySelector('.ieee-logo');


        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', (e) => this.showRegisterForm(e));
        }
        
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', (e) => this.showLoginForm(e));
        }
        
        if (testBtn) {
            testBtn.addEventListener('click', () => this.createTestTeam());
        }
        
        // Add click handler for IEEE logo
        if (ieeeLogo) {
            ieeeLogo.addEventListener('click', () => this.handleIeeeLogoClick());
        }

    }

    // Setup game listeners (called when game interface is shown)
    setupGameListeners() {
        const answerForm = document.getElementById('answerForm');
        const hintBtn = document.getElementById('hintBtn');
        const prevBtn = document.getElementById('prevBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        // Remove existing listeners to prevent duplicates
        if (answerForm && !answerForm.dataset.listenerAdded) {
            answerForm.addEventListener('submit', (e) => this.handleAnswer(e));
            answerForm.dataset.listenerAdded = 'true';
        }

        if (hintBtn && !hintBtn.dataset.listenerAdded) {
            hintBtn.addEventListener('click', () => this.showHint());
            hintBtn.dataset.listenerAdded = 'true';
        }

        if (prevBtn && !prevBtn.dataset.listenerAdded) {
            prevBtn.addEventListener('click', () => this.goToPreviousChallenge());
            prevBtn.dataset.listenerAdded = 'true';
        }

        if (logoutBtn && !logoutBtn.dataset.listenerAdded) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
            logoutBtn.dataset.listenerAdded = 'true';
        }
    }

    // Initialize countdown timer
    initializeTimer(endTimestampMs) {
        if (!endTimestampMs) return;
        this.updateTimer(endTimestampMs);
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.updateTimer(endTimestampMs);
        }, 1000);
    }

    // Update timer display
    updateTimer(endTime) {
        const now = Date.now();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
            const minutes = Math.floor(timeLeft / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        } else {
            // Time's up - redirect to main page and show stats
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            // Stop further timer ticks and guard multiple popups
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            if (!this._timeUpHandled) {
                this.handleTimeUp();
            }
        }
    }

    // Freeze/unfreeze the UI when admin pauses the event
    setFrozenUI(isFrozen, message = '⏸️ Event paused by admin') {
        const overlayId = 'freeze-overlay';
        let overlay = document.getElementById(overlayId);
        if (isFrozen) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = overlayId;
                overlay.style.position = 'fixed';
                overlay.style.inset = '0';
                overlay.style.background = 'rgba(0,0,0,0.6)';
                overlay.style.backdropFilter = 'blur(2px)';
                overlay.style.display = 'flex';
                overlay.style.alignItems = 'center';
                overlay.style.justifyContent = 'center';
                overlay.style.zIndex = '2000';
                overlay.style.pointerEvents = 'all';
                const box = document.createElement('div');
                box.style.background = '#111827';
                box.style.border = '1px solid #374151';
                box.style.borderRadius = '12px';
                box.style.padding = '16px 20px';
                box.style.boxShadow = '0 20px 40px rgba(0,0,0,0.35)';
                box.style.color = '#fff';
                box.style.fontSize = '14px';
                box.style.textAlign = 'center';
                box.id = overlayId + '-text';
                box.textContent = message;
                overlay.appendChild(box);
                document.body.appendChild(overlay);
            } else {
                const t = document.getElementById(overlayId + '-text');
                if (t) t.textContent = message;
            }
            // Prevent keyboard interactions
            if (!this._freezeKeyHandler) {
                this._freezeKeyHandler = (e) => { e.preventDefault(); e.stopPropagation(); };
            }
            document.addEventListener('keydown', this._freezeKeyHandler, true);
        } else {
            if (overlay) overlay.remove();
            if (this._freezeKeyHandler) {
                document.removeEventListener('keydown', this._freezeKeyHandler, true);
            }
        }
    }

    // Poll admin-controlled game status
    async pollGameStatus() {
        try {
            const res = await fetch('/api/game-status');
            const data = await res.json();
            const bannerId = 'game-status-banner';
            let banner = document.getElementById(bannerId);
            const ensureBanner = (text) => {
                if (!banner) {
                    banner = document.createElement('div');
                    banner.id = bannerId;
                    banner.style.position = 'fixed';
                    banner.style.bottom = '16px';
                    banner.style.left = '16px';
                    banner.style.zIndex = '1000';
                    banner.style.background = '#f59e0b';
                    banner.style.color = '#111827';
                    banner.style.padding = '10px 14px';
                    banner.style.borderRadius = '10px';
                    banner.style.fontSize = '13px';
                    banner.style.boxShadow = '0 10px 20px rgba(0,0,0,0.25)';
                    document.body.appendChild(banner);
                }
                banner.innerText = text;
            }
            if (!data.started) {
                ensureBanner('⏳ Event has not started yet. Please wait for the admin to start the event.');
                if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
                this.setFrozenUI(false);
            } else if (data.paused) {
                ensureBanner('⏸ Event paused by admin');
                if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
                // Freeze display at current remaining
                const endMs = Date.now() + (data.remainingMs || 0);
                this.updateTimer(endMs); // one update to reflect current remaining
                this.setFrozenUI(true);
            } else {
                if (banner) banner.remove();
                const endMs = Date.now() + (data.remainingMs || 0);
                this.initializeTimer(endMs);
                this.setFrozenUI(false);
                // Prepare fullscreen guard after event starts
                this.setupFullscreenGuard();
            }
        } catch (e) {
            console.warn('Failed to fetch game status');
        } finally {
            // Poll every 5 seconds
            setTimeout(() => this.pollGameStatus(), 5000);
        }
    }

    // Handle time up - redirect to main page and show team stats
    handleTimeUp() {
        if (this._timeUpHandled) return;
        this._timeUpHandled = true;
        // Save current progress before redirecting
        this.saveGameProgress();
        
        // Show time up message
        this.showMessage("⏰ Time's up! Game has ended. Redirecting to main page...", 'warning');
        
        // Redirect to main page after a short delay
        setTimeout(() => {
            this.showMainPageWithStats();
        }, 2000);
    }

    // Show main page with team statistics
    showMainPageWithStats() {
        // Hide game interface
        const gameContainer = document.getElementById('gameContainer');
        const authContainer = document.getElementById('authContainer');
        
        if (gameContainer) gameContainer.classList.add('hidden');
        if (authContainer) authContainer.classList.remove('hidden');
        
        // Show team stats in a popup
        if (this.currentTeam) {
            const completionTime = this.calculateCompletionTime();
            const progressPercentage = Math.round((this.currentRiddle / this.riddles.length) * 100);
            
            window.popupManager.updatePopupContent('info', `
                <div class="team-stats-popup">
                    <h3>🏁 Game Ended - Team Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-value">${this.currentTeam.name}</span>
                            <span class="stat-label">Team Name</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${progressPercentage}%</span>
                            <span class="stat-label">Progress</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.currentRiddle}/${this.riddles.length}</span>
                            <span class="stat-label">Challenges Completed</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.hintsUsed}/${this.maxHints}</span>
                            <span class="stat-label">Hints Used</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${completionTime}</span>
                            <span class="stat-label">Time Played</span>
                        </div>
                    </div>
                    <p class="stats-message">⏰ Time ran out! Kindly talk with an admin if it is autosubmitted or you can try login your account again.</p>
                </div>
            `);
            
            window.popupManager.showPopup('info');
        }
        
        // Clear current team session
        this.currentTeam = null;
        localStorage.removeItem('techEscapeTeam');
    }

    // Auto-login: restore team session if present
    checkAuthStatus() {
        try {
            const savedTeamRaw = localStorage.getItem('techEscapeTeam');
            if (savedTeamRaw) {
                const team = JSON.parse(savedTeamRaw);
                if (team && team.id) {
                    this.currentTeam = team;
                    this.showGameInterface();
                    this.loadGameProgress();
                }
            }
        } catch {}
    }

    // Handle login
    async handleLogin(e) {
        e.preventDefault();
        
        const teamName = document.getElementById('teamName')?.value?.trim();
        const password = document.getElementById('teamPassword')?.value;

        if (!teamName || !password) {
            this.showMessage('Please enter both team name and password.', 'error');
            return;
        }

        try {
            const resp = await fetch('/api/login-team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamName, password })
            });
            const data = await resp.json();
            if (!resp.ok || !data.success) {
                this.showMessage(data.error || 'Invalid team name or password. Please try again.', 'error');
                return;
            }
            this.currentTeam = {
                id: data.team.id,
                name: data.team.teamname || data.team.name,
                leader: data.team.leader,
                email: data.team.email,
                password: data.team.password,
                size: data.team.size,
                progress: data.team.progress || {
                    currentRiddle: 0,
                    hintsUsed: 0,
                    startTime: new Date().toISOString(),
                    completedRiddles: []
                },
                registeredAt: data.team.registeredAt || new Date().toISOString()
            };
            // Persist session locally so refresh keeps you logged in
            try { localStorage.setItem('techEscapeTeam', JSON.stringify(this.currentTeam)); } catch {}
            this.showMessage('Welcome back! Loading your progress...', 'success');
            setTimeout(() => {
                this.showGameInterface();
                this.loadGameProgress();
            }, 800);
        } catch (err) {
            console.error('Login error:', err);
            this.showMessage('Login failed due to a network error.', 'error');
        }
    }

    // Handle registration
    async handleRegister(e) {
        e.preventDefault();
        
        const teamName = document.getElementById('newTeamName')?.value?.trim();
        const teamLeader = document.getElementById('teamLeader')?.value?.trim();
        const email = document.getElementById('teamEmail')?.value?.trim();
        const password = document.getElementById('newTeamPassword')?.value;
        const teamSize = parseInt(document.getElementById('teamSize')?.value);

        if (!teamName || !teamLeader || !email || !password || !teamSize) {
            this.showMessage('Please fill in all fields.', 'error');
            return;
        }

        // Write-through to serverless API (Supabase)
        try {
            const resp = await fetch('/api/register-team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamName,
                    teamLeader,
                    email,
                    password,
                    teamSize
                })
            });
            const data = await resp.json();
            if (!resp.ok || !data.success) {
                this.showMessage(data.error || 'Registration failed. Please try again.', 'error');
            return;
        }

            // Registration successful — require login instead of starting game
            this.showMessage(`Team \"${teamName}\" registered successfully! Please login to start.`, 'success');
            this.showLoginForm(new Event('click'));
        } catch (err) {
            console.error('Register error:', err);
            this.showMessage('Registration failed due to a network error.', 'error');
        }
    }

    // Show/hide forms
    showRegisterForm(e) {
        e.preventDefault();
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
    }

    showLoginForm(e) {
        e.preventDefault();
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (registerForm) registerForm.classList.add('hidden');
        if (loginForm) loginForm.classList.remove('hidden');
    }

    // Create test team
    createTestTeam() {
        const testTeam = {
            id: 999999,
            name: 'Demo Team',
            leader: 'Test User',
            email: 'test@demo.com',
            password: 'demo123',
            size: 1,
            progress: {
                currentRiddle: 0,
                hintsUsed: 0,
                startTime: new Date().toISOString(),
                completedRiddles: []
            },
            registeredAt: new Date().toISOString()
        };

        // Demo no longer auto-logs; just prefill login fields for convenience
        // Demo helper removed
    }

    // Show game interface
    showGameInterface() {
        const authContainer = document.getElementById('authContainer');
        const gameContainer = document.getElementById('gameContainer');
        const currentTeamName = document.getElementById('currentTeamName');

        // Only allow entering game if event started
        const gate = document.getElementById('game-status-banner');
        const isBlocked = gate && gate.textContent.includes('not started');
        if (isBlocked) {
            this.showMessage('⏳ Event has not started yet. Please wait for the admin to start the event.', 'warning');
            return;
        }
        if (authContainer) authContainer.classList.add('hidden');
        if (gameContainer) {
            gameContainer.classList.remove('hidden');
            gameContainer.setAttribute('aria-hidden', 'false');
        }
        
        if (currentTeamName && this.currentTeam) {
            currentTeamName.textContent = `Team: ${this.currentTeam.name}`;
        }

        // Kick off initial team position fetch
        this.updateTeamPosition();
        if (this._posInterval) clearInterval(this._posInterval);
        this._posInterval = setInterval(() => this.updateTeamPosition(), 5000);

        this.updateHintsDisplay();
        this.startTime = new Date();

        // Restore last visited riddle from localStorage if available
        try {
            const savedIdxRaw = localStorage.getItem('te_currRiddle');
            const savedIdx = savedIdxRaw ? parseInt(savedIdxRaw, 10) : NaN;
            const unlockedMax = this.getUnlockedMaxIndex();
            if (!Number.isNaN(savedIdx) && savedIdx >= 0 && savedIdx < this.riddles.length) {
                this.currentRiddle = Math.min(savedIdx, unlockedMax);
            } else if (unlockedMax >= 0) {
                this.currentRiddle = unlockedMax;
            }
        } catch {}

        // Setup game listeners
        this.setupGameListeners();

        // Load current riddle with delay to ensure DOM is ready
        setTimeout(() => {
            // If a saved index exists (set earlier), ensure it is used for rendering
            try {
                const savedIdxRaw = localStorage.getItem('te_currRiddle');
                const savedIdx = savedIdxRaw ? parseInt(savedIdxRaw, 10) : NaN;
                const unlockedMax = this.getUnlockedMaxIndex();
                if (!Number.isNaN(savedIdx) && savedIdx >= 0 && savedIdx < this.riddles.length) {
                    this.currentRiddle = Math.min(savedIdx, unlockedMax);
                } else if (unlockedMax >= 0) {
                    this.currentRiddle = unlockedMax;
                }
            } catch {}
            this.loadCurrentRiddle();
        }, 300);
    }



    // Initialize game progress for new teams
    initializeGameProgress() {
        this.currentRiddle = 0;
        this.hintsUsed = 0;
        // Initialize progress row
        try {
            if (this.currentTeam) {
                fetch('/api/progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        teamId: this.currentTeam.id,
                        teamname: this.currentTeam.name,
                        deltaMs: 0,
                        completedCount: 0
                    })
                });
            }
        } catch {}
        
        setTimeout(() => {
            this.updateProgressDisplay();
            this.loadCurrentRiddle();
        }, 100);
    }

    // Load game progress for returning teams
    loadGameProgress() {
        if (this.currentTeam?.progress) {
            this.currentRiddle = this.currentTeam.progress.currentRiddle || 0;
            this.hintsUsed = this.currentTeam.progress.hintsUsed || 0;

            if (this.currentRiddle >= this.riddles.length) {
                // Directly redirect to final riddle page
                window.location.href = 'final-riddle.html';
                return;
            }
        }

        this.updateProgressDisplay();
        this.loadCurrentRiddle();
    }

    // Load current riddle
    loadCurrentRiddle() {
        if (this.currentRiddle >= this.riddles.length) {
            this.showFinalClue();
            return;
        }

        const riddle = this.riddles[this.currentRiddle];
        if (!riddle) {
            console.error('Riddle not found at index:', this.currentRiddle);
            return;
        }

        // Wait for DOM elements
        this.waitForElements(() => {
            this.displayRiddle(riddle);
            this.updateNavigationButtons();
        });
    }

    // Update navigation buttons visibility
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            // Show previous button only if not on first challenge
            if (this.currentRiddle > 0) {
                prevBtn.style.display = 'flex';
            } else {
                prevBtn.style.display = 'none';
            }
        }
        // Create/Update a Continue button to jump back to last unlocked challenge
        const unlockedMax = this.getUnlockedMaxIndex();
        // Find a stable nav container
        const navParent = (prevBtn && prevBtn.parentElement) || document.querySelector('.challenge-nav') || document.getElementById('riddleQuestion');
        let contBtn = document.getElementById('continueBtn');
        if (navParent) {
            if (!contBtn) {
                contBtn = document.createElement('button');
                contBtn.id = 'continueBtn';
                contBtn.textContent = 'Continue';
                contBtn.style.marginLeft = '8px';
                contBtn.className = prevBtn ? prevBtn.className : 'btn btn-primary';
                navParent.appendChild(contBtn);
            }
            contBtn.onclick = () => {
                const idx = this.getUnlockedMaxIndex();
                if (idx !== null && idx >= 0) this.jumpToChallenge(idx);
            };
            if (unlockedMax !== null && unlockedMax > this.currentRiddle) {
                contBtn.style.display = 'flex';
                contBtn.textContent = 'Continue';
            } else {
                contBtn.style.display = 'none';
            }
        }
    }

    // Go to previous challenge
    goToPreviousChallenge() {
        if (this.currentRiddle > 0) {
            this.currentRiddle--;
            this.loadCurrentRiddle();
            this.saveGameProgress();
            
            // Show navigation message
            this.showMessage(`↩️ Moved to Challenge ${this.currentRiddle + 1}`, 'info');
        }
    }

    // Jump to a specific challenge index without requiring solve
    jumpToChallenge(index) {
        if (index < 0 || index >= this.riddles.length) return;
        const unlockedMax = this.getUnlockedMaxIndex();
        if (index > unlockedMax) {
            this.showMessage('🔒 Complete previous challenges to unlock this one.', 'warning');
            return;
        }
        this.currentRiddle = index;
        try { localStorage.setItem('te_currRiddle', String(this.currentRiddle)); } catch {}
        this.loadCurrentRiddle();
        this.updateProgressDisplay();
    }

    // Compute the highest unlocked challenge index based on stored progress
    getUnlockedMaxIndex() {
        try {
            const savedIdxRaw = localStorage.getItem('te_currRiddle');
            const idx = savedIdxRaw ? parseInt(savedIdxRaw, 10) : NaN;
            if (!Number.isNaN(idx)) return Math.max(0, Math.min(idx, this.riddles.length - 1));
        } catch {}
        return this.currentRiddle || 0;
    }

    // Wait for DOM elements to be ready
    waitForElements(callback) {
        const riddleNumberEl = document.getElementById('riddleNumber');
        const riddleQuestionEl = document.getElementById('riddleQuestion');

        if (!riddleNumberEl || !riddleQuestionEl) {
            setTimeout(() => this.waitForElements(callback), 100);
            return;
        }

        callback();
    }

    // Display riddle content
    displayRiddle(riddle) {
        const riddleNumberEl = document.getElementById('riddleNumber');
        const riddleQuestionEl = document.getElementById('riddleQuestion');
        const riddleAnswerEl = document.getElementById('riddleAnswer');
        const hintSectionEl = document.getElementById('hintSection');

        // Update riddle display
        if (riddleNumberEl) {
            riddleNumberEl.textContent = this.currentRiddle + 1;
        }

        // Always clear transient overlays from previous challenges
        if (typeof this.removePageHuntArtifacts === 'function') {
            this.removePageHuntArtifacts();
        }

        if (riddleQuestionEl) {
            riddleQuestionEl.innerHTML = riddle.question;
        }

        // Clear previous answer and hide hint
        if (riddleAnswerEl) {
            riddleAnswerEl.value = '';
        }

        if (hintSectionEl) {
            hintSectionEl.classList.add('hidden');
        }

        // Setup interactive elements
        if (riddle.interactive && riddle.setupFunction) {
            setTimeout(() => {
                this[riddle.setupFunction]();
                // After the challenge UI is mounted, ensure the Continue button is available/updated
                this.updateNavigationButtons();
            }, 200);
        }

        // Update hint button
        this.updateHintButton();
        
        // Update progress
        this.updateProgressDisplay();
    }

    // Remove global artifacts created by hidden-object hunts (e.g., challenge 3)
    removePageHuntArtifacts() {
        try {
            const mag = document.getElementById('global-magnifier');
            if (mag && mag.parentNode) mag.parentNode.removeChild(mag);
            const marks = document.querySelectorAll('.page-hunt-mark');
            marks.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
        } catch {}
    }

    // Request fullscreen and discourage tab switching while event runs
    setupFullscreenGuard() {
        const docEl = document.documentElement;
        const requestFS = () => {
            const fn = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
            if (fn) try { fn.call(docEl); } catch {}
        };
        const ensureFS = () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                requestFS();
            }
        };
        if (!this._fsInit) {
            this._fsInit = true;
            // Prompt once on first user interaction to satisfy browser gesture requirement
            const onFirstInteract = () => { ensureFS(); window.removeEventListener('click', onFirstInteract); window.removeEventListener('keydown', onFirstInteract); };
            window.addEventListener('click', onFirstInteract, { once: true });
            window.addEventListener('keydown', onFirstInteract, { once: true });
            // If fullscreen exits, try to re-enter on next interaction
            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) {
                    window.addEventListener('click', onFirstInteract, { once: true });
                    window.addEventListener('keydown', onFirstInteract, { once: true });
                }
            });
            // Soft deterrent: blur/focus handlers to remind users
            window.addEventListener('blur', () => {
                this.showMessage('⚠️ Please stay on the game tab during the event.', 'warning');
            });
        }
    }

    // Fetch and render current team position from leaderboard API
    async updateTeamPosition() {
        try {
            const el = document.getElementById('teamPosition');
            if (!el || !this.currentTeam) return;
            const res = await fetch('/api/leaderboard');
            const data = await res.json();
            if (!data.success || !Array.isArray(data.leaderboard)) return;
            const total = data.leaderboard.length;
            const my = data.leaderboard.find(r => (r.teamname || r.team_id) === this.currentTeam.name || (r.teamname || '').toLowerCase() === (this.currentTeam.name || '').toLowerCase());
            if (my) {
                el.textContent = `Team Position: ${my.rank}/${total}`;
                el.title = `Rank ${my.rank} of ${total} • ${my.completed_count} solved • ${Math.floor((my.total_time_ms||0)/60000)}m`;
            } else {
                el.textContent = `Team Position: --/${total || '--'}`;
            }
        } catch {}
    }

    // Handle answer submission
    handleAnswer(e) {
        e.preventDefault();
        
        const answerInput = document.getElementById('riddleAnswer');
        if (!answerInput) return;

        const answer = answerInput.value.trim();
        const correctAnswer = this.riddles[this.currentRiddle].answer;

        if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
            // Update success popup content
            window.popupManager.updatePopupContent('success', `
                <p><strong>🎉 Correct!</strong></p>
                <p>Challenge ${this.currentRiddle + 1} completed successfully!</p>
                <p>Moving to the next challenge...</p>
            `);
            
            window.popupManager.showPopup('success');
            
            // Track time delta for leaderboard
            const deltaMs = 2000; // approximate step; real timing handled via startTime/endTime if needed
            try {
                if (this.currentTeam) {
                    fetch('/api/progress', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            teamId: this.currentTeam.id,
                            teamname: this.currentTeam.name,
                            deltaMs,
                            completedCount: Math.min(this.currentRiddle + 1, this.riddles.length),
                            finished: this.currentRiddle + 1 >= this.riddles.length
                        })
                    });
                }
            } catch {}
            
            this.currentRiddle++;
            try { localStorage.setItem('te_currRiddle', String(this.currentRiddle)); } catch {}
            this.saveGameProgress();

            setTimeout(() => {
                if (this.currentRiddle >= this.riddles.length) {
                    this.showFinalClue();
                } else {
                    this.loadCurrentRiddle();
                }
            }, 2000);
        } else {
            // Update error popup content
            window.popupManager.updatePopupContent('error', `
                <p><strong>❌ Incorrect Answer</strong></p>
                <p>That's not quite right. Try again or use a hint!</p>
                <p><em>Challenge ${this.currentRiddle + 1}</em></p>
            `);
            
            window.popupManager.showPopup('error');
            
            // Add shake animation
            answerInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                answerInput.style.animation = '';
            }, 500);
        }
    }

    // Show hint
    showHint() {
        if (this.hintsUsed >= this.maxHints) {
            this.showMessage('No hints remaining!', 'warning');
            return;
        }

        this.hintsUsed++;
        this.updateHintsDisplay();
        this.saveGameProgress();

        // Array of random hints
        const randomHints = [
            "Keep searching. In Tech Escape, only sharp minds survive.",
            "Do you really expect a shortcut on this level?",
            "Do you really think it's going to be that easy?",
            "Looking for hints is like searching for treasure in plain sight—you have to work for what's hidden.",
            "Real players know: the toughest clues are the ones you solve on your own"
        ];

        // Select a random hint
        const randomHint = randomHints[Math.floor(Math.random() * randomHints.length)];
        
        // Update hint popup content
        window.popupManager.updatePopupContent('hint', `
            <p><strong>Challenge ${this.currentRiddle + 1} Hint:</strong></p>
            <p>${randomHint}</p>
            <p><em>Hints used: ${this.hintsUsed}/${this.maxHints}</em></p>
        `);
        
        window.popupManager.showPopup('hint');
        this.updateHintButton();
    }

    // Update hint button state
    updateHintButton() {
        const hintBtn = document.getElementById('hintBtn');
        if (!hintBtn) return;

        if (this.hintsUsed >= this.maxHints) {
            hintBtn.disabled = true;
            hintBtn.innerHTML = '<i class="fas fa-lightbulb"></i> No hints left';
        } else {
            hintBtn.disabled = false;
            hintBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Hint';
        }
    }

    // Update hints display
    updateHintsDisplay() {
        const hintsCountEl = document.getElementById('hintsCount');
        if (hintsCountEl) {
            hintsCountEl.textContent = this.maxHints - this.hintsUsed;
        }
    }

    // Update progress display
    updateProgressDisplay() {
        const progressFillEl = document.getElementById('progressFill');
        const progressNodesEl = document.getElementById('progressNodes');

        if (progressFillEl) {
            const progressPercentage = (this.currentRiddle / this.riddles.length) * 100;
            progressFillEl.style.width = `${progressPercentage}%`;
        }

        if (progressNodesEl) {
            this.createProgressNodes(progressNodesEl);
        }
    }

    // Create progress nodes
    createProgressNodes(container) {
        container.innerHTML = '';

        for (let i = 0; i < this.riddles.length; i++) {
            const node = document.createElement('div');
            node.className = 'progress-node';

            const circle = document.createElement('div');
            circle.className = 'node-circle';

            if (i < this.currentRiddle) {
                circle.classList.add('completed');
                circle.innerHTML = '<i class="fas fa-check"></i>';
            } else if (i === this.currentRiddle) {
                circle.classList.add('current');
                circle.textContent = i + 1;
            } else {
                circle.textContent = i + 1;
            }

            const label = document.createElement('div');
            label.className = 'node-label';
            label.textContent = `Challenge ${i + 1}`;

            node.appendChild(circle);
            node.appendChild(label);
            container.appendChild(node);
        }
    }

    // Show final clue
    showFinalClue() {
        this.endTime = new Date();
        this.saveGameProgress();

        // Show completion message briefly, then redirect
        this.showMessage('🎊 Congratulations! You completed Tech Escape!', 'success');
        
        // Redirect to final riddle page after a short delay
        setTimeout(() => {
            window.location.href = 'final-riddle.html';
        }, 2000);
    }

    // Start celebration sequence
    startCelebrationSequence() {
        const finalSection = document.getElementById('finalClueSection');
        if (!finalSection) return;

        const completionTime = this.calculateCompletionTime();
        
        finalSection.innerHTML = `
            <div class="container">
                <div class="celebration-container">
                    <div class="celebration-animation">
                        <div class="trophy-animation">🏆</div>
                        <div class="confetti"></div>
                        <div class="sparkles"></div>
                    </div>
                    
                    <div class="celebration-text">
                        <h1 class="celebration-title">🎉 CONGRATULATIONS! 🎉</h1>
                        <h2 class="celebration-subtitle">You have mastered Tech Escape!</h2>
                        <div class="celebration-stats">
                            <div class="stat-item">
                                <span class="stat-value">${completionTime}</span>
                                <span class="stat-label">Completion Time</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${this.hintsUsed}/3</span>
                                <span class="stat-label">Hints Used</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">#1</span>
                                <span class="stat-label">Achievement</span>
                            </div>
                        </div>
                        
                        <div class="final-message">
                            <h3>🎯 Your Final Mission</h3>
                            <p>Head to the <strong>IEEE SIT booth</strong> and show this completion screen to collect your prize!</p>
                            <div class="completion-code">
                                <strong>Completion Code: TECH_ESCAPE_${Date.now().toString(36).toUpperCase()}</strong>
                            </div>
                        </div>
                        
                        <button class="play-again-btn" onclick="location.reload()">
                            🔄 Play Again
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Trigger celebration animations
        setTimeout(() => {
            const animationEl = document.querySelector('.celebration-animation');
            if (animationEl) animationEl.classList.add('active');
        }, 500);
    }



    // Calculate completion time
    calculateCompletionTime() {
        if (!this.startTime || !this.endTime) return '--:--';

        const timeDiff = this.endTime - this.startTime;
        const minutes = Math.floor(timeDiff / 60000);
        const seconds = Math.floor((timeDiff % 60000) / 1000);

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Handle logout
    handleLogout() {
        if (confirm('Are you sure you want to logout? Your progress will be saved.')) {
            this.saveGameProgress();
            
            // Clear session
            this.currentTeam = null;
            localStorage.removeItem('techEscapeTeam');
            
            // Reset state
            this.currentRiddle = 0;
            this.hintsUsed = 0;
            this.startTime = null;
            this.endTime = null;
            
            // Show auth screen
            const gameContainer = document.getElementById('gameContainer');
            const finalClueSection = document.getElementById('finalClueSection');
            const authContainer = document.getElementById('authContainer');
            
            if (gameContainer) gameContainer.classList.add('hidden');
            if (finalClueSection) finalClueSection.classList.add('hidden');
            if (authContainer) authContainer.classList.remove('hidden');
            
            // Reset forms
            const loginForm = document.getElementById('login');
            const registerForm = document.getElementById('register');
            const loginFormContainer = document.getElementById('loginForm');
            const registerFormContainer = document.getElementById('registerForm');
            
            if (loginForm) loginForm.reset();
            if (registerForm) registerForm.reset();
            if (loginFormContainer) loginFormContainer.classList.remove('hidden');
            if (registerFormContainer) registerFormContainer.classList.add('hidden');
            
            this.showMessage('Logged out successfully!', 'success');
        }
    }

    // Save game progress
    saveGameProgress() {
        if (!this.currentTeam) return;

        this.currentTeam.progress = {
            currentRiddle: this.currentRiddle,
            hintsUsed: this.hintsUsed,
            startTime: this.startTime ? this.startTime.toISOString() : new Date().toISOString(),
            completedAt: this.endTime ? this.endTime.toISOString() : null,
            completedRiddles: Array.from({length: this.currentRiddle}, (_, i) => i)
        };

        // Update in teams array
        const teamIndex = this.teams.findIndex(t => t.id === this.currentTeam.id);
        if (teamIndex !== -1) {
            this.teams[teamIndex] = this.currentTeam;
            this.saveTeams();
        }

        // Update localStorage
        localStorage.setItem('techEscapeTeam', JSON.stringify(this.currentTeam));
    }

    // Load teams from localStorage
    loadTeams() {
        try {
            const savedTeams = localStorage.getItem('techEscapeTeams');
            return savedTeams ? JSON.parse(savedTeams) : [];
        } catch (error) {
            console.error('Error loading teams:', error);
            return [];
        }
    }

    // Save teams to localStorage
    saveTeams() {
        // No-op: local storage removed
    }

    // Show message with throttling
    showMessage(text, type = 'info') {
        // Throttle error messages
        if (type === 'error') {
            const now = Date.now();
            if (now - this.lastErrorTime < this.errorThrottleMs) {
                console.log('Error message throttled:', text);
                return;
            }
            this.lastErrorTime = now;
        }

        const messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) {
            console.error('Message container not found');
            return;
        }

        const message = document.createElement('div');
        message.className = `message ${type}`;

        const icon = this.getMessageIcon(type);
        message.innerHTML = `${icon} <span>${text}</span>`;

        messageContainer.appendChild(message);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 5000);
    }

    // Get message icon
    getMessageIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    // Handle IEEE logo click
    handleIeeeLogoClick() {
        // Only reveal on the first riddle while in the game interface
        const gameContainer = document.getElementById('gameContainer');
        const isInGame = !!(gameContainer && !gameContainer.classList.contains('hidden'));
        const isFirstRiddle = this.currentRiddle === 0;

        if (!isInGame || !isFirstRiddle) {
            // Outside first riddle: do nothing, no hints
            return;
        }

        // Reveal flag once per session
        if (this._logoFlagShown) {
            this.showMessage('✅ Already discovered. Solve the challenge to proceed!', 'info');
            return;
        }

        const ieeeLogo = document.querySelector('.ieee-logo');
        const flag = ieeeLogo ? ieeeLogo.getAttribute('data-flag') : null;
        if (!flag) return;
        
        this._logoFlagShown = true;
        this.showMessage(`🎯 You found a hidden flag: ${flag}`, 'success');
    }

    // === CHALLENGE SETUP FUNCTIONS ===

    // Challenge 1: Hidden Flag Challenge
    setupChallenge1() {
        // Hidden flag: IEEE{hidden_flag_found}
        // This challenge does not have interactive inputs, so no setup needed here

    }

    // Challenge 2: Hidden Chips (Alt‑reveal)
    setupChallenge2() {
        const box = document.getElementById('hunt2');
        const progress = document.getElementById('hunt2Progress');
        if (!box || !progress) return;

        const TOTAL = 7;
        let found = 0;
        let altDown = false;

        function updateProgress() {
            progress.textContent = `Found: ${found}/${TOTAL}`;
            if (found === TOTAL) {
                progress.innerHTML = '🎉 All found! Flag: <code>HIDDEN{stealth_hunter_2}</code>';
                window.techEscapeGame?.showMessage('🕵️ Chips secured!', 'success');
            }
        }

        const chips = [];
        for (let i = 0; i < TOTAL; i++) {
            const chip = document.createElement('div');
            chip.className = 'hidden-chip';
            chip.style.position = 'absolute';
            chip.style.width = '16px';
            chip.style.height = '16px';
            chip.style.borderRadius = '50%';
            chip.style.transform = 'translate(-50%, -50%)';
            chip.style.opacity = '0';
            chip.style.pointerEvents = 'auto';
            chip.style.transition = 'opacity 80ms linear';
            // Random positions (avoid edges)
            const left = 8 + Math.random() * 84;
            const top = 8 + Math.random() * 84;
            chip.style.left = left + '%';
            chip.style.top = top + '%';

            chip.dataset.found = '0';
            chip.onclick = () => {
                if (chip.dataset.found === '1') return;
                chip.dataset.found = '1';
                found++;
                chip.style.opacity = '1';
                chip.style.background = '#10b981';
                chip.style.boxShadow = '0 0 10px rgba(16,185,129,.8)';
                updateProgress();
            };
            box.appendChild(chip);
            chips.push(chip);
        }

        function refreshReveal() {
            for (const chip of chips) {
                if (chip.dataset.found === '1') continue;
                chip.style.background = altDown ? 'rgba(16,185,129,.25)' : 'transparent';
                chip.style.boxShadow = altDown ? '0 0 6px rgba(16,185,129,.3)' : 'none';
                chip.style.opacity = altDown ? '0.18' : '0';
            }
        }

        const onKeyDown = (e) => {
            if (e.key === 'Alt') { altDown = true; refreshReveal(); }
        };
        const onKeyUp = (e) => {
            if (e.key === 'Alt') { altDown = false; refreshReveal(); }
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        // Safety: stop revealing on mouse leave
        box.addEventListener('mouseleave', () => { altDown = false; refreshReveal(); });

        updateProgress();
    }

    // Challenge 3: Find Me on the Page (hidden marks across the viewport)
    setupChallenge3() {
        const progress = document.getElementById('hunt3ProgressGlobal');
        if (!progress) return;

        const TOTAL = 8;
        let found = 0;
        const marks = [];

        function update(){
            progress.textContent = `Found: ${found}/${TOTAL}`;
            if (found===TOTAL){
                progress.innerHTML = '🎉 You found them all! Flag: <code>HIDDEN{page_sleuth_3}</code>';
                window.techEscapeGame?.showMessage('🧿 Page mastered!', 'success');
            }
        }

        // Candidate anchor points around the page (corners, header, footer-ish)
        const spots = [
            { top:'12px', left:'12px' },
            { top:'12px', right:'16px' },
            { bottom:'16px', left:'16px' },
            { bottom:'16px', right:'16px' },
            { top:'50%', left:'8px' },
            { top:'50%', right:'8px' },
            { top:'120px', left:'50%' },
            { bottom:'120px', left:'50%' },
            { top:'80px', right:'200px' },
            { bottom:'80px', left:'200px' }
        ];

        // Shuffle and pick first TOTAL
        for (let i=spots.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [spots[i],spots[j]]=[spots[j],spots[i]]; }
        const chosen = spots.slice(0, TOTAL);

        for (const s of chosen){
            const m = document.createElement('div');
            m.style.position='fixed';
            m.style.width='10px'; m.style.height='10px';
            m.style.borderRadius='50%';
            m.style.background='rgba(99,102,241,0.10)';
            m.style.boxShadow='0 0 0 rgba(0,0,0,0)';
            m.style.transition='box-shadow 120ms ease, transform 120ms ease, background 120ms ease';
            Object.assign(m.style, s);
            m.style.zIndex='1500';
            m.title='';
            m.dataset.found='0';
            m.className = 'page-hunt-mark';
            // Hover glow still works
            m.onmouseenter=()=>{ if(m.dataset.found==='0'){ m.style.boxShadow='0 0 6px rgba(99,102,241,.5)'; } };
            m.onmouseleave=()=>{ if(m.dataset.found==='0'){ m.style.boxShadow='none'; } };
            document.body.appendChild(m); marks.push(m);
        }

        // Remove any existing magnifier to prevent duplicates
        const existingMag = document.getElementById('global-magnifier');
        if (existingMag) existingMag.remove();

        // Add draggable magnifier
        const mag = document.createElement('div');
        mag.textContent = '🔍';
        mag.style.position='fixed';
        mag.style.left='calc(50% - 20px)';
        mag.style.top='calc(60% - 20px)';
        mag.style.fontSize='28px';
        mag.style.cursor='grab';
        mag.style.userSelect='none';
        mag.style.zIndex='1600';
        mag.id = 'global-magnifier';
        document.body.appendChild(mag);

        let dragging=false, offsetX=0, offsetY=0;
        mag.onmousedown=(e)=>{ dragging=true; mag.style.cursor='grabbing'; offsetX=e.clientX- mag.getBoundingClientRect().left; offsetY=e.clientY- mag.getBoundingClientRect().top; e.preventDefault(); };
        document.addEventListener('mouseup',()=>{ dragging=false; mag.style.cursor='grab'; });
        document.addEventListener('mousemove',(e)=>{
            if(!dragging) return;
            const x=e.clientX-offsetX, y=e.clientY-offsetY;
            mag.style.left=x+'px'; mag.style.top=y+'px';
            // Check collision with marks (proximity)
            const mRect = mag.getBoundingClientRect();
            for (const d of marks){
                if (d.dataset.found==='1') continue;
                const r = d.getBoundingClientRect();
                const intersect = !(r.right < mRect.left || r.left > mRect.right || r.bottom < mRect.top || r.top > mRect.bottom);
                if (intersect){
                    d.dataset.found='1';
                    d.style.background='rgba(34,197,94,.85)';
                    d.style.boxShadow='0 0 10px rgba(34,197,94,.9)';
                    d.style.transform='scale(1.2)';
                    found++; update();
                }
            }
        });

        update();
    }

    // Challenge 4: Fallout-style Hacking
    setupChallenge4() {
        const wordsEl = document.getElementById('hackWords');
        const infoEl = document.getElementById('hackInfo');
        if (!wordsEl || !infoEl) return;

        const WORDS = ['NEBULA','ROCKET','PLASMA','PHOTON','QUARKS','GALAXY','ASTERO','IONIZE','ORBITA','PULSAR','COSMIC','MODULE','WARPED','SYSTEM','VECTOR','BINARY'];
        const secret = WORDS[Math.floor(Math.random()*WORDS.length)];
        let attempts = 6;

        function likeness(a,b){
            let k=0; for(let i=0;i<Math.min(a.length,b.length);i++){ if(a[i]===b[i]) k++; } return k;
        }

        wordsEl.innerHTML = '';
        for (const w of WORDS){
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = w; btn.className='mono';
            btn.style.padding='8px'; btn.style.border='1px solid var(--border-color)'; btn.style.borderRadius='6px';
            btn.onclick = () => {
                if (attempts<=0) return;
                if (w === secret){
                    infoEl.innerHTML = 'ACCESS GRANTED → Flag: <code>HACK{likeness_4_of_7}</code>';
                    return;
                }
                attempts--;
                infoEl.textContent = `Likeness: ${likeness(w,secret)} | Attempts left: ${attempts}`;
                if (attempts===0){ infoEl.textContent += ' | Locked. Try again in a bit.'; }
            };
            li.appendChild(btn); wordsEl.appendChild(li);
        }
    }

    // Challenge 5: Cipher Cascade
    setupChallenge5() {
        const b64El = document.getElementById('b64Src');
        const s1 = document.getElementById('step1');
        const s2 = document.getElementById('step2');
        const s3 = document.getElementById('step3');
        const btn = document.getElementById('cascadeBtn');
        const res = document.getElementById('cascadeResult');
        if (!b64El || !s1 || !s2 || !s3 || !btn || !res) return;

        const final = 'CRYPTO{layer_cake_done}';
        const day = new Date().getDate();
        const rot13 = (str)=>str.replace(/[a-zA-Z]/g,c=>{
            const base=c<='Z'?65:97; return String.fromCharCode(((c.charCodeAt(0)-base+13)%26)+base);
        });
        const caesar=(str,shift)=>str.replace(/[a-zA-Z]/g,c=>{
            const base=c<='Z'?65:97; return String.fromCharCode(((c.charCodeAt(0)-base+shift+26*10)%26)+base);
        });

        // Build source for Step 1: base64(rot13(caesar(final, -day)))
        const src1 = btoa(rot13(caesar(final, -day)));
        b64El.textContent = src1;

        btn.onclick = () => {
            // validate step 1
            const want1 = atob(src1);
            if (s1.value.trim() !== want1) { res.textContent='Step 1 incorrect'; return; }
            s2.disabled = false;
            const want2 = rot13(want1);
            if (s2.value.trim() !== want2) { res.textContent='Step 2 incorrect or empty'; return; }
            s3.disabled = false;
            const want3 = caesar(want2, day);
            if (s3.value.trim() !== want3) { res.textContent='Step 3 incorrect'; return; }
            res.innerHTML = '🎉 Decrypted! Flag: <code>CRYPTO{layer_cake_done}</code>';
            this.showMessage('🔓 Cascade cracked!', 'success');
        };
    }

    // Challenge 6: Maze Letters
    setupChallenge6() {
        const el = document.getElementById('maze');
        const hud = document.getElementById('mazeHUD');
        const up=document.getElementById('upBtn'),dn=document.getElementById('downBtn'),lf=document.getElementById('leftBtn'),rt=document.getElementById('rightBtn');
        if(!el||!hud||!up||!dn||!lf||!rt) return;

        const map = [
            '#######',
            '#S..#E#',
            '#.#.#.#',
            '#A..#.#',
            '#.###.#',
            '#..Z..#',
            '#######'
        ];
        const seq = ['M','A','Z','E'];
        let collected = 0;
        let pos = { r:1, c:1 };

        function render(){
            el.innerHTML='';
            for(let r=0;r<map.length;r++){
                for(let c=0;c<map[0].length;c++){
                    const cell = document.createElement('div');
                    cell.style.width='28px';cell.style.height='28px';cell.style.border='1px solid var(--border-color)';cell.style.borderRadius='4px';
                    const ch = map[r][c];
                    if (r===pos.r && c===pos.c) { cell.style.background='#3b82f6'; }
                    else if (ch==='#') cell.style.background='#111827';
                    else if (['M','A','Z','E'].includes(ch)) { cell.textContent=ch; cell.style.textAlign='center'; cell.style.lineHeight='28px'; }
                    else cell.style.background='var(--bg-tertiary)';
                    el.appendChild(cell);
                }
            }
            hud.textContent = `Collected: ${seq.slice(0,collected).join('')} _`;
        }

        function move(dr,dc){
            const nr=pos.r+dr,nc=pos.c+dc; const ch = map[nr][nc];
            if (ch==='#') return;
            pos={r:nr,c:nc};
            if (['M','A','Z','E'].includes(ch)){
                if (ch===seq[collected]) collected++;
                else collected=0; // wrong order resets
                if (collected===seq.length){
                    hud.innerHTML = '🎉 Path complete! Flag: <code>MAZE{left_left_up_right_up_right}</code>';
                }
            }
            render();
        }

        document.addEventListener('keydown', (e)=>{
            const k=e.key.toLowerCase();
            if(k==='arrowup'||k==='w') move(-1,0);
            if(k==='arrowdown'||k==='s') move(1,0);
            if(k==='arrowleft'||k==='a') move(0,-1);
            if(k==='arrowright'||k==='d') move(0,1);
        });
        up.onclick=()=>move(-1,0); dn.onclick=()=>move(1,0); lf.onclick=()=>move(0,-1); rt.onclick=()=>move(0,1);
        render();
    }

    // Helper functions for checking answers
    checkQuizAnswers(inputs, answers, resultId) {
        const userAnswers = inputs.map(id => {
            const el = document.getElementById(id);
            return el ? el.value.toLowerCase().trim() : '';
        });
        
        const correct = userAnswers.every((answer, i) => 
            answers[i].toLowerCase().includes(answer) && answer.length > 2
        );
        
        if (correct) {
            document.getElementById(resultId).style.display = 'block';
            this.showMessage('🎉 All correct! Flag revealed!', 'success');
        }
    }

    checkConversionAnswers(inputs, answers, resultId) {
        const userAnswers = inputs.map(id => {
            const el = document.getElementById(id);
            return el ? el.value.trim() : '';
        });
        
        const correct = userAnswers.every((answer, i) => answer === answers[i]);
        
        if (correct) {
            document.getElementById(resultId).style.display = 'block';
            this.showMessage('🎉 Perfect conversions! Flag revealed!', 'success');
        }
    }

    checkProgAnswers(inputs, answers, resultId) {
        const userAnswers = inputs.map(id => {
            const el = document.getElementById(id);
            return el ? el.value.toLowerCase().trim() : '';
        });
        
        const correct = userAnswers.every((answer, i) => answer === answers[i].toLowerCase());
        
        if (correct) {
            document.getElementById(resultId).style.display = 'block';
            this.showMessage('🎉 Programming logic mastered! Flag revealed!', 'success');
        }
    }

    checkCircuitAnswers(inputs, answers, resultId) {
        const userAnswers = inputs.map(id => {
            const el = document.getElementById(id);
            return el ? el.value.trim() : '';
        });
        
        const correct = userAnswers.every((answer, i) => answer === answers[i]);
        
        if (correct) {
            document.getElementById(resultId).style.display = 'block';
            this.showMessage('🎉 Circuit analysis complete! Flag revealed!', 'success');
        }
    }

    checkSecurityAnswers(inputs, answers, resultId) {
        const userAnswers = inputs.map(id => {
            const el = document.getElementById(id);
            return el ? el.value.toLowerCase().trim() : '';
        });
        
        const correct = userAnswers.every((answer, i) => 
            answers[i].toLowerCase().includes(answer) || answer.includes(answers[i].toLowerCase())
        );
        
        if (correct) {
            document.getElementById(resultId).style.display = 'block';
            this.showMessage('🎉 Security expert certified! Flag revealed!', 'success');
        }
    }

    checkAlgoAnswers(inputs, answers, resultId) {
        const userAnswers = inputs.map(id => {
            const el = document.getElementById(id);
            return el ? el.value.toLowerCase().trim() : '';
        });
        
        const correct = userAnswers.every((answer, i) => 
            answer === answers[i].toLowerCase() || 
            (i === 0 && answer.includes('n')) // O(n) variants
        );
        
        if (correct) {
            document.getElementById(resultId).style.display = 'block';
            this.showMessage('🎉 Algorithm master! Flag revealed!', 'success');
        }
    }
}

// CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    .grid-btn.clicked {
        background: var(--primary-color);
        color: white;
        transform: scale(0.95);
    }

    .grid-btn.correct.clicked {
        background: var(--success-color);
    }

    .protocol-btn.pattern-highlight {
        background: var(--warning-color) !important;
        color: white !important;
        transform: scale(1.1);
        box-shadow: 0 0 20px rgba(255, 153, 0, 0.6);
    }

    .protocol-btn.player-clicked {
        background: var(--accent-color) !important;
        color: white !important;
        transform: scale(0.95);
    }

    .celebration-animation.active .trophy-animation {
        animation: bounce 2s infinite;
    }

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-30px); }
        60% { transform: translateY(-15px); }
    }
`;
document.head.appendChild(style);

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing Tech Escape Game...');
    
    // Ensure single instance
    if (!window.techEscapeGame) {
        window.techEscapeGame = new TechEscapeGame();
        console.log('✅ Tech Escape Game initialized successfully');
    }
});


