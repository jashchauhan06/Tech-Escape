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
            this.initializeTimer();
            // Removed auto-login via localStorage; require explicit login
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
               <p>Your first challenge is to find the hidden flag! Look carefully around this interface...</p>
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
                    <h4>🧮 Binary & Hex Challenge</h4>
                    <p>Solve these number system conversions manually:</p>
                    <div class="conversion-challenge">
                        <div class="conversion-problems">
                            <div class="problem">
                                <p><strong>1.</strong> Convert binary <code>11010110</code> to decimal:</p>
                                <input type="number" class="conversion-input" id="prob1" placeholder="Decimal answer">
                            </div>
                            <div class="problem">
                                <p><strong>2.</strong> Convert hexadecimal <code>2F</code> to decimal:</p>
                                <input type="number" class="conversion-input" id="prob2" placeholder="Decimal answer">
                            </div>
                            <div class="problem">
                                <p><strong>3.</strong> Convert decimal <code>85</code> to binary (8-bit):</p>
                                <input type="text" class="conversion-input" id="prob3" placeholder="Binary answer">
                            </div>
                        </div>
                        <div class="conversion-result" id="conversionResult" style="display:none;">
                            <p>🎉 All correct! <strong>Flag:</strong> <code>CONVERT{214_47_01010101}</code></p>
                        </div>
                    </div>
                    <p><strong>Solve all three to get the flag:</strong></p>
                `,
                answer: 'CONVERT{214_47_01010101}',
                hint: 'Do you really expect a shortcut on this level?',
                explanation: '11010110₂ = 214₁₀, 2F₁₆ = 47₁₀, 85₁₀ = 01010101₂',
                interactive: true,
                setupFunction: 'setupChallenge2'
            },
            {
                id: 3,
                question: `
                    <h4>💻 Basic Programming Logic</h4>
                    <p>Solve these simple programming problems:</p>
                    <div class="programming-challenge">
                        <div class="prog-problems">
                            <div class="prog-problem">
                                <p><strong>1.</strong> What will this code output?</p>
                                <pre><code>x = 5
y = 3
print(x + y * 2)</code></pre>
                                <input type="number" class="prog-input" id="prog1" placeholder="Output">
                            </div>
                            <div class="prog-problem">
                                <p><strong>2.</strong> Complete the missing keyword:</p>
                                <pre><code>if x > 10:
    print("big")
_____
    print("small")</code></pre>
                                <input type="text" class="prog-input" id="prog2" placeholder="Missing keyword">
                            </div>
                            <div class="prog-problem">
                                <p><strong>3.</strong> How many times will this loop run?</p>
                                <pre><code>for i in range(3, 8):
    print(i)</code></pre>
                                <input type="number" class="prog-input" id="prog3" placeholder="Number of iterations">
                            </div>
                        </div>
                        <div class="prog-result" id="progResult" style="display:none;">
                            <p>🎉 Correct! <strong>Flag:</strong> <code>LOGIC{11_else_5}</code></p>
                        </div>
                    </div>
                    <p><strong>Solve all to get the flag:</strong></p>
                `,
                answer: 'LOGIC{11_else_5}',
                hint: 'Keep searching. In Tech Escape, only sharp minds survive.',
                explanation: '5+3*2=11, missing keyword is "else", range(3,8) runs 5 times (3,4,5,6,7)',
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
    initializeTimer() {
        const gameDuration = 15 * 60 * 1000; // 15 minutes
        const startTime = Date.now();
        const endTime = startTime + gameDuration;

        this.updateTimer(endTime);

        setInterval(() => {
            this.updateTimer(endTime);
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
            
            this.handleTimeUp();
        }
    }

    // Handle time up - redirect to main page and show team stats
    handleTimeUp() {
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

    // Auto-login disabled
    checkAuthStatus() {}

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
        const loginName = document.getElementById('teamName');
        const loginPass = document.getElementById('teamPassword');
        if (loginName) loginName.value = testTeam.name;
        if (loginPass) loginPass.value = testTeam.password;
        this.showMessage('Demo team filled in login form. Click Start Adventure to log in.', 'info');
    }

    // Show game interface
    showGameInterface() {
        const authContainer = document.getElementById('authContainer');
        const gameContainer = document.getElementById('gameContainer');
        const currentTeamName = document.getElementById('currentTeamName');

        if (authContainer) authContainer.classList.add('hidden');
        if (gameContainer) gameContainer.classList.remove('hidden');
        
        if (currentTeamName && this.currentTeam) {
            currentTeamName.textContent = this.currentTeam.name;
        }

        this.updateHintsDisplay();
        this.startTime = new Date();

        // Setup game listeners
        this.setupGameListeners();

        // Load current riddle with delay to ensure DOM is ready
        setTimeout(() => {
            this.loadCurrentRiddle();
        }, 300);
    }



    // Initialize game progress for new teams
    initializeGameProgress() {
        this.currentRiddle = 0;
        this.hintsUsed = 0;
        
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
            }, 200);
        }

        // Update hint button
        this.updateHintButton();
        
        // Update progress
        this.updateProgressDisplay();
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
            
            this.currentRiddle++;
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
        // Get the flag from the data attribute
        const ieeeLogo = document.querySelector('.ieee-logo');
        const flag = ieeeLogo ? ieeeLogo.getAttribute('data-flag') : null;
        
        if (flag) {
            // Show a message with the flag
            this.showMessage(`🎯 You found a hidden flag: ${flag}`, 'success');
            
            // Also log to console for debugging
            console.log('%c🎯 IEEE Logo Clicked!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
            console.log('%c🏁 Flag found:', 'color: #ffaa00; font-size: 14px;');
            console.log(`%c${flag}`, 'color: #ffaa00; font-size: 16px; font-weight: bold;');
        } else {
            this.showMessage('🔍 Keep looking! The flag might be hidden elsewhere...', 'info');
        }
    }

    // === CHALLENGE SETUP FUNCTIONS ===

    // Challenge 1: Hidden Flag Challenge
    setupChallenge1() {
        // Hidden flag: IEEE{hidden_flag_found}
        // This challenge does not have interactive inputs, so no setup needed here
        
        // Log hidden flag to console for advanced players
        console.log('%c🔍 Hidden Flag Challenge', 'color: #00aaff; font-size: 16px; font-weight: bold;');
        console.log('%c💡 Check the page source, inspect elements, or look in the console for clues!', 'color: #00ffaa; font-size: 12px;');
        console.log('%c🏁 Flag: IEEE{hidden_flag_found}', 'color: #ffaa00; font-size: 14px; font-weight: bold;');
    }

    // Challenge 2: Number System Conversion
    setupChallenge2() {
        const inputs = ['prob1', 'prob2', 'prob3'];
        const answers = ['214', '47', '01010101'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.checkConversionAnswers(inputs, answers, 'conversionResult');
                });
            }
        });
    }

    // Challenge 3: Programming Logic
    setupChallenge3() {
        const inputs = ['prog1', 'prog2', 'prog3'];
        const answers = ['11', 'else', '5'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.checkProgAnswers(inputs, answers, 'progResult');
                });
            }
        });
    }

    // Challenge 4: Electrical Engineering
    setupChallenge4() {
        const inputs = ['circ1', 'circ2', 'circ3'];
        const answers = ['4.8', '3', '20'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.checkCircuitAnswers(inputs, answers, 'circuitResult');
                });
            }
        });
    }

    // Challenge 5: Cybersecurity
    setupChallenge5() {
        const inputs = ['sec1', 'sec2', 'sec3'];
        const answers = ['tech escape', '443', 'database'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.checkSecurityAnswers(inputs, answers, 'securityResult');
                });
            }
        });
    }

    // Challenge 6: Algorithm & Logic
    setupChallenge6() {
        const inputs = ['algo1', 'algo2', 'algo3', 'algo4'];
        const answers = ['o(n)', 'inorder', '42', 'stack'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.checkAlgoAnswers(inputs, answers, 'algoResult');
                });
            }
        });
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


